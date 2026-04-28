import Script from 'next/script';
import { ADSENSE_CLIENT, ADSENSE_SCRIPT_SRC } from '@/lib/adsense';

export default function GoogleAutoAds() {
  if (!ADSENSE_CLIENT) return null;

  return (
    <Script
      id="google-adsense-script"
      src={ADSENSE_SCRIPT_SRC}
      strategy="afterInteractive"
      async
      crossOrigin="anonymous"
    />
  );
}
