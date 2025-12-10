 // src/app/sarkari-result/page.jsx

import ListingTable from "@/components/ui/ListingTable";
import FilterSection from '@/components/sections/FilterSection';
import { getComprehensiveSchema } from "@/lib/getComprehensiveSchema";
import { categoryData } from '@/data/categoryData';
// import AdPlacementHint from '@/components/ads/AdPlacementHint';
import FAQ from '@/components/sections/FAQ';
import SocialFollow from '@/components/ui/SocialFollow';

export async function generateMetadata() {
  const data = categoryData['default'];
  return {
    title: data.title,
    description: data.description,
  };
}

export default async function SarkariResultPage() {
  const data = categoryData['default'];
  const pageUrl = 'https://newsarkariresult.co.in/sarkari-result';

  const schema = getComprehensiveSchema({
    pageType: 'WebPage',
    url: pageUrl,
    title: data.title,
    description: data.description,
  });

  return (
    <main className="w-full flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="py-6 px-4">
        <h1 className="text-3xl font-bold text-left mb-4">Sarkari Result</h1>
        <p className="text-left text-lg text-gray-600 max-w-4xl mb-8">
          {data.intro}
        </p>
      </div>

      <section className="mb-8 px-4">
        <FilterSection showViewAll={false} />
      </section>

      <div className="my-4">
        {/* <AdPlacementHint /> */}
      </div>

      <section className="px-4">
        <ListingTable title="Latest Jobs" category='latest-jobs' basePath='/latest-jobs' />
      </section>

      <SocialFollow />

      <div className="my-4">
        {/* <AdPlacementHint /> */}
      </div>

      <FAQ faqs={data.faqs} pageUrl={pageUrl} pageTitle={data.title} />
    </main>
  );
}