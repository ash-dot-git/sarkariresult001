import Link from 'next/link';
import Image from 'next/image';
import { getCategoryRecords } from '@/services/services-mndb';

export const revalidate = 30; // ISR: Refresh after 30s

export default async function ListingTable({ title, category, items = 15, basePath = '' }) {

  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-category-records`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     data: {
  //       category,
  //       index: 1,
  //       items,
  //     },
  //     srvc: "get category records",
  //   }),
  // });

  const json = await getCategoryRecords({
    data: {
      category,
      index: 1,
      items,
    },
    srvc: "get category records",
  })//res.json();
  const records = json?.data?.list || [];


  return (
    <div className='w-full min-h-[200px]'>
      <div className="border border-gray-300 rounded-sm overflow-hidden mb-2 flex flex-col">
        <h2 className="bg-[#A80909] text-white text-base md:text-2xl lg:text-3xl tracking-wide text-center font-bold px-4">
          {title}
        </h2>
        <ul className="divide-y divide-gray-400 min-h-[100px]">
          {records.length === 0 ? (
            <li className="p-4 text-center">No records found.</li>
          ) : (
            records.map((record, index) => (
              <li key={index} className="bg-white hover:bg-gray-50 active:bg-gray-100 group flex items-top pl-1 py-1">
                <span className="mr-1 text-black select-none">•</span>
                <Link
                  href={`${basePath}/${record.title_slug}`}
                  title={record.title}
                  target="_blank"
                  rel="noopener"
                  className=" font-semibold leading-tight text-blue-700  transition-transform duration-150 ease-in-out hover:scale-[1.03] active:scale-[1.02] focus-visible:scale-[1.02]"
                >
                  {/* Bullet */}

                  {/* Title+GIF */}
                  <span className="text-sm sm:text-base group-hover:text-[#e65100] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-2 active:text-[#e65100] active:underline active:decoration-1 active:underline-offset-2">
                    {record.title}

                    {record?.show?.new && (
                      <Image
                        src="/gifs/new3.webp"
                        alt="New"
                        width={40}      // Balanced width
                        height={16}     // Matches text line height better
                        priority
                        className="object-contain inline align-top"
                      />
                    )}
                  </span>
                </Link>
              </li>

            ))
          )}
        </ul>
        {records.length >= items && (
          <div className="flex justify-center text-center bg-[#05055f] text-lg md:text-xl lg:text-2xl mt-2">
            <Link
              href={`/${category}`}
              className="text-[#fffff0] font-semibold inline-block w-full hover:underline"
              title={`View more ${title}`}
              aria-label={`View more ${title}`}
            >
              View More
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
