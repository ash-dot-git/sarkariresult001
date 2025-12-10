import React from 'react';
import Card from '../ui/Card';
import { getLatestImportantRecords } from '@/services/services-mndb';

export default async function LatestUpdates() {

  const result = await (async () => {
    try {
      // const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-latest-important-records`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     data: {
      //       index: 1,
      //       items: 8,
      //     },
      //     srvc: "get latest Important Records",
      //   }),
      // });

      const data = await getLatestImportantRecords({
        data: {
          index: 1,
          items: 8,
        },
        srvc: "get latest Important Records",
      })//response.json();
      return data?.data?.list || [];
    } catch (error) {
      console.error("Failed to fetch latest important records:", error);
      return [];
    }
  })();

  const jobData = result;


  return (
    <section className="container  max-w-full mx-auto p-2" aria-labelledby="latest-updates-heading">
      <h2 id="latest-updates-heading" className="sr-only">Latest Updates</h2>
      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-1 min-h-[130px] md:min-h-[160px]">
        {jobData.map((job, index) => (
          <div
            key={index}
            className={`
      ${index >= 6 ? 'block lg:block hidden' : ''}
    `}
          >
            <Card index={index} title={job.title} title_slug={job.title_slug} />
          </div>
        ))}
      </div>
    </section>
  );
};
