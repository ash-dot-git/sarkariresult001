'use client';

import { AD_SLOTS } from '@/lib/adsense';
import AdSlot from './AdSlot';

export default function LeftSideAds() {
  return (
    <AdSlot
      slot={AD_SLOTS.leftSide}
      variant="sidebar"
      className="sticky top-4 mx-auto w-full max-w-[300px]"
    />
  );
}
