import { AD_SLOTS } from '@/lib/adsense';
import AdSlot from './AdSlot';

const InArticleAd = () => {
  return (
    <AdSlot
      slot={AD_SLOTS.inArticle}
      variant="inArticle"
      format="fluid"
      layout="in-article"
      textAlign="center"
      className="mx-auto my-4 max-w-[760px] px-2 md:my-6"
    />
  );
};

export default InArticleAd;
