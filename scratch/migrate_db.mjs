/**
 * MongoDB Database Migration Script
 * 
 * Migrates ALL collections and their data from the old cluster to the new one.
 * Database: datavault
 * 
 * Usage: node scratch/migrate_db.mjs
 */

import { MongoClient } from 'mongodb';

// ─── Configuration ─────────────────────────────────────────────────────────────

const SOURCE_URI = 'mongodb+srv://newsarkariresult:7gLgAzJkW22x7XN8@data.ezaijd9.mongodb.net/?retryWrites=true&w=majority&appName=data';
const TARGET_URI = 'mongodb+srv://sarkariresultash:qUq1rbXZftNEuLTp@sarkariresult.ywn4vpl.mongodb.net/?appName=sarkariresult';
const DB_NAME = 'datavault';

const CONNECTION_OPTIONS = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 120000,
  connectTimeoutMS: 30000,
  family: 4,
  maxPoolSize: 5,
};

// ─── Migration Logic ───────────────────────────────────────────────────────────

async function migrate() {
  let sourceClient, targetClient;

  try {
    // 1. Connect to both clusters
    console.log('🔗 Connecting to SOURCE cluster...');
    sourceClient = new MongoClient(SOURCE_URI, CONNECTION_OPTIONS);
    await sourceClient.connect();
    console.log('✅ Connected to SOURCE.\n');

    console.log('🔗 Connecting to TARGET cluster...');
    targetClient = new MongoClient(TARGET_URI, CONNECTION_OPTIONS);
    await targetClient.connect();
    console.log('✅ Connected to TARGET.\n');

    const sourceDb = sourceClient.db(DB_NAME);
    const targetDb = targetClient.db(DB_NAME);

    // 2. List all collections in the source database
    const collections = await sourceDb.listCollections().toArray();
    console.log(`📦 Found ${collections.length} collection(s) in "${DB_NAME}":`);
    collections.forEach(c => console.log(`   - ${c.name} (type: ${c.type})`));
    console.log('');

    if (collections.length === 0) {
      console.log('⚠️  No collections found in source database. Nothing to migrate.');
      return;
    }

    // 3. Migrate each collection
    let totalDocsMigrated = 0;
    const results = [];

    for (const collInfo of collections) {
      const collName = collInfo.name;
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📋 Migrating collection: "${collName}"`);

      const sourceCol = sourceDb.collection(collName);
      const targetCol = targetDb.collection(collName);

      // Count source documents
      const sourceCount = await sourceCol.countDocuments();
      console.log(`   Source documents: ${sourceCount}`);

      if (sourceCount === 0) {
        console.log(`   ⏩ Skipping (empty collection)\n`);
        results.push({ collection: collName, source: 0, migrated: 0, status: 'SKIPPED (empty)' });
        continue;
      }

      // Copy indexes first (except the default _id index)
      try {
        const indexes = await sourceCol.indexes();
        const customIndexes = indexes.filter(idx => idx.name !== '_id_');
        if (customIndexes.length > 0) {
          console.log(`   📑 Copying ${customIndexes.length} custom index(es)...`);
          for (const idx of customIndexes) {
            try {
              const { key, ...options } = idx;
              delete options.v;  // Remove version field
              delete options.ns; // Remove namespace field
              await targetCol.createIndex(key, options);
              console.log(`      ✅ Index "${idx.name}" created`);
            } catch (idxErr) {
              if (idxErr.code === 85 || idxErr.code === 86) {
                console.log(`      ⚠️  Index "${idx.name}" already exists, skipping`);
              } else {
                console.warn(`      ⚠️  Failed to create index "${idx.name}":`, idxErr.message);
              }
            }
          }
        }
      } catch (idxError) {
        console.warn(`   ⚠️  Could not copy indexes:`, idxError.message);
      }

      // Migrate data in batches to avoid memory issues
      const BATCH_SIZE = 500;
      let migratedCount = 0;
      let batchNum = 0;

      const cursor = sourceCol.find({}).batchSize(BATCH_SIZE);

      while (await cursor.hasNext()) {
        const batch = [];
        for (let i = 0; i < BATCH_SIZE && await cursor.hasNext(); i++) {
          batch.push(await cursor.next());
        }

        if (batch.length > 0) {
          batchNum++;
          try {
            const insertResult = await targetCol.insertMany(batch, { ordered: false });
            migratedCount += insertResult.insertedCount;
            process.stdout.write(`\r   📥 Batch ${batchNum}: ${migratedCount}/${sourceCount} documents migrated`);
          } catch (insertErr) {
            // Handle duplicate key errors (documents already exist in target)
            if (insertErr.code === 11000) {
              const inserted = insertErr.result?.insertedCount || insertErr.insertedCount || 0;
              const dupes = batch.length - inserted;
              migratedCount += inserted;
              process.stdout.write(`\r   📥 Batch ${batchNum}: ${migratedCount}/${sourceCount} migrated (${dupes} duplicates skipped)`);
            } else {
              throw insertErr;
            }
          }
        }
      }

      await cursor.close();
      console.log(`\n   ✅ Done: ${migratedCount} documents migrated\n`);
      totalDocsMigrated += migratedCount;
      results.push({ collection: collName, source: sourceCount, migrated: migratedCount, status: 'OK' });
    }

    // 4. Verification — count documents in target and compare
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🔍 VERIFICATION — Comparing source vs target counts:\n`);

    let allMatch = true;
    for (const r of results) {
      if (r.status === 'SKIPPED (empty)') {
        console.log(`   ${r.collection}: SKIPPED (empty)`);
        continue;
      }

      const targetCount = await targetDb.collection(r.collection).countDocuments();
      const match = targetCount >= r.source;
      const icon = match ? '✅' : '❌';
      console.log(`   ${icon} ${r.collection}: source=${r.source}, target=${targetCount}`);
      if (!match) allMatch = false;
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`\n📊 Migration Summary:`);
    console.log(`   Collections processed: ${collections.length}`);
    console.log(`   Total documents migrated: ${totalDocsMigrated}`);
    console.log(`   Status: ${allMatch ? '✅ ALL VERIFIED' : '⚠️ SOME MISMATCHES — check above'}`);
    console.log('');

  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    console.log('🔒 Closing connections...');
    if (sourceClient) await sourceClient.close();
    if (targetClient) await targetClient.close();
    console.log('Done.\n');
  }
}

migrate();
