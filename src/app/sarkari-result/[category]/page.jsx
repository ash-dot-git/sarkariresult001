// src/app/sarkari-result/[category]/page.jsx
import React from 'react';

import { getComprehensiveSchema } from "@/lib/getComprehensiveSchema";
import { categoryData } from '@/data/categoryData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
// import AdPlacementHint from '@/components/ads/AdPlacementHint';
import FAQ from '@/components/sections/FAQ';
import SocialFollow from '@/components/ui/SocialFollow';
import FilterSection from '@/components/sections/FilterSection';
import {
  examTypeOptions,
  applicableStatesOptions,
  minimumQualificationOptions,
  otherTagsOptions
} from '@/data/filters';
import { getFilteredRecords } from '@/services/services-mndb';

const allFilters = [
  ...examTypeOptions,
  ...applicableStatesOptions,
  ...minimumQualificationOptions,
  ...otherTagsOptions
];

/**
 * Generates dynamic metadata for the page based on the category slug.
 * This creates unique titles and descriptions for better SEO.
 */
export async function generateMetadata({ params }) {
  const { category } = await params;
  const data = categoryData[category] || { title: category, description: `Find the latest updates and results for ${category} on Sarkari Result.` };

  const url = `https://newsarkariresult.co.in/sarkari-result/${category}`;

  return {
    title: data?.title || category,
    description: data?.description || `Find the latest updates and results for ${category} on Sarkari Result.`,
    alternates: {
      canonical: url,
    },
  };
}

export default async function SarkariResultCategoryPage({ params }) {
  const { category } = await params;
  const data = categoryData[category] || categoryData['default'];

  // If no specific data is found for the category, show a 404 page.
  if (!data) {
    notFound();
  }

  const items = 50;
  // const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-filterd-records`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     data: {
  //       category: category,
  //       index: 1,
  //       items,
  //     },
  //     srvc: "get filterd records",
  //   }),
  // });

  // parse response
  const result = await getFilteredRecords({
      data: {
        category: category,
        index: 1,
        items,
      },
      srvc: "get filterd records",
    }) //apiResponse.json();
  console.log(result);

  const categoryRecords = result?.data?.list || [];
  const categoryTitle = allFilters.find(o => o.key === category)?.label || 'Filtered Results';
  const pageUrl = `https://newsarkariresult.co.in/sarkari-result/${category}`;

  // Comprehensive schema for the main page
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const schema = getComprehensiveSchema({
    pageType: 'WebPage',
    url: pageUrl,
    title: data.title,
    description: data.description,
    faqSchema,
  });

  return (
    <main className="w-full flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="py-6 px-4">
        {/* Dynamic H1 and Introduction for strong content signal */}
        <h1 className="text-3xl font-bold text-left mb-4">{categoryTitle}</h1>
        <p className="text-left text-lg text-gray-600 max-w-4xl mb-8">
          {data.intro}
        </p>
      </div>

      <section className="mb-8 px-4">
        <FilterSection showViewAll={false} />
      </section>

      {/* First Ad Banner for monetization */}
      <div className="my-4">
        {/* <AdPlacementHint /> */}
      </div>

      <div className='w-full min-h-[200px] px-4'>
        <div className="border border-gray-300 rounded-sm overflow-hidden mb-2 flex flex-col">
          <h2 className="bg-[#A80909] text-white text-base md:text-2xl lg:text-3xl tracking-wide text-center font-bold px-4">
            {categoryTitle} Results
          </h2>
          <ul className={`divide-y divide-gray-400 min-h-[100px] overflow-hidden`}>
            {categoryRecords.length === 0 ? (
              <li key='no-records' className="p-4 text-center"> No records found.</li>
            ) : (
              categoryRecords.map((record, index) => (
                <React.Fragment key={record.unique_id || index}>
                  <li className="bg-white group flex items-top pl-2 py-1 hover:bg-gray-50 active:bg-gray-100">
                    <span className="mr-1 text-black select-none">•</span>
                    <Link
                      href={`/${record.title_slug}`}
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
                  {/* In-Article Ad placed strategically after every 10th item */}
                  {/* {(index + 1) % 10 === 0 && (
                    <li className="p-2 bg-gray-100">
                      <AdPlacementHint />
                    </li>
                  )} */}
                </React.Fragment>
              ))
            )}
          </ul>
          {categoryRecords.length >= items && (
            <div className="flex justify-center text-center bg-[#05055f] text-lg md:text-xl lg:text-2xl mt-2">
              <Link
                href={`/${category}`}
                className="text-[#fffff0] font-semibold inline-block w-full hover:underline"
              >
                View More
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Social Follow buttons to build community */}
      <SocialFollow />

      {/* Second Ad Banner for monetization */}
      <div className="my-4">
        {/* <AdPlacementHint /> */}
      </div>

      {/* FAQ Section with Schema for Rich Snippets */}
      <FAQ faqs={data.faqs} />
    </main>
  );
}

/**
 * Generates static paths for all categories at build time.
 * This helps Next.js to pre-render these pages for faster performance.
 */
export async function generateStaticParams() {
  return allFilters.map(item => ({
    category: item.key,
  }));
}