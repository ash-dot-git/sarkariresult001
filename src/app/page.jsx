import Image from 'next/image';
import dynamic from 'next/dynamic';
import UpcomingScroller from '@/components/sections/UpcomingScroller';
import { examTypeOptions, applicableStatesOptions, minimumQualificationOptions } from '@/data/filters';

const LatestUpdates = dynamic(() => import('@/components/sections/LatestUpdates'), { ssr: true });
const CategoryColumns = dynamic(() => import('@/components/sections/CategoryColumns'), { ssr: true });
const SearchSection = dynamic(() => import('@/components/sections/SearchSection'), { ssr: true });
import ListingSearchTable from "@/components/ui/ListingSearchTable";
import { getComprehensiveSchema } from "@/lib/getComprehensiveSchema";
import FilterSection from '@/components/sections/FilterSection';
import { getCategoryRecords } from '@/services/services-mndb';

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

  const upcomingPostsData = await (async () => {
    try {
      // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-category-records`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     data: {
      //       category: "upcoming",
      //       index: 1,
      //       items: 10,
      //     },
      //     srvc: "get category records",
      //   }),
      // });

      const result = await getCategoryRecords({
        data: {
          category: "upcoming",
          index: 1,
          items: 10,
        },
        srvc: "get category records",
      }) //response.json();
      return result?.data?.list || [];
    } catch (error) {
      console.error("Failed to fetch upcoming posts:", error);
      return [];
    }
  })();

  const upcomingPosts = upcomingPostsData;


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
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_400px] gap-2">
          <div className="-mt-2 overflow-hidden">
            <FilterSection />

          </div>
          <div className="w-full md:w-[400px]">
            <UpcomingScroller posts={upcomingPosts} />
          </div>
        </div>
      </section>


      <SearchSection animatedPlaceholderTitles={upcomingPosts.map(p => p.title)} />

      <LatestUpdates />
      <CategoryColumns />
      {/* Top Sarkari Result Pages / टॉप सरकारी रिजल्ट पेज */}
      <section className="bg-white p-6 sm:p-8 my-6 border-t border-b border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-red-600 text-center">
          Top New Sarkari Result Pages / टॉप सरकारी रिजल्ट पेज
        </h2>

        {/* Dynamic links - Exam Types */}
        <h3 className="text-xl font-semibold mb-3 text-red-600">By Exam Type / परीक्षा प्रकार</h3>
        <ul className="columns-2 md:columns-3 gap-4 list-inside list-disc text-gray-800 mb-6">
          {examTypeOptions.map((exam) => (
            <li key={exam.key} className="break-inside-avoid">
              <a href={`https://newsarkariresult.co.in/sarkari-result/${exam.key}`} className="text-blue-600 hover:underline">
                New Sarkari Result {exam.label} / {exam.labelx}
              </a>
            </li>
          ))}
        </ul>

        {/* Dynamic links - States */}
        <h3 className="text-xl font-semibold mb-3 text-red-600">By State / राज्य अनुसार</h3>
        <ul className="columns-2 md:columns-3 gap-4 list-inside list-disc text-gray-800 mb-6">
          {applicableStatesOptions.map((state) => (
            <li key={state.key} className="break-inside-avoid">
              <a href={`https://newsarkariresult.co.in/sarkari-result/${state.key}`} className="text-blue-600 hover:underline">
                New Sarkari Result {state.label} / {state.labelx}
              </a>
            </li>
          ))}
        </ul>

        {/* Dynamic links - Minimum Qualifications */}
        <h3 className="text-xl font-semibold mb-3 text-red-600">By Qualification / योग्यता अनुसार</h3>
        <ul className="columns-2 md:columns-3 gap-4 list-inside list-disc text-gray-800">
          {minimumQualificationOptions.map((qual) => (
            <li key={qual.key} className="break-inside-avoid">
              <a href={`https://newsarkariresult.co.in/sarkari-result/${qual.key}`} className="text-blue-600 hover:underline">
                New Sarkari Result {qual.label} / {qual.labelx}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Official Website & FAQ Section */}
      <section className="bg-white p-6 sm:p-8 my-6 border-t border-b border-gray-200">
        {/* Official Website Info */}
        <h2 className="text-2xl font-bold mb-4 text-red-600 text-center">New Sarkari Result Official Website / हमारी आधिकारिक वेबसाइट</h2>
        <p className="text-gray-800 leading-relaxed mb-2 text-justify">
          <strong>English:</strong> <a href="https://newsarkariresult.co.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NewSarkariResult.co.in</a> and <a href="https://newrojgarresult.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">NewRojgarResult.com</a> are authentic platforms managed by a professional team with over 14 years of experience in tracking government jobs, results, and exam notifications. We monitor official government portals, cross-verify all details multiple times, and summarize information for easy understanding. We never ask for user login or personal details, ensuring complete privacy.
        </p>
        <p className="text-gray-800 leading-relaxed mb-4 text-justify">
          Our platforms provide real-time updates for government job vacancies, exam results, admit cards, answer keys, and official notices. Ads are displayed only to support our team, as we do not earn from posts directly. We guarantee accuracy, trust, and timely updates so aspirants can rely on us.
        </p>
        <p className="text-gray-600 text-sm text-justify">
          <strong>Disclaimer:</strong> These websites are independent and are not officially associated with any government or official websites. All information is provided for general informational purposes only.
        </p>

        {/* FAQ – New Sarkari Result / अक्सर पूछे जाने वाले प्रश्न */}
        <section className=" p-6 bg-white border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-red-600 text-center">
            FAQ – New Sarkari Result / अक्सर पूछे जाने वाले प्रश्न
          </h2>

          <div className="space-y-4 text-gray-800">
            <div>
              <h3 className="font-semibold">What is New Sarkari Result?</h3>
              <p>
                New Sarkari Result provides the latest updates on government job vacancies, exam results, admit cards, answer keys, and other official notifications across India. Our platform ensures aspirants receive accurate, verified, and up-to-date information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">How can I check the latest government job vacancies?</h3>
              <p>
                Visit our official websites <a href="https://newsarkariresult.co.in" className="text-blue-600 hover:underline">newsarkariresult.co.in</a> or <a href="https://newrojgarresult.com" className="text-blue-600 hover:underline">newrojgarresult.com</a> and navigate to the “Latest Jobs” section to view all current government job openings.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Is the website free to use?</h3>
              <p>
                Yes! Both New Sarkari Result and New Rojgar Result are completely free to use. You can access all information without charges, subscriptions, or the need to submit personal details.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Can I generate a poster for a job or result post?</h3>
              <p>
                Yes, certain posts allow poster generation. You will see the “Generate Poster” option beside the post title at the top and in the Important Links section. If the option is disabled, poster generation is not available for that particular post.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">How do you ensure the authenticity of your information?</h3>
              <p>
                Our team with 14+ years of experience continuously monitors government portals, official notifications, and employment news. Each update is cross-verified multiple times for accuracy before being published, ensuring 100% reliability.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Are your results and updates official?</h3>
              <p>
                While we provide accurate and verified information, New Sarkari Result is not an official government website. All data is collected from official sources and presented clearly for aspirants’ convenience.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Can I trust your site for exam notifications and admit cards?</h3>
              <p>
                Absolutely. We track updates from all central and state government portals, boards, and departments. Every exam notification, admit card release, and result announcement is carefully verified before posting.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Do I need to create an account to access information?</h3>
              <p>
                No. You can freely browse all job updates, results, and notices without registration. We never ask for personal details like emails, phone numbers, or login credentials.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">How often is the information updated?</h3>
              <p>
                Updates are posted in real-time. We continuously monitor government portals and employment news, so users can trust they are viewing the most current information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Do you show advertisements?</h3>
              <p>
                Yes, we show minimal ads to support our team and website maintenance. Our focus remains on accurate and trustworthy information; ads never interfere with content quality.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Which states and exams do you cover?</h3>
              <p>
                We cover all major exams in India including UPSC, SSC, Banking, Railways, State Government, Teaching, Defence, Police, PSU jobs, and Judiciary. Updates from all states including MP, UP, Bihar, Maharashtra, and more are available on our portal.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Can I rely on your site for competitive exam preparation updates?</h3>
              <p>
                Yes. Our portal also provides answer keys, syllabi, admit card links, and official notices that help aspirants plan their exam preparation effectively.
              </p>
            </div>
          </div>
        </section>

      </section>

    </main>
  );
}
