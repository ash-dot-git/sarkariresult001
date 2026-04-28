export function loadAd() {
  if (typeof window === 'undefined') return;

  try {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('AdSense render failed:', error);
    }
  }
}
