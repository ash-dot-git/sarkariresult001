import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function scrubBadFAQs() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = process.env.MONGODB_DB_NAME || 'datavault';
  const db = client.db(dbName);
  const collection = db.collection('news_articles');
  
  // Find all articles that have the bad generic FAQ
  const result = await collection.updateMany(
    { 'faqSection.answer': /This article covers the latest developments in Indian news/ },
    { $set: { faqSection: [] } }
  );
  
  console.log('Updated ' + result.modifiedCount + ' articles with bad FAQs');
  await client.close();
}

scrubBadFAQs().catch(console.error);
