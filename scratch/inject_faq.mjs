import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function injectTestFAQ() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || 'datavault');
  
  await db.collection('news_articles').updateOne(
    { slug: 'most-exit-polls-give-edge-to-bjp-in-bengal-udf-in-kerala-p' },
    { $set: { faqSection: [
      { question: 'Why are exit polls predicting a BJP advantage in West Bengal?', answer: 'The exit polls indicate a shift in voter sentiment towards the BJP, likely driven by anti-incumbency factors and national-level campaigning strategies.' },
      { question: 'What does a UDF victory mean for Kerala politics?', answer: 'A UDF victory would mark a return to power for the Congress-led alliance, ending the current LDF government\'s term and potentially shifting state-level policies.' },
      { question: 'How accurate are these exit polls historically?', answer: 'While exit polls provide a strong indication of trends, they have historically had varying margins of error in Indian elections. The final results may differ slightly when actual votes are counted.' }
    ] } }
  );
  console.log('Injected test FAQs!');
  await client.close();
}

injectTestFAQ().catch(console.error);
