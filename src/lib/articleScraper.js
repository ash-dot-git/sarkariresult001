/**
 * @module articleScraper
 * @description Fetches the full article text from the original source URL.
 * Extracts the main article content from the HTML page.
 * Used as a fallback when RSS feeds don't include content:encoded.
 */

/**
 * Strips HTML tags from a string and cleans up whitespace.
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts main article text from HTML by targeting common article selectors.
 * @param {string} html - Full page HTML
 * @returns {string} Extracted article text
 */
function extractArticleText(html) {
  // Try common article content selectors in order of specificity
  const selectors = [
    // Indian Express
    /<div[^>]*class="[^"]*full-details[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*story_details[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    // NDTV
    /<div[^>]*class="[^"]*sp-cn[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*Art-StoryBody[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    // Times of India
    /<div[^>]*class="[^"]*_s30J[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*ga-streams[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    // The Hindu
    /<div[^>]*class="[^"]*articlebody[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    // Generic article selectors
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*article-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*story-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*post-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
  ];

  for (const regex of selectors) {
    const match = html.match(regex);
    if (match && match[1]) {
      const text = stripHtml(match[1]);
      if (text.length > 200) {
        return text;
      }
    }
  }

  // Fallback: extract all <p> tags
  const paragraphs = [];
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  let pMatch;
  while ((pMatch = pRegex.exec(html)) !== null) {
    const text = stripHtml(pMatch[1]);
    if (text.length > 30) {
      paragraphs.push(text);
    }
  }

  if (paragraphs.length > 0) {
    return paragraphs.join('\n\n');
  }

  return '';
}

/**
 * Scrapes the full article text from the source URL.
 * @param {string} url - Article source URL
 * @returns {Promise<string>} Article text (may be empty if scraping fails)
 */
export async function scrapeArticleContent(url) {
  if (!url) return '';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-IN,en;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return '';
    }

    const html = await response.text();
    const articleText = extractArticleText(html);
    return articleText.substring(0, 5000);
  } catch (error) {
    console.warn(`⚠️ Scrape failed for ${url}: ${error.message}`);
    return '';
  }
}
