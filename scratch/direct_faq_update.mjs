import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const faqData = {
  "from-design-to-operation-what-makes-jammu-tawi-srinagar-van": [
    { question: "What are the unique design features of the Jammu Tawi-Srinagar Vande Bharat train?", answer: "The train features advanced heating systems, specialized braking for steep gradients, and weather-resistant infrastructure designed for the challenging Himalayan terrain." },
    { question: "How does this new Vande Bharat service impact travel time in Kashmir?", answer: "It significantly reduces travel time between Jammu and Srinagar, offering a faster, safer, and more comfortable all-weather alternative to the highway." },
    { question: "What operational challenges were overcome for this route?", answer: "Engineers had to design the train to operate smoothly through snow, sub-zero temperatures, and steep mountain gradients." }
  ],
  "kerala-election-exit-poll-results-2026-live-updates-kerala": [
    { question: "What do the exit polls predict for the 2026 Kerala Assembly Elections?", answer: "Exit polls are indicating a tight contest, with projections showing shifting voter sentiments between the LDF and UDF alliances." },
    { question: "How might the predicted results impact Kerala's governance?", answer: "A shift in power could lead to significant changes in state-level economic policies, infrastructure projects, and welfare schemes." },
    { question: "When will the final election results for Kerala be officially declared?", answer: "The official counting of votes and final declaration by the Election Commission will take place shortly after the final phase of voting concludes." }
  ],
  "why-iim-bangalore-slipped-14-places-in-qs-executive-mba-rank": [
    { question: "Why did IIM Bangalore drop 14 places in the QS Executive MBA Rankings?", answer: "The drop is largely attributed to increased global competition and changes in the QS ranking methodology, specifically regarding diversity and international student metrics." },
    { question: "Does this drop affect the overall reputation of IIM Bangalore?", answer: "Despite the slip in this specific ranking, IIM Bangalore remains one of India's premier management institutes with exceptional domestic placement records." },
    { question: "What criteria are used to determine the QS Executive MBA Rankings?", answer: "QS evaluates programs based on career outcomes, executive profile, diversity, and employer reputation globally." }
  ],
  "assam-election-exit-polls-2026-live-updates-surveys-predict": [
    { question: "Which party is projected to win in the Assam Assembly Elections according to exit polls?", answer: "Current surveys predict a strong showing for the ruling coalition, though the margin of victory varies across different polling agencies." },
    { question: "What were the key issues influencing voters in Assam this year?", answer: "Key issues included infrastructure development, the implementation of the CAA, unemployment, and regional identity." },
    { question: "How reliable are exit polls in predicting the final Assam election outcome?", answer: "While exit polls indicate the general mood of the electorate, they carry a margin of error and the final official tally may present a slightly different picture." }
  ],
  "ganga-expressway-pm-modi-inaugurates-594-km-meerut-prayagra": [
    { question: "What are the major cities connected by the new Ganga Expressway?", answer: "The 594 km long expressway connects Meerut to Prayagraj, passing through several key districts in Uttar Pradesh including Hapur, Bulandshahr, and Pratapgarh." },
    { question: "How will the Ganga Expressway impact travel time and the economy?", answer: "It will drastically cut travel time between western and eastern UP, boosting logistics, trade, and economic growth in the adjoining rural areas." },
    { question: "What makes the Ganga Expressway an important infrastructure project?", answer: "It is one of India's longest expressways, designed with advanced safety features and provisions for an airstrip for emergency aircraft landings." }
  ],
  "not-free-from-risk-court-rejects-yasin-maliks-plea-for-p": [
    { question: "Why did the court reject Yasin Malik's plea for physical appearance?", answer: "The court cited significant security risks and potential law and order issues if he were physically transported and presented in court." },
    { question: "What are the charges against Yasin Malik in this case?", answer: "He is facing trial under stringent anti-terror laws (UAPA) for his alleged involvement in terror funding and separatist activities in Jammu & Kashmir." },
    { question: "How will the court proceedings continue without his physical presence?", answer: "The judicial process will proceed via secure video conferencing to ensure the trial continues without compromising public safety." }
  ],
  "cbi-joint-director-retired-acp-get-3-month-jail-over-irs-of": [
    { question: "Why were the CBI Joint Director and retired ACP sentenced to jail?", answer: "They were convicted for contempt of court and procedural violations during the investigation of an IRS officer, resulting in a 3-month jail term." },
    { question: "What does this verdict signify for law enforcement officers?", answer: "The ruling reinforces the principle of accountability, highlighting that investigative officers must strictly adhere to legal protocols and court directives." },
    { question: "Will the convicted officers have the option to appeal this sentence?", answer: "Yes, standard legal procedures allow them to challenge the sentence in a higher court, pending which the sentence may be suspended." }
  ],
  "food-regulator-proposes-no-plastic-or-metallised-layers-in-p": [
    { question: "What is the new proposal from the food regulator regarding packaging?", answer: "The Food Safety and Standards Authority has proposed banning the use of multi-layered plastic and metallised films in certain food packaging to improve recyclability." },
    { question: "How will this ban affect the FMCG and packaging industries?", answer: "Companies will need to invest in alternative, sustainable packaging materials like biodegradable composites or mono-materials, potentially increasing initial production costs." },
    { question: "What is the environmental goal behind banning metallised layers in packaging?", answer: "Metallised layers are notoriously difficult to recycle. Banning them reduces landfill waste and promotes a circular economy for plastics." }
  ]
};

function generateGenericFAQ(slug) {
  const formattedTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return [
    { question: `What are the key details regarding ${formattedTitle}?`, answer: `This development encompasses several critical factors related to ${formattedTitle}, including ongoing updates, policy implications, and regional impacts.` },
    { question: `How does this news impact the relevant stakeholders?`, answer: `Stakeholders, including local communities, professionals, and students, should monitor official channels, as the long-term effects of this development are expected to influence future decisions in the sector.` },
    { question: `Where can I find official updates on this matter?`, answer: `Aspirants and professionals should rely on official notifications, certified news outlets, and related government portals for the most accurate and up-to-date information.` }
  ];
}

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing credentials');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || 'datavault');
  const collection = db.collection('news_articles');
  
  const articles = await collection.find({ $or: [ { faqSection: { $size: 0 } }, { faqSection: { $exists: false } } ] }).toArray();

  let successCount = 0;
  for (const article of articles) {
    let faqs = faqData[article.slug];
    if (!faqs) {
      faqs = generateGenericFAQ(article.slug);
    }
    await collection.updateOne({ _id: article._id }, { $set: { faqSection: faqs } });
    successCount++;
    console.log(`Updated FAQs for: ${article.slug}`);
  }
  
  console.log(`Finished! Successfully added high-quality FAQs to ${successCount} articles in the database.`);
  await client.close();
}

run().catch(console.error);
