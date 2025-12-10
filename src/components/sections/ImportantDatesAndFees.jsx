// components/sections/DatesAndFeeSection.jsx
import Link from "next/link";
import React, { memo } from "react";
import MarkdownRenderer from "../ui/MarkdownRenderer";
import ColorMarkdownRenderer from '@/components/ui/ColorMarkdownRenderer';


const ImportantDatesAndFees = ({ datesSection, feeSection, title }) => {
  // Determine if both sections are present
  const bothSectionsPresent = datesSection && feeSection;

  return (
    <section
      className="border rounded-md overflow-hidden text-sm md:text-base my-6"
      aria-labelledby="important-dates-and-fee"
    >
      {/* Section Heading */}
      <header className="bg-white text-center py-4 leading-tight space-y-1">
        <h1
          id="important-dates-and-fee"
          className="text-red-600 font-bold text-xl md:text-2xl"
        >
          {title || datesSection?.elements?.[0]?.value || "Important Dates & Application Fee"}
        </h1>
        <h2 className="text-[#008101] font-semibold text-lg md:text-xl">Sarkari Result</h2>
        <p className="text-[#2e01ff] font-semibold">
          <Link
            href="https://newsarkariresult.co.in"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit NewSarkariResult.Co.In"
          >
            NewSarkariResult.Co.In
          </Link>
        </p>
      </header>

      {/* Responsive Grid */}
      <div
        className={`grid border-t ${bothSectionsPresent ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          }`}
      >
        {/* Important Dates Block */}
        {datesSection &&
          <section
            aria-labelledby="important-dates"
            className={`border-b md:border-b-0 ${feeSection ? 'md:border-r' : ''}`}
          >
            <h3
              id="important-dates"
              className="bg-[#5c0a38] text-white font-bold text-center md:text-3xl text-2xl"
            >
              Important Dates
            </h3>
            <ul className="p-4 list-disc text-xl list-inside space-y-1">
              {datesSection?.elements?.map((el) => (
                <li key={el.id}>
                  <ColorMarkdownRenderer content={`${el.label}:`} /> {' '}
                  <ColorMarkdownRenderer content={`${el.value}`} pClassName={'font-bold'} />
                </li>
              ))}
            </ul>
          </section>
        }

        {/* Application Fee Block */}
        {feeSection &&
          <section aria-labelledby="application-fee">
            <h3
              id="application-fee"
              className="bg-[#5c0a38] text-white font-bold text-center md:text-3xl text-2xl"
            >
              Application Fee
            </h3>
            <ul className="p-2 list-disc text-xl list-inside space-y-1">
              {feeSection?.elements?.map((el) => (
                <li key={el.id}>
                  <ColorMarkdownRenderer content={`${el.label}:`} /> {' '}
                  <ColorMarkdownRenderer content={`${el.value}`} pClassName={'font-bold'} />
                </li>
              ))}
            </ul>

          </section>
        }
      </div>
    </section>
  );
};

export default memo(ImportantDatesAndFees);
