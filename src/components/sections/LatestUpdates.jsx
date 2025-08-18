import React from 'react';
import Card from '../ui/Card';
import { callApi } from '@/lib/api-server';

export default async function LatestUpdates() {
  const result = await callApi('getLatestImportantRecords', {
    index: 1,
    items: 8,
  });

  const jobData = result?.data?.list || [];

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
