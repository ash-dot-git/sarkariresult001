import Image from 'next/image';
import Link from 'next/link';

/**
 * @component NewsCard
 * @description Responsive article card for the news listing page.
 * Matches the site's Faustina serif font and red accent color scheme.
 *
 * @param {Object} props
 * @param {string} props.title - Article headline (h1 or seoTitle)
 * @param {string} props.slug - URL slug
 * @param {string} [props.category] - Category label
 * @param {string} [props.pubDate] - Publication date string
 * @param {string|null} [props.image] - Article image URL
 * @param {string} [props.metaDescription] - Article excerpt
 * @param {string[]} [props.trendingTags] - Array of tag strings
 * @param {string} [props.source] - News source name
 */
export default function NewsCard({
  title,
  slug,
  category,
  pubDate,
  image,
  metaDescription,
  trendingTags = [],
  source,
}) {
  /** Format date for display */
  const formattedDate = (() => {
    try {
      if (!pubDate) return '';
      const d = new Date(pubDate);
      if (isNaN(d.getTime())) return pubDate;
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return pubDate || '';
    }
  })();

  const displayTags = trendingTags.slice(0, 3);

  return (
    <article
      className="group relative flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
      style={{ '--accent': '#cd0808' }}
    >
      {/* Image Section */}
      <Link href={`/news/${slug}`} className="block relative aspect-[16/9] overflow-hidden bg-gray-100">
        {image ? (
          <Image
            src={image}
            alt={title || 'News article image'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
            <svg className="w-12 h-12 text-red-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
        {/* Category Badge */}
        {category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white rounded-md shadow-sm"
            style={{ backgroundColor: '#cd0808' }}
          >
            {category}
          </span>
        )}
      </Link>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Source + Date Row */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {source && (
            <>
              <span className="font-semibold text-gray-700">{source}</span>
              <span>•</span>
            </>
          )}
          {formattedDate && <time dateTime={pubDate}>{formattedDate}</time>}
        </div>

        {/* Title */}
        <h2 className="text-clamp-2 text-[1.05rem] font-bold leading-tight text-gray-900 group-hover:text-red-700 transition-colors duration-200">
          <Link href={`/news/${slug}`}>{title}</Link>
        </h2>

        {/* Excerpt */}
        {metaDescription && (
          <p className="text-clamp-2 text-sm text-gray-600 leading-relaxed">
            {metaDescription}
          </p>
        )}

        {/* Tags */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {displayTags.map((tag, i) => (
              <span
                key={i}
                className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-red-50 text-red-700 border border-red-100"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More */}
        <Link
          href={`/news/${slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold mt-1 transition-colors duration-200"
          style={{ color: '#cd0808' }}
        >
          Read More
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
