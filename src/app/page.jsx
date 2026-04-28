import Image from 'next/image';
import dynamic from 'next/dynamic';
import UpcomingScroller from '@/components/sections/UpcomingScroller';

const LatestUpdates = dynamic(() => import('@/components/sections/LatestUpdates'));
const CategoryColumns = dynamic(() => import('@/components/sections/CategoryColumns'));
const SearchSection = dynamic(() => import('@/components/sections/SearchSection'));
import { callApi } from '@/lib/api-server';
import ListingSearchTable from "@/components/ui/ListingSearchTable";
import { getComprehensiveSchema } from "@/lib/getComprehensiveSchema";
import FilterSection from '@/components/sections/FilterSection';

export const metadata = {
  alternates: {
    canonical: 'https://newsarkariresult.co.in',
  },
};

export default async function Page({ searchParams }) {
  searchParams = await searchParams;
  const searchQuery = searchParams?.s;

  const schema = getComprehensiveSchema({
    pageType: searchQuery ? 'SearchResultsPage' : 'WebPage',
    url: 'https://newsarkariresult.co.in/',
    title: 'Sarkari Result | Sarkari Result 2025 | newsarkariresult.co.in',
    description: 'Find Sarkari Result updates, Online Forms, Admit Cards, Answer Keys, Syllabus, Sarkari Yojana, and Scholarships. Stay updated with the latest government job alerts in India – trusted by millions.',
    thumbnailUrl: 'https://newsarkariresult.co.in/banner.png',
    datePublished: '2024-01-01T00:00:00+00:00',
  });

  if (searchQuery) {
    return (
      <main className="w-full flex flex-col py-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <ListingSearchTable title={`Search Results for "${searchQuery}"`} query={searchQuery} />
      </main>
    );
  }

  const upcomingPostsData = await callApi('getCategoryRecords', {
    category: 'upcoming',
    index: 1,
    items: 10,
  });
  const upcomingPosts = upcomingPostsData?.data?.list || [];

  return (
    <main className="w-full flex flex-col py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Text + LIVE Badge - Centered */}
      <section className="flex flex-col hidden items-center justify-center gap-2 px-2 text-center" aria-labelledby="site-introduction">
        <h1 id="site-introduction" className="sr-only">Welcome to Sarkari Result</h1>
        <p id="site-describtion" className="text-[1.05rem] max-w-4xl  leading-none">
          <span className="font-bold">Sarkari Result</span> Get Online Form, Results, Admit Card, Answer Key, Syllabus, Career News, Sarkari Yojana, Scholarship, Sarkari Notice etc.
        </p>
        {/* <div
          className="flex items-center  gap-2 text-white text-xs font-semibold px-3 py-1"
          role="status"
          aria-label="Live updates"
        >
          <Image
            src="/gifs/live.webp"
            alt="Live Update"
            width={80}
            height={26}
            priority
            className="object-contain"
            unoptimized
          />
        </div> */}
      </section>

      <section className="w-full px-2">
        <div className={`grid grid-cols-1 gap-2 ${upcomingPosts.length > 0 ? 'md:grid-cols-[minmax(0,1fr)_400px]' : ''}`}>
          <div className="-mt-2 overflow-visible">
            <FilterSection/>
          </div>
          {upcomingPosts.length > 0 && (
            <div className="w-full md:w-[400px]">
              <UpcomingScroller posts={upcomingPosts} />
            </div>
          )}
        </div>
      </section>


      <SearchSection animatedPlaceholderTitles={upcomingPosts.map(p => p.title)} />

      <LatestUpdates />
      <CategoryColumns />
    </main>
  );
}
