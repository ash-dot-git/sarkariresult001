#!/usr/bin/env node

/**
 * @script generateNews.mjs
 * @description CLI script to fetch RSS feeds, rewrite articles via Gemini AI,
 * and save them to MongoDB (news_articles collection) for ISR pages.
 *
 * Usage: node scripts/generateNews.mjs           # normal run (skips if fresh)
 *        node scripts/generateNews.mjs --force    # force regeneration
 *        npm run news:generate
 */

import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, resolve } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
config({ path: resolve(projectRoot, '.env') });

/**
 * Converts a file path to a file:// URL for ESM dynamic import (Windows-safe).
 * @param {string} filePath
 * @returns {string}
 */
const toFileUrl = (filePath) => pathToFileURL(filePath).href;

// Dynamic imports for src/lib modules (ESM + Windows path workaround)
const { fetchRSSFeeds } = await import(toFileUrl(resolve(projectRoot, 'src/lib/rss.js')));
const { rewriteArticle } = await import(toFileUrl(resolve(projectRoot, 'src/lib/aiRewriter.js')));
const { toSlug } = await import(toFileUrl(resolve(projectRoot, 'src/lib/slugify.js')));
const { scrapeArticleContent } = await import(toFileUrl(resolve(projectRoot, 'src/lib/articleScraper.js')));

// MongoDB helper (standalone — no @/ alias dependency)
const { saveArticles, isCacheStale, closeDb } = await import(toFileUrl(resolve(__dirname, 'newsDb.mjs')));

// CLI flags
const isForce = process.argv.includes('--force');

/** Delay utility */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Main generation pipeline.
 */
async function main() {
  console.log('\n🗞️  News Article Generator');
  console.log('═'.repeat(50));

  if (isForce) {
    console.log('⚡ Force mode enabled — skipping freshness check');
  }

  // Check if cache is still fresh (skip if --force)
  if (!isForce && !await isCacheStale(60)) {
    console.log(`\n✅ Articles in MongoDB are fresh. Skipping generation.`);
    console.log('💡 Use --force flag to regenerate anyway\n');
    return;
  }

  // Step 1: Fetch RSS feeds
  console.log('\n📡 Step 1: Fetching RSS feeds...');
  let rawArticles;
  try {
    rawArticles = await fetchRSSFeeds();
  } catch (error) {
    console.error('❌ Fatal: Failed to fetch RSS feeds:', error.message);
    process.exit(1);
  }

  if (rawArticles.length === 0) {
    console.error('❌ No articles fetched from any RSS feed. Exiting.');
    process.exit(1);
  }

  // Step 1.5: Scrape full content for articles missing content:encoded
  console.log(`\n🔍 Step 1.5: Scraping full content for articles without RSS body...`);
  let scrapeCount = 0;
  for (let i = 0; i < rawArticles.length; i++) {
    const article = rawArticles[i];
    if (!article.fullContent || article.fullContent.length < 200) {
      console.log(`   🌐 Scraping ${i + 1}/${rawArticles.length}: ${article.title?.substring(0, 50)}...`);
      const scraped = await scrapeArticleContent(article.link);
      if (scraped && scraped.length > 100) {
        article.fullContent = scraped;
        scrapeCount++;
        console.log(`      ✅ Got ${scraped.length} chars`);
      } else {
        console.log(`      ⚠️ No content extracted`);
      }
      // Small delay to be polite to source servers
      await delay(500);
    }
  }
  console.log(`   📊 Scraped content for ${scrapeCount} articles`);

  console.log(`\n📝 Step 2: Rewriting ${rawArticles.length} articles via Gemini AI...`);
  console.log('─'.repeat(50));

  const rewrittenArticles = [];
  let successCount = 0;
  let skipCount = 0;

  for (let i = 0; i < rawArticles.length; i++) {
    const article = rawArticles[i];
    const index = i + 1;
    const shortTitle = article.title?.substring(0, 60) || 'Untitled';

    console.log(`\n🔄 Processing ${index}/${rawArticles.length}: ${shortTitle}...`);

    try {
      const rewritten = await rewriteArticle(article);
      const slug = toSlug(rewritten.seoTitle || article.title);

      if (!slug) {
        console.warn(`⚠️ Skipping article ${index}: Could not generate slug`);
        skipCount++;
        continue;
      }

      // Check for duplicate slugs in this batch
      const isDuplicate = rewrittenArticles.some((a) => a.slug === slug);
      if (isDuplicate) {
        console.warn(`⚠️ Skipping article ${index}: Duplicate slug "${slug}"`);
        skipCount++;
        continue;
      }

      rewrittenArticles.push({
        // Original article data
        originalTitle: article.title,
        originalLink: article.link,
        source: article.source,
        pubDate: article.pubDate,
        category: article.category,
        image: article.image,
        // AI-rewritten content
        slug,
        seoTitle: rewritten.seoTitle,
        metaDescription: rewritten.metaDescription,
        h1: rewritten.h1,
        articleBody: rewritten.articleBody,
        trendingTags: rewritten.trendingTags,
        faqSection: rewritten.faqSection,
        schemaType: rewritten.schemaType,
        // Metadata
        generatedAt: new Date().toISOString(),
      });

      successCount++;
      console.log(`   ✅ Done → slug: ${slug}`);
    } catch (error) {
      console.warn(`   ⚠️ Failed: ${error.message} — skipping`);
      skipCount++;
    }

    // Rate-limit: 4.5s delay between API calls (Gemini free tier = 15 RPM)
    if (i < rawArticles.length - 1) {
      await delay(4500);
    }
  }

  // Step 3: Save to MongoDB
  console.log('\n' + '─'.repeat(50));
  console.log('💾 Step 3: Saving to MongoDB (news_articles collection)...');

  if (rewrittenArticles.length > 0) {
    const result = await saveArticles(rewrittenArticles);
    console.log(`   📊 ${result.inserted} new, ${result.updated} updated`);
  } else {
    console.warn('⚠️ No articles were successfully processed. Database not updated.');
  }

  // Summary
  console.log('\n' + '═'.repeat(50));
  console.log('📊 Generation Summary:');
  console.log(`   ✅ Generated: ${successCount} articles`);
  console.log(`   ⚠️ Skipped:   ${skipCount} articles`);
  console.log(`   📄 Total:     ${rawArticles.length} articles from RSS`);
  console.log('═'.repeat(50) + '\n');
}

// Run
main()
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await closeDb();
  });
