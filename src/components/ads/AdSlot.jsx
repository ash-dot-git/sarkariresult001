'use client';

import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!slot || !ADSENSE_CLIENT || !adRef.current) return;
    if (adRef.current.dataset.adsenseRendered === 'true') return;

    adRef.current.dataset.adsenseRendered = 'true';

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      adRef.current.dataset.adsenseRendered = 'false';

      if (process.env.NODE_ENV !== 'production') {
        console.warn('AdSense render failed:', error);
      }
    }
  }, [slot]);

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
