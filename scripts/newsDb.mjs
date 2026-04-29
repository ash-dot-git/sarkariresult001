/**
 * @module newsDb
 * @description Standalone MongoDB helper for the generateNews.mjs CLI script.
 * This file does NOT use @/ path aliases since it runs outside of Next.js.
 * It provides the same interface as src/lib/newsCache.js but with its own connection.
 */

import { MongoClient } from 'mongodb';

const COLLECTION_NAME = 'news_articles';

/** @type {MongoClient|null} */
let client = null;

/**
 * Connects to MongoDB and returns the news_articles collection.
 * @returns {Promise<import('mongodb').Collection>}
 */
async function getCollection() {
  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not set in .env');
    }
    client = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    await client.connect();
  }
  const dbName = process.env.MONGODB_DB_NAME || 'datavault';
  return client.db(dbName).collection(COLLECTION_NAME);
}

/**
 * Upserts articles into MongoDB by slug.
 * @param {Array<Object>} articles
 * @returns {Promise<{inserted: number, updated: number}>}
 */
export async function saveArticles(articles) {
  const collection = await getCollection();

  // Ensure indexes
  await collection.createIndex({ slug: 1 }, { unique: true, background: true });
  await collection.createIndex({ pubDate: -1 }, { background: true });

  let inserted = 0;
  let updated = 0;

  for (const article of articles) {
    if (!article.slug) continue;

    const result = await collection.updateOne(
      { slug: article.slug },
      {
        $set: { ...article, updatedAt: new Date().toISOString() },
        $setOnInsert: { createdAt: new Date().toISOString() },
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) inserted++;
    else if (result.modifiedCount > 0) updated++;
  }

  return { inserted, updated };
}

/**
 * Checks if the newest article is older than maxAgeMinutes.
 * @param {number} [maxAgeMinutes=60]
 * @returns {Promise<boolean>}
 */
export async function isCacheStale(maxAgeMinutes = 60) {
  try {
    const collection = await getCollection();
    const newest = await collection.findOne({}, { sort: { generatedAt: -1 }, projection: { generatedAt: 1 } });

    if (!newest?.generatedAt) {
      console.log('🔄 No articles in MongoDB — will generate fresh content');
      return true;
    }

    const ageMs = Date.now() - new Date(newest.generatedAt).getTime();
    const ageMinutes = ageMs / (1000 * 60);
    const isStale = ageMinutes > maxAgeMinutes;

    console.log(`${isStale ? '🔄' : '✅'} Newest article is ${Math.round(ageMinutes)}min old (max: ${maxAgeMinutes}min) — ${isStale ? 'stale' : 'fresh'}`);
    return isStale;
  } catch (error) {
    console.warn('⚠️ Failed to check freshness:', error.message);
    return true;
  }
}

/**
 * Closes the MongoDB connection.
 */
export async function closeDb() {
  if (client) {
    await client.close();
    client = null;
  }
}
