export function loadAd() {
  if (typeof window === 'undefined') return;

  try {
    if (window.__adsenseLoaded && typeof window.adsbygoogle !== 'undefined') {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('AdSense render failed:', error);
    }
  }
}
