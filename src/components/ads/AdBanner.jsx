'use client';

import { AD_SLOTS } from '@/lib/adsense';
import AdSlot from './AdSlot';

const AdBanner = () => {
  return (
    <AdSlot
      slot={AD_SLOTS.banner}
      variant="banner"
      className="mx-auto my-2 max-w-[970px] px-2"
    />
  );
}

export default AdBanner;
