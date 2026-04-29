/**
 * @module rss
 * @description Fetches and parses RSS feeds from major Indian news sources.
 * Returns a deduplicated array of article objects (max 50).
 */

import xml2js from 'xml2js';

/** RSS feed URLs for top Indian news sources */
const RSS_FEEDS = [
  {
    name: 'Indian Express',
    url: 'https://indianexpress.com/section/india/feed/',
  },
  {
    name: 'NDTV',
    url: 'https://feeds.feedburner.com/ndtvnews-india-news',
  },
  {
    name: 'Times of India',
    url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
  },
  {
    name: 'The Hindu',
    url: 'https://www.thehindu.com/news/national/feeder/default.rss',
  },
];

const MAX_ARTICLES = 50;

/**
 * Extracts the first image URL from an RSS item.
 * Checks media:content, media:thumbnail, enclosure, and description HTML.
 * @param {Object} item - Parsed RSS item
 * @returns {string|null} Image URL or null
 */
function extractImage(item) {
  // media:content
  if (item['media:content']?.[0]?.$?.url) {
    return item['media:content'][0].$.url;
  }
  // media:thumbnail
  if (item['media:thumbnail']?.[0]?.$?.url) {
    return item['media:thumbnail'][0].$.url;
  }
  // enclosure (usually for images)
  if (item.enclosure?.[0]?.$?.url && item.enclosure[0].$.type?.startsWith('image')) {
    return item.enclosure[0].$.url;
  }
  // Try to extract from description HTML
  const desc = Array.isArray(item.description) ? item.description[0] : item.description;
  if (typeof desc === 'string') {
    const match = desc.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match) return match[1];
  }
  return null;
}

/**
 * Strips HTML tags from a string.
 * @param {string} html - String potentially containing HTML
 * @returns {string} Plain text
 */
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
}

/**
 * Fetches and parses a single RSS feed URL.
 * @param {{ name: string, url: string }} feed - Feed config
 * @returns {Promise<Array>} Array of article objects
 */
async function fetchSingleFeed(feed) {
  try {
    const response = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewSarkariResult/1.0)',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.warn(`⚠️ RSS fetch failed for ${feed.name}: HTTP ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const parser = new xml2js.Parser({
      explicitArray: true,
      ignoreAttrs: false,
      trim: true,
    });

    const result = await parser.parseStringPromise(xml);
    const channel = result?.rss?.channel?.[0] || result?.feed;
    if (!channel) {
      console.warn(`⚠️ No channel found in RSS for ${feed.name}`);
      return [];
    }

    const items = channel.item || [];

    return items.map((item) => {
      const title = Array.isArray(item.title) ? item.title[0] : item.title || '';
      const rawTitle = typeof title === 'object' ? title._ || '' : title;

      const rawDesc = Array.isArray(item.description) ? item.description[0] : item.description || '';
      const description = stripHtml(typeof rawDesc === 'object' ? rawDesc._ || '' : rawDesc);

      // Extract full article content from content:encoded (most RSS feeds include this)
      const rawContent = item['content:encoded']
        ? (Array.isArray(item['content:encoded']) ? item['content:encoded'][0] : item['content:encoded'])
        : '';
      const fullContent = stripHtml(typeof rawContent === 'object' ? rawContent._ || '' : rawContent);

      const link = Array.isArray(item.link) ? item.link[0] : item.link || '';

      const pubDate = Array.isArray(item.pubDate) ? item.pubDate[0] : item.pubDate || '';

      const category = Array.isArray(item.category)
        ? (typeof item.category[0] === 'object' ? item.category[0]._ || '' : item.category[0])
        : '';

      return {
        title: stripHtml(rawTitle).trim(),
        description: description.substring(0, 2000),
        fullContent: fullContent.substring(0, 5000),
        link: typeof link === 'object' ? link.$.href || '' : link,
        pubDate,
        category: category || feed.name,
        image: extractImage(item),
        source: feed.name,
      };
    });
  } catch (error) {
    console.error(`❌ Error fetching RSS from ${feed.name}:`, error.message);
    return [];
  }
}

/**
 * Normalizes a title for deduplication comparison.
 * @param {string} title
 * @returns {string}
 */
function normalizeTitle(title) {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Fetches RSS feeds from all configured Indian news sources,
 * deduplicates by title, and returns max 50 articles.
 * @returns {Promise<Array<{title: string, description: string, link: string, pubDate: string, category: string, image: string|null, source: string}>>}
 */
export async function fetchRSSFeeds() {
  console.log('🔄 Fetching RSS feeds from', RSS_FEEDS.length, 'sources...');

  const feedPromises = RSS_FEEDS.map((feed) => fetchSingleFeed(feed));
  const results = await Promise.allSettled(feedPromises);

  let allArticles = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allArticles = allArticles.concat(result.value);
    }
  }

  // Deduplicate by normalized title
  const seen = new Set();
  const unique = [];
  for (const article of allArticles) {
    if (!article.title) continue;
    const key = normalizeTitle(article.title);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(article);
    }
  }

  const final = unique.slice(0, MAX_ARTICLES);
  console.log(`✅ Fetched ${allArticles.length} total → ${unique.length} unique → returning ${final.length}`);
  return final;
}
