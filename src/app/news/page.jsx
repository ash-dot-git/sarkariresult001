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
  title: 'Jobs News | Sarkari Result - Government Jobs & Recruitment Updates',
  description:
    'Get the latest government jobs news, recruitment updates, exam notifications, and employment alerts. Our AI-curated jobs news brings you fast, factual summaries on Sarkari Naukri, SSC, UPSC, Railway, Banking, and more. Updated hourly for job seekers and students.',
  alternates: {
    canonical: `${BASE_URL}/news`,
  },
  openGraph: {
    title: 'Jobs News | Sarkari Result - Government Jobs & Recruitment Updates',
    description:
      'Get the latest government jobs news, recruitment updates, and employment alerts. AI-curated summaries on Sarkari Naukri, exam results, and career opportunities.',
    url: `${BASE_URL}/news`,
    siteName: 'Sarkari Result',
    images: [
      {
        url: `${BASE_URL}/banner.png`,
        width: 1200,
        height: 630,
        alt: 'Jobs News - Sarkari Result',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jobs News | Sarkari Result - Government Jobs & Recruitment Updates',
    description: 'Get the latest government jobs news, recruitment updates, and employment alerts. AI-curated and updated hourly.',
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
        name: 'Jobs News',
        item: `${BASE_URL}/news`,
      },
    ],
  };

  return (
    <div className="w-full px-2 sm:px-4 py-6">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['WebPage', 'CollectionPage'],
            '@id': `${BASE_URL}/news`,
            url: `${BASE_URL}/news`,
            name: 'Jobs News - Government Jobs & Recruitment Updates',
            description: 'Get the latest government jobs news, recruitment updates, exam notifications, and employment alerts.',
            isPartOf: {
              '@id': `${BASE_URL}/#website`
            }
          })
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-1.5 text-sm text-gray-500">
          <li>
            <a href="/" className="hover:text-red-700 transition-colors">Home</a>
          </li>
          <li className="flex items-center gap-1.5">
            <span>/</span>
            <span className="font-semibold text-gray-900">Jobs News</span>
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          Jobs News
        </h1>
        <p className="mt-3 text-[0.95rem] text-gray-600 leading-relaxed max-w-4xl">
          Stay informed with our AI-powered jobs news aggregator, bringing you the most critical recruitment and employment updates from India&apos;s leading publishers. We analyze, summarize, and curate the latest government job notifications, exam results, admit cards, and career opportunities. Tailored for students, job seekers, and government exam aspirants. <strong>Updated every hour</strong> to keep you ahead.
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
