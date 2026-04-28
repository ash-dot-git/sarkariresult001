'use client';

import { AD_SLOTS } from '@/lib/adsense';
import AdSlot from './AdSlot';

export default function AdBottom() {
  return (
    <AdSlot
      slot={AD_SLOTS.bottom}
      variant="bottom"
      className="mx-auto my-3 max-w-[970px] px-2"
    />
  );
}
