'use client';

import { useEffect, useRef, useCallback } from 'react';
import { ADSENSE_CLIENT } from '@/lib/adsense';

const MIN_HEIGHT_CLASS = {
  banner: 'min-h-[90px] sm:min-h-[100px] md:min-h-[120px]',
  inArticle: 'min-h-[250px] md:min-h-[280px]',
  sidebar: 'min-h-[280px] xl:min-h-[300px]',
  bottom: 'min-h-[90px] sm:min-h-[100px]',
};

export default function AdSlot({
  slot,
  variant = 'banner',
  format = 'auto',
  layout,
  layoutKey,
  responsive = true,
  textAlign,
  className = '',
}) {
  const adRef = useRef(null);
  const pushedRef = useRef(false);

  const tryPushAd = useCallback(() => {
    if (!adRef.current || pushedRef.current) return;

    try {
      // Only push if adsbygoogle is actually defined by the SDK
      if (typeof window.adsbygoogle !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushedRef.current = true;
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('AdSense render failed:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!slot || !ADSENSE_CLIENT || !adRef.current) return;

    // Reset pushed state when slot changes (e.g. route change re-mount)
    pushedRef.current = false;

    // Use requestAnimationFrame to ensure the <ins> element is in the DOM
    const rafId = requestAnimationFrame(() => {
      if (window.__adsenseLoaded) {
        // SDK already loaded — push immediately
        tryPushAd();
      } else {
        // SDK not loaded yet — listen for the custom event
        const handleReady = () => {
          // Small delay to ensure DOM is fully painted
          setTimeout(tryPushAd, 100);
        };
        window.addEventListener('adsense-ready', handleReady, { once: true });

        // Cleanup listener if component unmounts before SDK loads
        return () => {
          window.removeEventListener('adsense-ready', handleReady);
        };
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [slot, tryPushAd]);

  if (!slot || !ADSENSE_CLIENT) return null;

  const optionalProps = {};
  if (layout) optionalProps['data-ad-layout'] = layout;
  if (layoutKey) optionalProps['data-ad-layout-key'] = layoutKey;

  return (
    <div
      className={[
        'w-full overflow-hidden',
        MIN_HEIGHT_CLASS[variant] || MIN_HEIGHT_CLASS.banner,
        className,
      ].join(' ')}
    >
      <ins
        ref={adRef}
        className="adsbygoogle block w-full"
        style={{
          display: 'block',
          ...(textAlign ? { textAlign } : {}),
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        {...optionalProps}
      />
    </div>
  );
}
