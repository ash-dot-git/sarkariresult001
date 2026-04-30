import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

async function generateFAQs(slug, apiKey) {
  const prompt = `Generate 3 specific, highly relevant, realistic Frequently Asked Questions (FAQs) and detailed answers for a news article with the following title slug: "${slug}". 
The questions should genuinely help students, aspirants, or professionals understand the news. Do NOT use generic questions.

Return ONLY valid JSON in this exact format:
[
  {"question": "Specific question 1?", "answer": "Detailed answer 1."},
  {"question": "Specific question 2?", "answer": "Detailed answer 2."},
  {"question": "Specific question 3?", "answer": "Detailed answer 3."}
]`;

  let retries = 3;
  while(retries > 0) {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024, responseMimeType: 'application/json' }
      }),
    });

    if (!response.ok) {
       if (response.status === 429) {
          console.log('  -> Rate limited. Waiting 4 seconds...');
          await new Promise(r => setTimeout(r, 4000));
          retries--;
          continue;
       }
       throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) throw new Error('Empty response');
    
    return JSON.parse(content);
  }
  throw new Error('Max retries reached');
}

async function run() {
  const uri = process.env.MONGODB_URI;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!uri || !apiKey) throw new Error('Missing credentials');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || 'datavault');
  const collection = db.collection('news_articles');
  
  const articles = await collection.find({ $or: [ { faqSection: { $size: 0 } }, { faqSection: { $exists: false } } ] }).limit(50).toArray();

  let successCount = 0;
  for (const article of articles) {
    try {
      console.log(`Generating FAQs for: ${article.slug}`);
      const faqs = await generateFAQs(article.slug, apiKey);
      if (Array.isArray(faqs) && faqs.length >= 3) {
        await collection.updateOne({ _id: article._id }, { $set: { faqSection: faqs } });
        successCount++;
        console.log(`  -> Success!`);
      }
      // Very aggressive delay to avoid rate limit
      await new Promise(r => setTimeout(r, 4100));
    } catch (e) {
      console.error(`  -> Failed: ${e.message}`);
    }
  }
  
  console.log(`Finished! Successfully added FAQs to ${successCount} articles.`);
  await client.close();
}

run().catch(console.error);
