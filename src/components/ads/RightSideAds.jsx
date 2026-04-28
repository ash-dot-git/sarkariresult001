import { AD_SLOTS } from '@/lib/adsense';
import AdSlot from './AdSlot';

export default function RightSideAds() {
  return (
    <AdSlot
      slot={AD_SLOTS.rightSide}
      variant="sidebar"
      className="sticky top-4 mx-auto w-full max-w-[300px]"
    />
  );
}
