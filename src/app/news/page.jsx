import NewsCard from '@/components/news/NewsCard';
import { NewsBannerAd, NewsAdsterraBanner } from '@/components/news/NewsAds';
import { getCache } from '@/lib/newsCache';

/** ISR: revalidate every hour */
export const revalidate = 3600;

const BASE_URL = 'https://newsarkariresult.co.in';

/**
 * SEO metadata for the news listing page.
 */
export const metadata = {
  title: 'Latest Indian News | Sarkari Result',
  description:
    'Stay updated with the latest Indian news — politics, education, jobs, government policies, and more. AI-curated news from top Indian sources, updated hourly.',
  alternates: {
    canonical: `${BASE_URL}/news`,
  },
  openGraph: {
    title: 'Latest Indian News | Sarkari Result',
    description:
      'Stay updated with the latest Indian news — politics, education, jobs, government policies, and more.',
    url: `${BASE_URL}/news`,
    siteName: 'Sarkari Result',
    images: [
      {
        url: `${BASE_URL}/banner.png`,
        width: 1200,
        height: 630,
        alt: 'Latest Indian News - Sarkari Result',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Indian News | Sarkari Result',
    description: 'Stay updated with the latest Indian news — politics, education, jobs, government policies, and more.',
    images: [`${BASE_URL}/banner.png`],
  },
};

/**
 * News listing page — displays a grid of AI-rewritten Indian news articles.
 */
export default async function NewsPage() {
  const articles = await getCache(50);

  /** Breadcrumb schema */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'News',
        item: `${BASE_URL}/news`,
      },
    ],
  };

  return (
    <div className="w-full px-2 sm:px-4 py-6">
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1.5 text-sm text-gray-500">
          <li>
            <a href="/" className="hover:text-red-700 transition-colors">Home</a>
          </li>
          <li className="flex items-center gap-1.5">
            <span>/</span>
            <span className="font-semibold text-gray-900">News</span>
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          Latest Indian News
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          AI-curated news from India&apos;s top sources — updated hourly
        </p>
      </header>

      <div className="mb-6">
        <NewsBannerAd />
      </div>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {articles.map((article, index) => (
            <NewsCard
              key={article.slug || index}
              title={article.h1 || article.seoTitle || article.originalTitle}
              slug={article.slug}
              category={article.category}
              pubDate={article.pubDate}
              image={article.image}
              metaDescription={article.metaDescription}
              trendingTags={article.trendingTags}
              source={article.source}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📰</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            News articles are being generated
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Run <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">npm run news:generate</code> to
            fetch and process the latest Indian news articles.
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <NewsAdsterraBanner />
      </div>
    </div>
  );
}
