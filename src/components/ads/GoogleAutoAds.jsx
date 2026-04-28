import { ADSENSE_CLIENT, ADSENSE_SCRIPT_SRC } from '@/lib/adsense';

/**
 * Loads the Google AdSense script using a raw <script> tag instead of
 * Next.js <Script> to avoid the `data-nscript` attribute that AdSense rejects.
 * This is a Server Component — no 'use client' needed.
 */
export default function GoogleAutoAds() {
  if (!ADSENSE_CLIENT) return null;

  return (
    <script
      async
      src={ADSENSE_SCRIPT_SRC}
      crossOrigin="anonymous"
    />
  );
}
