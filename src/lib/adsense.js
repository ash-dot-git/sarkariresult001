export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ||
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID ||
  'ca-pub-9894115634285043';

const DEFAULT_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT || '2383460683';

export const AD_SLOTS = {
  banner: process.env.NEXT_PUBLIC_ADSENSE_BANNER_SLOT || DEFAULT_SLOT,
  inArticle: process.env.NEXT_PUBLIC_ADSENSE_IN_ARTICLE_SLOT || '8980883965',
  leftSide: process.env.NEXT_PUBLIC_ADSENSE_LEFT_SLOT || '7428129149',
  rightSide: process.env.NEXT_PUBLIC_ADSENSE_RIGHT_SLOT || '3345413900',
  bottom: process.env.NEXT_PUBLIC_ADSENSE_BOTTOM_SLOT || '4997496219',
};

export const ADSENSE_SCRIPT_SRC =
  `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
