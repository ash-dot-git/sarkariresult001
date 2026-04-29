import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db/connection';
import { fetchRSSFeeds } from '@/lib/rss';
import { rewriteArticle } from '@/lib/aiRewriter';
import { toSlug } from '@/lib/slugify';
import { scrapeArticleContent } from '@/lib/articleScraper';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(request) {
  try {
    const body = await request.json();
    const { customApiKey } = body;

    // Optional: You could require customApiKey here, or allow fallback
    // For now we pass it to rewriteArticle which handles the fallback

    const rawArticles = await fetchRSSFeeds();
    if (rawArticles.length === 0) {
      return NextResponse.json({ stat: false, message: 'No articles fetched from RSS.' }, { status: 400 });
    }

    const collection = await getCollection('news_articles');
    
    // Ensure indexes
    await collection.createIndex({ slug: 1 }, { unique: true, background: true });

    let successCount = 0;
    let skipCount = 0;
    const maxArticlesToProcess = 10; // Process in chunks to avoid Vercel 10s timeout, or run long if local. 
    // Wait, in a Vercel serverless function, it might timeout after 10s or 60s. 
    // We will limit it to process only a few, or do it asynchronously.
    // For this implementation, we will process up to 5 articles per request to be safe.
    
    const articlesToProcess = rawArticles.slice(0, 5);

    for (let i = 0; i < articlesToProcess.length; i++) {
      const article = articlesToProcess[i];
      
      // Check if it already exists to save AI tokens
      const existingSlug = toSlug(article.title);
      const exists = await collection.findOne({ slug: existingSlug });
      if (exists) {
        skipCount++;
        continue;
      }

      // Scrape if needed
      if (!article.fullContent || article.fullContent.length < 200) {
        const scraped = await scrapeArticleContent(article.link);
        if (scraped && scraped.length > 100) {
          article.fullContent = scraped;
        }
      }

      try {
        const rewritten = await rewriteArticle(article, customApiKey);
        const slug = toSlug(rewritten.seoTitle || article.title);

        if (!slug) {
          skipCount++;
          continue;
        }

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
      } catch (error) {
        console.error("Rewrite failed:", error.message);
        skipCount++;
      }
    }

    return NextResponse.json({
      stat: true,
      message: `Generated ${successCount} articles. Skipped ${skipCount}.`,
      data: { successCount, skipCount }
    });

  } catch (error) {
    console.error('[API] POST /api/admin/news/generate failed:', error);
    return NextResponse.json({ stat: false, message: error.message }, { status: 500 });
  }
}
