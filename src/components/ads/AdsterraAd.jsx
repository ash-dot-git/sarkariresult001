'use client';

/**
 * @component AdsterraAd
 * @description Renders Adsterra ad units (banner or popunder).
 * Banner: loads a script into a container div.
 * Popunder: loads once per session using sessionStorage guard.
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Adsterra Ad component supporting banner and popunder types.
 *
 * @param {Object} props
 * @param {'banner'|'popunder'} [props.type='banner'] - Ad type
 * @param {string} [props.className=''] - Additional CSS classes (banner only)
 */
export default function AdsterraAd({ type = 'banner', className = '' }) {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const bannerKey = process.env.NEXT_PUBLIC_ADSTERRA_BANNER_KEY;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (type === 'banner' && bannerKey && containerRef.current) {
      // Load Adsterra banner script
      try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `//www.highperformanceformat.com/${bannerKey}/invoke.js`;
        script.async = true;
        script.setAttribute('data-cfasync', 'false');

        // Create the options script
        const optionsScript = document.createElement('script');
        optionsScript.type = 'text/javascript';
        optionsScript.textContent = `
          atOptions = {
            'key' : '${bannerKey}',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        `;

        containerRef.current.appendChild(optionsScript);
        containerRef.current.appendChild(script);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Adsterra banner load failed:', error);
        }
      }
    }

    if (type === 'popunder' && bannerKey) {
      // Only load once per session
      const sessionKey = 'adsterra_popunder_loaded';
      if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(sessionKey)) {
        return;
      }

      try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `//www.highperformanceformat.com/${bannerKey}/invoke.js`;
        script.async = true;
        script.setAttribute('data-cfasync', 'false');
        document.body.appendChild(script);

        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(sessionKey, 'true');
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Adsterra popunder load failed:', error);
        }
      }
    }
  }, [mounted, type, bannerKey]);

  // Don't render anything if key is not set
  if (!bannerKey) return null;

  // Popunder has no visual element
  if (type === 'popunder') return null;

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ minHeight: '250px', minWidth: '300px' }}
    />
  );
}
