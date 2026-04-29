/**
 * @module aiRewriter
 * @description Uses Google Gemini API (free tier) to rewrite news articles
 * into unique SEO-optimized content with trending tags and FAQs.
 */

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Builds the prompt for Gemini to rewrite articles.
 * @param {Object} article
 * @returns {string}
 */
function buildPrompt(article) {
  const contentText = article.fullContent || article.description || '';
  return `You are an expert SEO journalist and content writer for an Indian news and government jobs portal called "Sarkari Result" (newsarkariresult.co.in).

Rewrite this news article into unique, engaging, SEO-optimized content. Return ONLY valid JSON — no markdown, no code blocks, no explanation text before or after.

Original Article:
Title: ${article.title}
Description: ${article.description}
Full Content: ${contentText.substring(0, 3000)}
Category: ${article.category}
Published: ${article.pubDate}
Source: ${article.link}

Return exactly this JSON structure:
{
  "seoTitle": "string under 60 characters — SEO-optimized title",
  "metaDescription": "string of 150-160 characters — compelling meta description",
  "h1": "string — engaging, click-worthy headline",
  "articleBody": "string — 500 word rewrite in professional journalistic tone. Use clear paragraphs separated by \\n\\n. Cover all key facts from the original.",
  "trendingTags": ["array of 8-10 trending hashtag-style tags relevant to Indian audience"],
  "faqSection": [
    {"question": "string — Realistic question an aspirant/student would ask about this", "answer": "string — Detailed, helpful answer based on the article"},
    // Must generate exactly 3 to 5 high-quality, relevant FAQs.
  ],
  "schemaType": "NewsArticle or Article"
}

Rules:
- Write in clear, professional English
- Include relevant Indian context and perspectives
- Make the content 100% unique — do not copy from the original
- Tags should be trending Indian topics related to the article
- MUST generate 3 to 5 realistic, context-specific FAQs that genuinely help students, aspirants, or professionals understand the news. Do NOT use generic questions.
- The articleBody must be at least 400 words
- Return ONLY the JSON object, nothing else`;
}

/**
 * Attempts to extract valid JSON from a string that might contain
 * markdown code blocks or other wrapping.
 * @param {string} text - Raw response text
 * @returns {Object} Parsed JSON object
 */
function extractJSON(text) {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Try extracting from markdown code block
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      return JSON.parse(codeBlockMatch[1]);
    }
    // Try finding first { ... } block
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No valid JSON found in response');
  }
}

/**
 * Creates a fallback article object when AI rewriting fails.
 * @param {Object} article - Original article
 * @returns {Object} Fallback rewritten article
 */
function createFallback(article) {
  // Build the best possible article body from available RSS content
  const fullText = article.fullContent || article.description || '';
  let articleBody;

  if (fullText.length > 200) {
    // We have substantial content — format it into readable paragraphs
    const sentences = fullText.replace(/([.!?])\s+/g, '$1\n').split('\n').filter(s => s.trim().length > 20);
    const paragraphs = [];
    let currentParagraph = [];

    for (const sentence of sentences) {
      currentParagraph.push(sentence.trim());
      if (currentParagraph.length >= 3) {
        paragraphs.push(currentParagraph.join(' '));
        currentParagraph = [];
      }
    }
    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph.join(' '));
    }

    articleBody = paragraphs.join('\n\n');
  } else {
    // Minimal content — build a meaningful summary from what we have
    const title = article.title || 'this development';
    const source = article.source || 'news sources';
    const date = article.pubDate || 'recently';
    const category = article.category || 'India';
    const desc = article.description || '';

    articleBody = title + '\n\n' +
      (desc ? desc + '\n\n' : '') +
      'This story was originally reported by ' + source + ' on ' + date + '. ' +
      'The development pertains to the ' + category + ' sector and has drawn significant attention from readers across India.\n\n' +
      'For more details and the original coverage, readers can visit the source publication. ' +
      'Stay tuned to Sarkari Result (newsarkariresult.co.in) for continued updates on this and other important news from India.\n\n' +
      'This article is part of our AI-curated news section that brings you the most important stories from leading Indian publications including Indian Express, NDTV, Times of India, and The Hindu.';
  }

  const shortTitle = (article.title || 'this news').substring(0, 80);

  return {
    seoTitle: (article.title || 'News Update').substring(0, 60),
    metaDescription: (article.description || article.title || 'Latest news update from India').substring(0, 160),
    h1: article.title || 'Latest News Update',
    articleBody,
    trendingTags: ['#IndiaNews', '#SarkariResult', '#LatestNews', '#BreakingNews', '#IndianNews', '#TodayNews', '#NewsUpdate', '#India'],
    faqSection: [], // Avoid generating repetitive generic FAQs when AI fails
    schemaType: 'NewsArticle',
  };
}

/**
 * Rewrites a news article using Google Gemini API (free tier).
 * Returns structured SEO content including title, body, tags, and FAQs.
 *
 * @param {Object} article - Article to rewrite
 * @param {string} article.title - Original title
 * @param {string} article.description - Original description/excerpt
 * @param {string} article.link - Source URL
 * @param {string} [customApiKey] - Optional API key provided by the admin to bypass environment limits
 * @returns {Promise<{seoTitle: string, metaDescription: string, h1: string, articleBody: string, trendingTags: string[], faqSection: Array<{question: string, answer: string}>, schemaType: string}>}
 */
export async function rewriteArticle(article, customApiKey = null) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('⚠️ GEMINI_API_KEY not configured — using fallback content');
    return createFallback(article);
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: buildPrompt(article) },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'unknown');
      throw new Error(`Gemini API error: HTTP ${response.status} — ${errorBody.substring(0, 200)}`);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = extractJSON(content);

    // Validate required fields
    if (!parsed.seoTitle || !parsed.articleBody) {
      throw new Error('Response missing required fields (seoTitle or articleBody)');
    }

    return {
      seoTitle: parsed.seoTitle || '',
      metaDescription: parsed.metaDescription || '',
      h1: parsed.h1 || parsed.seoTitle || '',
      articleBody: parsed.articleBody || '',
      trendingTags: Array.isArray(parsed.trendingTags) ? parsed.trendingTags : [],
      faqSection: Array.isArray(parsed.faqSection) ? parsed.faqSection : [],
      schemaType: parsed.schemaType || 'NewsArticle',
    };
  } catch (error) {
    console.error(`❌ AI rewrite failed for "${article.title?.substring(0, 50)}...":`, error.message);
    return createFallback(article);
  }
}
