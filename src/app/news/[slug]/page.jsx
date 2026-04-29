import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import NewsFAQ from '@/components/news/NewsFAQ';
import { NewsBannerAd, NewsInArticleAd, NewsAdsterraBanner } from '@/components/news/NewsAds';
import { getArticleBySlug, getAllSlugs, getRelatedArticles } from '@/lib/newsCache';

/** ISR: revalidate every hour */
export const revalidate = 3600;

const BASE_URL = 'https://newsarkariresult.co.in';

/**
 * Generates static params for all cached news articles.
 * Used by Next.js for static generation at build time.
 * @returns {Promise<Array<{slug: string}>>}
 */
export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs
    .filter((a) => a.slug)
    .map((item) => ({
      slug: item.slug,
    }));
}

/**
 * Generates dynamic metadata for each article page.
 * @param {Object} params
 * @returns {Object} Next.js metadata object
 */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: 'Article Not Found | Sarkari Result' };
  }

  const title = article.seoTitle || article.h1 || article.originalTitle || 'News';
  const description = article.metaDescription || '';
  const canonicalUrl = `${BASE_URL}/news/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Sarkari Result',
      images: article.image
        ? [{ url: article.image, width: 1200, height: 630, alt: title }]
        : [{ url: `${BASE_URL}/banner.png`, width: 1200, height: 630, alt: title }],
      locale: 'en_IN',
      type: 'article',
      publishedTime: article.pubDate ? new Date(article.pubDate).toISOString() : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.image ? [article.image] : [`${BASE_URL}/banner.png`],
    },
  };
}

/**
 * Format a date string for display.
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  try {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr || '';
  }
}

/**
 * Splits article body into paragraphs.
 * @param {string} body
 * @returns {string[]}
 */
function splitParagraphs(body) {
  if (!body) return [];
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * News article detail page.
 * Renders the full AI-rewritten article with ads, FAQ, related articles, and structured data.
 */
export default async function NewsArticlePage({ params }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const title = article.h1 || article.seoTitle || article.originalTitle;
  const canonicalUrl = `${BASE_URL}/news/${slug}`;
  const paragraphs = splitParagraphs(article.articleBody);
  const formattedDate = formatDate(article.pubDate);

  // Related articles from MongoDB (same category, fills from other categories if needed)
  const relatedArticles = await getRelatedArticles(article.category, slug, 3);

  /** NewsArticle JSON-LD schema */
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': article.schemaType || 'NewsArticle',
    headline: title,
    description: article.metaDescription,
    url: canonicalUrl,
    datePublished: article.pubDate ? new Date(article.pubDate).toISOString() : undefined,
    dateModified: article.generatedAt || new Date().toISOString(),
    image: article.image || `${BASE_URL}/banner.png`,
    author: {
      '@type': 'Organization',
      name: 'Sarkari Result',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sarkari Result',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    keywords: article.trendingTags?.join(', '),
  };

  /** Breadcrumb schema */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'News', item: `${BASE_URL}/news` },
      { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl },
    ],
  };

  return (
    <article className="w-full px-2 sm:px-4 py-6 max-w-[800px] mx-auto">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
          <li>
            <a href="/" className="hover:text-red-700 transition-colors">Home</a>
          </li>
          <li className="flex items-center gap-1.5">
            <span>/</span>
            <Link href="/news" className="hover:text-red-700 transition-colors">News</Link>
          </li>
          <li className="flex items-center gap-1.5">
            <span>/</span>
            <span className="text-gray-900 font-medium text-clamp-2 max-w-[200px] sm:max-w-none">{title}</span>
          </li>
        </ol>
      </nav>

      {/* Article Header */}
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-3">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
          {article.category && (
            <span
              className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white rounded-md"
              style={{ backgroundColor: '#cd0808' }}
            >
              {article.category}
            </span>
          )}
          {formattedDate && (
            <time dateTime={article.pubDate} className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </time>
          )}
          {article.source && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              {article.source}
            </span>
          )}
        </div>

        {/* Trending Tags */}
        {article.trendingTags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.trendingTags.map((tag, i) => (
              <span
                key={i}
                className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-100"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Featured Image */}
      {article.image && (
        <figure className="mb-6 rounded-xl overflow-hidden">
          <Image
            src={article.image}
            alt={title}
            width={800}
            height={450}
            className="w-full h-auto object-cover"
            priority
          />
        </figure>
      )}

      {/* Header Ad */}
      <div className="mb-6">
        <NewsBannerAd />
      </div>

      {/* Article Body */}
      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
        {paragraphs.map((paragraph, index) => (
          <div key={index}>
            <p className="mb-4 text-[0.95rem] leading-[1.8]">{paragraph}</p>

            {/* In-article ad after 2nd paragraph */}
            {index === 1 && (
              <div className="my-6">
                <NewsInArticleAd />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      {article.faqSection?.length > 0 && (
        <NewsFAQ faqs={article.faqSection} />
      )}

      {/* Bottom Adsterra Banner */}
      <div className="my-8 flex justify-center">
        <NewsAdsterraBanner />
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-8 pt-6 border-t border-gray-200" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-bold text-gray-900 mb-4">
            Related News
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((related) => (
              <Link
                key={related.slug}
                href={`/news/${related.slug}`}
                className="group flex flex-col bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Related article image */}
                <div className="relative aspect-[16/9] bg-gray-100">
                  {related.image ? (
                    <Image
                      src={related.image}
                      alt={related.h1 || related.seoTitle || 'Related article'}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                      <svg className="w-8 h-8 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 text-clamp-2 group-hover:text-red-700 transition-colors duration-150">
                    {related.h1 || related.seoTitle || related.originalTitle}
                  </h3>
                  {related.category && (
                    <span className="mt-1.5 inline-block text-[10px] font-bold uppercase text-red-600">
                      {related.category}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
