

import Link from 'next/link';
import {
  examTypeOptions,
  applicableStatesOptions,
  minimumQualificationOptions,
} from '@/data/filters';


const FilterRow = ({ options, bgColor }) => {
  return (
    <div className="relative overflow-x-auto custom-scrollbar">
      <div className="flex gap-2 p-1 md:p-2">
        {options.map((option) => (
          <Link
            key={option.key}
            href={`/sarkari-result/${option.key}`}
            title={option.label}
            className={`relative px-2 py-1 md:p-2 rounded-md text-sm font-semibold ${bgColor} whitespace-nowrap transition-all duration-100 ease-in-out transform hover:scale-105 hover:shadow-xl  focus:outline-none focus:ring-4 focus:ring-opacity-50 shadow-md hover:-translate-y-1 active:scale-95 active:shadow-inner group`}
          >
            {option.labelx}
            <span className="absolute inset-0  bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-100"></span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function FilterSection({ showViewAll = true }) {
  return (
    <section aria-labelledby="filter-section-heading">
      <h2 id="filter-section-heading" className="sr-only">
        Filter Posts by Category
      </h2>
      <div className="flex flex-col gap-1">
        <FilterRow
          options={examTypeOptions}
          bgColor={'bg-orange-500 text-white focus:bg-white focus:text-orange-500 hover:bg-white hover:text-orange-500 hover:ring-1 hover:ring-orange-500 focus:ring-orange-300'}
        />
        <FilterRow
          options={applicableStatesOptions}
          bgColor={'bg-white text-[#05055f] ring-1  focus:bg-[#05055f] hover:bg-[#05055f] focus:text-white hover:text-white'}
        />
        <FilterRow
          options={minimumQualificationOptions}
          bgColor={'bg-green-700 text-white focus:bg-white hover:bg-white hover:ring-1 hover:text-green-700 hover:ring-green-700  focus:ring-green-300'}
        />
        {showViewAll && (
          <div className="flex justify-center">
            <Link
              href="/sarkari-result"
              className="relative text-sm md:text-xl font-semibold text-[#05055f] transition-all duration-300 ease-in-out hover:underline hover:scale-105 hover:text-blue-700 group"
            >
              View All . . .
              <span className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}