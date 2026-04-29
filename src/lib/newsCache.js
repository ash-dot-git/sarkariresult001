/**
 * @module newsCache
 * @description Manages news article storage in MongoDB for persistence.
 * Articles are stored in the 'news_articles' collection and persist
 * forever across deployments. New articles are upserted by slug.
 */

import { getCollection } from '@/lib/db/connection';

const COLLECTION_NAME = 'news_articles';

/**
 * Returns all cached news articles, sorted by publication date (newest first).
 * @param {number} [limit=50] - Maximum number of articles to return
 * @returns {Promise<Array<Object>>} Array of article objects
 */
export async function getCache(limit = 50) {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    const articles = await collection
      .find({})
      .sort({ pubDate: -1, generatedAt: -1 })
      .limit(limit)
      .toArray();

    // Remove MongoDB _id field for clean serialization
    return articles.map(({ _id, ...rest }) => rest);
  } catch (error) {
    console.warn('⚠️ Failed to read news from MongoDB:', error.message);
    return [];
  }
}

/**
 * Upserts (insert or update) an array of articles into MongoDB.
 * Uses the 'slug' field as the unique key — existing articles are updated,
 * new articles are inserted. Old articles are never deleted.
 *
 * @param {Array<Object>} articles - Array of article objects to save
 * @returns {Promise<{inserted: number, updated: number}>} Operation summary
 */
export async function setCache(articles) {
  try {
    const collection = await getCollection(COLLECTION_NAME);

    // Ensure slug index exists for fast lookups and upserts
    await collection.createIndex({ slug: 1 }, { unique: true, background: true });
    // Index for sorting by date
    await collection.createIndex({ pubDate: -1 }, { background: true });

    let inserted = 0;
    let updated = 0;

    for (const article of articles) {
      if (!article.slug) continue;

      const result = await collection.updateOne(
        { slug: article.slug },
        {
          $set: {
            ...article,
            updatedAt: new Date().toISOString(),
          },
          $setOnInsert: {
            createdAt: new Date().toISOString(),
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else if (result.modifiedCount > 0) {
        updated++;
      }
    }

    console.log(`✅ MongoDB: ${inserted} new articles inserted, ${updated} updated (total in batch: ${articles.length})`);
    return { inserted, updated };
  } catch (error) {
    console.error('❌ Failed to write news to MongoDB:', error.message);
    throw error;
  }
}

/**
 * Finds a single article by its slug.
 * @param {string} slug - The article slug
 * @returns {Promise<Object|null>} The article or null if not found
 */
export async function getArticleBySlug(slug) {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    const article = await collection.findOne({ slug });
    if (!article) return null;
    const { _id, ...rest } = article;
    return rest;
  } catch (error) {
    console.warn('⚠️ Failed to find article by slug:', error.message);
    return null;
  }
}

/**
 * Gets all slugs from the database (for generateStaticParams / sitemap).
 * @returns {Promise<Array<{slug: string, generatedAt: string}>>}
 */
export async function getAllSlugs() {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    return await collection
      .find({}, { projection: { slug: 1, generatedAt: 1, _id: 0 } })
      .toArray();
  } catch (error) {
    console.warn('⚠️ Failed to get slugs from MongoDB:', error.message);
    return [];
  }
}

/**
 * Checks if cache is stale based on the most recent article's generatedAt timestamp.
 * Returns true if no articles exist or the newest article is older than maxAgeMinutes.
 *
 * @param {number} [maxAgeMinutes=60] - Maximum age in minutes
 * @returns {Promise<boolean>} True if cache is stale or empty
 */
export async function isCacheStale(maxAgeMinutes = 60) {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    const newest = await collection
      .findOne({}, { sort: { generatedAt: -1 }, projection: { generatedAt: 1 } });

    if (!newest || !newest.generatedAt) {
      console.log('🔄 No articles in MongoDB — will generate fresh content');
      return true;
    }

    const ageMs = Date.now() - new Date(newest.generatedAt).getTime();
    const ageMinutes = ageMs / (1000 * 60);
    const isStale = ageMinutes > maxAgeMinutes;

    if (isStale) {
      console.log(`🔄 Newest article is ${Math.round(ageMinutes)}min old (max: ${maxAgeMinutes}min) — stale`);
    } else {
      console.log(`✅ Newest article is ${Math.round(ageMinutes)}min old (max: ${maxAgeMinutes}min) — fresh`);
    }

    return isStale;
  } catch (error) {
    console.warn('⚠️ Failed to check cache freshness:', error.message);
    return true;
  }
}

/**
 * Gets related articles for the "Related News" feature.
 * Prioritizes articles with overlapping trendingTags, then same category, then random.
 * Uses $sample to ensure variety so the same newest articles aren't repeated.
 * 
 * @param {Object} article - The current article object
 * @param {number} [limit=3] - Max articles to return
 * @returns {Promise<Array<Object>>}
 */
export async function getRelatedArticles(article, limit = 3) {
  try {
    const collection = await getCollection(COLLECTION_NAME);
    const excludeSlug = article.slug;
    
    let articles = [];
    const existingSlugs = new Set([excludeSlug]);

    // Helper to safely add articles
    const addArticles = (newArticles) => {
      for (const a of newArticles) {
        if (!existingSlugs.has(a.slug) && articles.length < limit) {
          articles.push(a);
          existingSlugs.add(a.slug);
        }
      }
    };

    // 1. Try to find articles with overlapping tags (highest relevance)
    if (article.trendingTags && article.trendingTags.length > 0) {
      const tagMatches = await collection.aggregate([
        { $match: { slug: { $ne: excludeSlug }, trendingTags: { $in: article.trendingTags } } },
        { $sample: { size: limit } }
      ]).toArray();
      addArticles(tagMatches);
    }

    // 2. Fill with same category (moderate relevance)
    if (articles.length < limit && article.category) {
      const needed = limit - articles.length;
      const categoryMatches = await collection.aggregate([
        { $match: { category: article.category, slug: { $nin: Array.from(existingSlugs) } } },
        { $sample: { size: needed } }
      ]).toArray();
      addArticles(categoryMatches);
    }

    // 3. Fallback: random articles from any category
    if (articles.length < limit) {
      const needed = limit - articles.length;
      const randomMatches = await collection.aggregate([
        { $match: { slug: { $nin: Array.from(existingSlugs) } } },
        { $sample: { size: needed } }
      ]).toArray();
      addArticles(randomMatches);
    }

    // Remove MongoDB _id field
    return articles.map(({ _id, ...rest }) => rest);
  } catch (error) {
    console.warn('⚠️ Failed to get related articles:', error.message);
    return [];
  }
}
