import Link from "next/link";
import Image from "next/image";
import FAQ from "@/components/sections/FAQ";
import { getLatestImportantRecords } from "@/services/services-mndb";

export const metadata = {
  title: "Page Not Found",
  description:
    "The page you are looking for does not exist. Find the latest government job updates, results, and admit cards on Sarkari Result.",
};

export default async function NotFound() {
  const faqs = [
    {
      question: "What does '404 Page Not Found' mean?",
      answer:
        "A 404 error indicates that the page you're looking for does not exist. It may have been moved, renamed, or deleted from our server.",
    },
    {
      question: "Where can I find the latest Sarkari Result updates?",
      answer:
        "You can always check the latest updates on our homepage or by visiting the 'Latest Updates' section right below this message.",
    },
    {
      question: "How often is Sarkari Result updated?",
      answer:
        "Our platform is updated daily with new job notifications, admit cards, and result announcements from central and state government agencies.",
    },
    {
      question: "Can I trust Sarkari Result for official job notifications?",
      answer:
        "Yes. We verify each job listing with official government sources before publishing to ensure authenticity.",
    },
    {
      question: "How do I apply for a government job listed here?",
      answer:
        "Each job post includes detailed instructions and direct links to the official application page. Just click on the job you're interested in.",
    },
    {
      question: "What if the link I clicked led me to this 404 page?",
      answer:
        "The page may have been removed or updated. Please return to the homepage or check the latest updates for the content you're seeking.",
    },
    {
      question: "Is Sarkari Result free to use?",
      answer:
        "Yes. Our service is completely free. We never charge any fees for providing job updates or information.",
    },
    {
      question: "How can I contact support if I face issues?",
      answer:
        "You can visit our Contact Us page to report broken links or any other issues. We’re always ready to assist.",
    },
    {
      question: "Can I find results and admit cards here?",
      answer:
        "Absolutely! We cover all major exam results, admit cards, and answer keys. Just check our categories or search directly.",
    },
    {
      question: "Is Sarkari Result optimized for mobile use?",
      answer:
        "Yes, our site is responsive and works perfectly across smartphones, tablets, and desktops for an uninterrupted experience.",
    },
    {
      question: "Can I share Sarkari Result links on WhatsApp or social media?",
      answer:
        "Yes, every page has a share option so you can easily forward important updates to your friends and groups.",
    },
    {
      question: "Does Sarkari Result show state-wise job listings?",
      answer:
        "Yes, we categorize jobs by state, department, and education qualification for easy filtering.",
    },
    {
      question: "Is Sarkari Result content indexed by Google?",
      answer:
        "Yes, our site is search engine optimized (SEO), ensuring content is quickly indexed by Google, Bing, and AI bots.",
    },
    {
      question: "Can I access Sarkari Result on slow internet connections?",
      answer:
        "Yes, our site is built to load quickly and efficiently even on low-bandwidth networks.",
    },
    {
      question: "Does Sarkari Result show new job alerts?",
      answer:
        "Yes, we highlight the latest job postings with a 'NEW' tag and also offer daily updates to subscribers.",
    }
  ];

  const latestUpdates = await (async () => {
    try {
      // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-latest-important-records`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     data: {
      //       index: 1,
      //       items: 15,
      //     },
      //     srvc: "get latest important records",
      //   }),
      // });

      // // parse JSON safely
      const result = await getLatestImportantRecords({
        data: {
          index: 1,
          items: 15,
        },
        srvc: "get latest important records",
      }) //response.json();
      return result?.data?.list || [];
    } catch (error) {
      console.error("Failed to fetch latest updates:", error);
      return [];
    }
  })();


  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="text-center py-12">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mt-2">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium transition"
          >
            Back to Homepage
          </Link>
        </div>
      </div>

      <div className="my-12">
        <p className="text-center p-4">
          Maybe the page you were looking for has been updated. Try exploring our latest updates to find what you need.
        </p>
        <div className="border border-gray-300 rounded-sm overflow-hidden mb-2 flex flex-col">
          <h2 className="bg-[#A80909] text-white text-base md:text-2xl lg:text-3xl tracking-wide text-center font-bold px-4">
            Latest Updates
          </h2>
          <ul className="divide-y divide-gray-400 min-h-[100px]">
            {latestUpdates.length === 0 ? (
              <li className="p-4 text-center">No records found.</li>
            ) : (
              latestUpdates.map((record, index) => (
                <li
                  key={index}
                  className="bg-white hover:bg-gray-50 active:bg-gray-100 group flex items-top pl-1 py-1"
                >
                  <span className="mr-1 text-black select-none">•</span>
                  <Link
                    href={`/${record.title_slug}`}
                    title={record.title}
                    target="_blank"
                    rel="noopener"
                    className="font-semibold leading-tight text-blue-700  transition-transform duration-150 ease-in-out hover:scale-[1.03] active:scale-[1.02] focus-visible:scale-[1.02]"
                  >
                    <span className="text-sm sm:text-base group-hover:text-[#e65100] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-2 active:text-[#e65100] active:underline active:decoration-1 active:underline-offset-2">
                      {record.title}
                      {record?.show?.new && (
                        <Image
                          src="/gifs/new3.webp"
                          alt="New"
                          width={40}
                          height={16}
                          priority
                          unoptimized
                          className="object-contain inline align-top"
                        />
                      )}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <FAQ faqs={faqs} />
    </div>
  );
}
