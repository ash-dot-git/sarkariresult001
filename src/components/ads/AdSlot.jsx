'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [mounted, setMounted] = useState(false);

  // Only render <ins> on the client to prevent hydration mismatch (React #418).
  // AdSense modifies <ins> elements in the DOM, which conflicts with React hydration.
  useEffect(() => {
    setMounted(true);
  }, []);

  const tryPushAd = useCallback(() => {
    if (!adRef.current || pushedRef.current) return false;

    try {
      if (typeof window.adsbygoogle !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        pushedRef.current = true;
        return true;
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('AdSense push failed:', error);
      }
    }
    return false;
  }, []);

  useEffect(() => {
    if (!slot || !ADSENSE_CLIENT || !mounted) return;

    // Reset pushed state on re-mount
    pushedRef.current = false;

    // Use requestAnimationFrame to ensure the <ins> element is painted
    const rafId = requestAnimationFrame(() => {
      if (tryPushAd()) return; // SDK already loaded — done

      // SDK not loaded yet — poll every 200ms for up to 10 seconds
      let attempts = 0;
      const maxAttempts = 50;
      const intervalId = setInterval(() => {
        attempts++;
        if (tryPushAd() || attempts >= maxAttempts) {
          clearInterval(intervalId);
        }
      }, 200);

      // Store for cleanup
      adRef.current._pollInterval = intervalId;
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (adRef.current?._pollInterval) {
        clearInterval(adRef.current._pollInterval);
      }
    };
  }, [slot, mounted, tryPushAd]);

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
      {mounted && (
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
      )}
    </div>
  );
}
