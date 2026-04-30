/**
 * MongoDB Atlas Scheduled Trigger — Jobs News Generator
 * 
 * This function runs on a schedule (e.g., every 1 hour) directly on MongoDB Atlas.
 * It fetches RSS feeds, rewrites articles with Gemini AI, and saves to the
 * `news_articles` collection in the `datavault` database.
 * 
 * No Vercel timeout limits — Atlas Triggers can run for up to 120-300 seconds.
 * 
 * SETUP:
 * 1. Go to Atlas → App Services → Triggers → Add Trigger
 * 2. Type: Scheduled
 * 3. Schedule: Every 1 hour (or your preference)
 * 4. Function: Paste this entire code
 * 5. In "Values" tab, create a secret called "GEMINI_API_KEY" with your key
 * 6. Link your cluster as a Data Source (default name: "mongodb-atlas")
 * 
 * CONFIGURATION — Update these values:
 */

const SERVICE_NAME = "sarkariresult";   // Your linked cluster name (check "Linked Data Sources" tab)
const DB_NAME = "datavault";
const COLLECTION_NAME = "news_articles";
const GEMINI_API_KEY = "AIzaSyAWZuFWyeOHpQ3Zu3jBuIPgvbFGOrQOnTY"; // Or use context.values.get("GEMINI_API_KEY")
const MAX_ARTICLES_PER_RUN = 15; // Process up to 15 articles per trigger run

// ─── RSS FEED SOURCES (Jobs & Education focused) ──────────────────────────────

const RSS_FEEDS = [
  { name: "Indian Express Jobs", url: "https://indianexpress.com/about/jobs/feed/" },
  { name: "NDTV Jobs", url: "https://feeds.feedburner.com/ndtvnews-jobs-news" },
  { name: "Times of India Education", url: "https://timesofindia.indiatimes.com/rssfeeds/913168846.cms" },
  { name: "The Hindu Education", url: "https://www.thehindu.com/education/feeder/default.rss" },
  { name: "Indian Express Education", url: "https://indianexpress.com/section/education/feed/" },
  { name: "NDTV Education", url: "https://feeds.feedburner.com/ndtvnews-education-news" },
];

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────────

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toSlug(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 120);
}

function extractXmlTag(xml, tagName) {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
  const match = xml.match(regex);
  if (!match) return "";
  // Handle CDATA
  const content = match[1].replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, "$1");
  return content.trim();
}

function extractImage(itemXml) {
  // media:content
  const mediaMatch = itemXml.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  if (mediaMatch) return mediaMatch[1];
  // media:thumbnail
  const thumbMatch = itemXml.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i);
  if (thumbMatch) return thumbMatch[1];
  // enclosure
  const encMatch = itemXml.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]+type=["']image/i);
  if (encMatch) return encMatch[1];
  // img in description
  const imgMatch = itemXml.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch) return imgMatch[1];
  return null;
}

// ─── RSS FETCHING (no npm modules needed) ──────────────────────────────────────

async function fetchSingleFeed(feed) {
  try {
    const response = await context.http.get({
      url: feed.url,
      headers: {
        "User-Agent": ["Mozilla/5.0 (compatible; SarkariResultBot/1.0)"],
        "Accept": ["application/rss+xml, application/xml, text/xml"],
      },
    });

    if (response.statusCode !== 200) {
      console.log(`⚠️ RSS fetch failed for ${feed.name}: HTTP ${response.statusCode}`);
      return [];
    }

    const xml = response.body.text();
    
    // Extract all <item> blocks
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      
      const rawTitle = extractXmlTag(itemXml, "title");
      const rawDesc = extractXmlTag(itemXml, "description");
      const rawContent = extractXmlTag(itemXml, "content:encoded");
      const link = extractXmlTag(itemXml, "link");
      const pubDate = extractXmlTag(itemXml, "pubDate");
      const category = extractXmlTag(itemXml, "category");
      
      const title = stripHtml(rawTitle).trim();
      if (!title) continue;
      
      items.push({
        title,
        description: stripHtml(rawDesc).substring(0, 2000),
        fullContent: stripHtml(rawContent).substring(0, 5000),
        link: link.trim(),
        pubDate,
        category: category || feed.name,
        image: extractImage(itemXml),
        source: feed.name,
      });
    }
    
    console.log(`✅ ${feed.name}: ${items.length} articles`);
    return items;
  } catch (error) {
    console.log(`❌ Error fetching ${feed.name}: ${error.message}`);
    return [];
  }
}

async function fetchAllFeeds() {
  console.log(`🔄 Fetching RSS feeds from ${RSS_FEEDS.length} sources...`);
  
  let allArticles = [];
  for (const feed of RSS_FEEDS) {
    const articles = await fetchSingleFeed(feed);
    allArticles = allArticles.concat(articles);
  }
  
  // Deduplicate by normalized title
  const seen = new Set();
  const unique = [];
  for (const article of allArticles) {
    const key = article.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(article);
    }
  }
  
  console.log(`📦 Total: ${allArticles.length} → Unique: ${unique.length}`);
  return unique;
}

// ─── ARTICLE SCRAPING ──────────────────────────────────────────────────────────

async function scrapeArticleContent(url) {
  if (!url) return "";
  try {
    const response = await context.http.get({
      url: url,
      headers: {
        "User-Agent": ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"],
        "Accept": ["text/html"],
      },
    });
    
    if (response.statusCode !== 200) return "";
    
    const html = response.body.text();
    
    // Extract <p> tags as fallback
    const paragraphs = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch;
    while ((pMatch = pRegex.exec(html)) !== null) {
      const text = stripHtml(pMatch[1]);
      if (text.length > 30) paragraphs.push(text);
    }
    
    return paragraphs.join("\n\n").substring(0, 5000);
  } catch (error) {
    console.log(`⚠️ Scrape failed: ${error.message}`);
    return "";
  }
}

// ─── GEMINI AI REWRITING ───────────────────────────────────────────────────────

function buildPrompt(article) {
  const contentText = article.fullContent || article.description || "";
  return `You are an expert SEO journalist and content writer for an Indian government jobs and recruitment portal called "Sarkari Result" (newsarkariresult.co.in).

Your ONLY focus is on content related to:
- Government jobs and Sarkari Naukri
- Recruitment notifications (SSC, UPSC, Railway, Banking, State PSC, Defence, Police, etc.)
- Exam results, admit cards, answer keys, and cutoff marks
- Education news (university admissions, board results, entrance exams, scholarships)
- Employment policies, salary revisions, DA announcements, pension updates
- Skill development and career guidance for Indian youth

If the article below is NOT related to jobs, recruitment, education, or employment, return this exact JSON:
{"skip": true, "reason": "Not related to jobs/employment"}

Otherwise, rewrite this article into unique, engaging, SEO-optimized content. Return ONLY valid JSON.

Original Article:
Title: ${article.title}
Description: ${article.description}
Full Content: ${contentText.substring(0, 3000)}
Category: ${article.category}
Published: ${article.pubDate}
Source: ${article.link}

Return exactly this JSON structure:
{
  "seoTitle": "string under 60 characters — SEO-optimized title with job/recruitment keywords",
  "metaDescription": "string of 150-160 characters — compelling meta description for job seekers",
  "h1": "string — engaging headline about the job/recruitment/education topic",
  "articleBody": "string — 500 word rewrite in professional journalistic tone. Use clear paragraphs separated by \\n\\n. Cover vacancies, eligibility, important dates, application process, salary details if available.",
  "trendingTags": ["array of 8-10 trending hashtag-style tags e.g. #SarkariNaukri, #SSC, #UPSC, #GovtJobs"],
  "faqSection": [
    {"question": "string — Practical question a job aspirant would ask", "answer": "string — Detailed answer based on the article"}
  ],
  "schemaType": "NewsArticle"
}

Rules:
- Write in clear, professional English
- Focus on information useful to job seekers and exam aspirants
- Include key details: vacancies, eligibility, dates, salary
- Make the content 100% unique
- Generate 3 to 5 realistic, job-specific FAQs
- articleBody must be at least 400 words
- Return ONLY the JSON object`;
}

async function rewriteWithGemini(article) {
  const apiKey = GEMINI_API_KEY;
  if (!apiKey) {
    console.log("⚠️ No Gemini API key configured");
    return null;
  }
  
  try {
    const response = await context.http.post({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      headers: { "Content-Type": ["application/json"] },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(article) }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
    });
    
    if (response.statusCode !== 200) {
      const errBody = response.body.text().substring(0, 200);
      console.log(`❌ Gemini API error: HTTP ${response.statusCode} — ${errBody}`);
      return null;
    }
    
    const data = JSON.parse(response.body.text());
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!content) {
      console.log("❌ Empty Gemini response");
      return null;
    }
    
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Try extracting JSON from code blocks
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No valid JSON in response");
      }
    }
    
    // Check if AI says to skip
    if (parsed.skip === true) {
      console.log(`⏩ Skipping: "${article.title.substring(0, 50)}..." — ${parsed.reason || "not relevant"}`);
      return null;
    }
    
    if (!parsed.seoTitle || !parsed.articleBody) {
      console.log("❌ Missing required fields (seoTitle/articleBody)");
      return null;
    }
    
    return {
      seoTitle: parsed.seoTitle || "",
      metaDescription: parsed.metaDescription || "",
      h1: parsed.h1 || parsed.seoTitle || "",
      articleBody: parsed.articleBody || "",
      trendingTags: Array.isArray(parsed.trendingTags) ? parsed.trendingTags : [],
      faqSection: Array.isArray(parsed.faqSection) ? parsed.faqSection : [],
      schemaType: parsed.schemaType || "NewsArticle",
    };
  } catch (error) {
    console.log(`❌ Gemini rewrite failed: ${error.message}`);
    return null;
  }
}

// ─── MAIN TRIGGER FUNCTION ─────────────────────────────────────────────────────

exports = async function() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("🚀 Jobs News Generator — Scheduled Trigger Started");
  console.log(`⏰ ${new Date().toISOString()}`);
  console.log("═══════════════════════════════════════════════════════");
  
  const collection = context.services
    .get(SERVICE_NAME)
    .db(DB_NAME)
    .collection(COLLECTION_NAME);
  
  // Ensure indexes exist
  try {
    await collection.createIndex({ slug: 1 }, { unique: true, background: true });
    await collection.createIndex({ pubDate: -1 }, { background: true });
  } catch (e) {
    console.log("Index creation note:", e.message);
  }
  
  // Step 1: Fetch RSS feeds
  const allArticles = await fetchAllFeeds();
  if (allArticles.length === 0) {
    console.log("❌ No articles fetched. Exiting.");
    return { success: false, message: "No articles from RSS" };
  }
  
  // Step 2: Filter out already-existing articles
  const newArticles = [];
  for (const article of allArticles) {
    const slug = toSlug(article.title);
    if (!slug) continue;
    const exists = await collection.findOne({ slug });
    if (!exists) {
      newArticles.push(article);
    }
  }
  
  console.log(`📋 ${allArticles.length} total → ${newArticles.length} new (not in DB)`);
  
  if (newArticles.length === 0) {
    console.log("✅ All articles already exist. Nothing to do.");
    return { success: true, message: "No new articles to process", processed: 0 };
  }
  
  // Step 3: Process articles (up to MAX_ARTICLES_PER_RUN)
  const toProcess = newArticles.slice(0, MAX_ARTICLES_PER_RUN);
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < toProcess.length; i++) {
    const article = toProcess[i];
    console.log(`\n─── [${i + 1}/${toProcess.length}] "${article.title.substring(0, 60)}..." ───`);
    
    // Scrape full content if RSS didn't provide enough
    if (!article.fullContent || article.fullContent.length < 200) {
      console.log("  📄 Scraping full article...");
      const scraped = await scrapeArticleContent(article.link);
      if (scraped && scraped.length > 100) {
        article.fullContent = scraped;
        console.log(`  ✅ Scraped ${scraped.length} chars`);
      }
    }
    
    // Rewrite with Gemini
    console.log("  🤖 Calling Gemini AI...");
    const rewritten = await rewriteWithGemini(article);
    
    if (!rewritten) {
      skipCount++;
      console.log("  ⏩ Skipped (not job-related or AI failed)");
      continue;
    }
    
    const slug = toSlug(rewritten.seoTitle || article.title);
    if (!slug) {
      skipCount++;
      continue;
    }
    
    // Save to MongoDB
    try {
      const newsDoc = {
        originalTitle: article.title,
        originalLink: article.link,
        source: article.source,
        pubDate: article.pubDate,
        category: article.category,
        image: article.image,
        slug,
        seoTitle: rewritten.seoTitle,
        metaDescription: rewritten.metaDescription,
        h1: rewritten.h1,
        articleBody: rewritten.articleBody,
        trendingTags: rewritten.trendingTags,
        faqSection: rewritten.faqSection,
        schemaType: rewritten.schemaType,
        generatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await collection.updateOne(
        { slug: newsDoc.slug },
        { $set: newsDoc },
        { upsert: true }
      );
      
      successCount++;
      console.log(`  ✅ Saved: "${rewritten.seoTitle}" → /news/${slug}`);
    } catch (error) {
      failCount++;
      console.log(`  ❌ DB save failed: ${error.message}`);
    }
    
    // Small delay between Gemini calls to be nice to the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("📊 TRIGGER RUN COMPLETE");
  console.log(`   ✅ Saved: ${successCount}`);
  console.log(`   ⏩ Skipped: ${skipCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📰 Total in DB: ${await collection.countDocuments()}`);
  console.log("═══════════════════════════════════════════════════════");
  
  return {
    success: true,
    saved: successCount,
    skipped: skipCount,
    failed: failCount,
    timestamp: new Date().toISOString(),
  };
};
