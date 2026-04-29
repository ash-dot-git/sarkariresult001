'use client';

/**
 * @component NewsAds
 * @description Client-side ad wrapper components for the news section.
 * Wraps GoogleAd and AdsterraAd so they can be used inside Server Components
 * (Next.js 16 Turbopack disallows dynamic(ssr:false) in Server Components).
 */

import GoogleAd from '@/components/ads/GoogleAd';
import AdsterraAd from '@/components/ads/AdsterraAd';

/**
 * Banner ad for the top of news pages.
 * @param {Object} props
 * @param {string} [props.className]
 */
export function NewsBannerAd({ className = '' }) {
  return <GoogleAd variant="banner" className={`mx-auto max-w-[970px] ${className}`} />;
}

/**
 * In-article ad inserted between paragraphs.
 * @param {Object} props
 * @param {string} [props.className]
 */
export function NewsInArticleAd({ className = '' }) {
  return (
    <GoogleAd
      variant="inArticle"
      format="fluid"
      className={`mx-auto max-w-[660px] ${className}`}
    />
  );
}

/**
 * Adsterra banner ad.
 * @param {Object} props
 * @param {string} [props.className]
 */
export function NewsAdsterraBanner({ className = '' }) {
  return <AdsterraAd type="banner" className={`mx-auto ${className}`} />;
}
