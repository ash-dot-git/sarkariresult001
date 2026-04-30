import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function getTitles() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || 'datavault');
  
  const articles = await db.collection('news_articles').find({ $or: [ { faqSection: { $size: 0 } }, { faqSection: { $exists: false } } ] }).toArray();
  articles.forEach(a => console.log(a.slug + '|||' + a.title));
  await client.close();
}

getTitles().catch(console.error);
