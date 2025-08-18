import React from 'react';
import ColorMarkdownRenderer from '../ui/ColorMarkdownRenderer';

export function ImportantLinksSection({ elements }) {
  return (
    <section
      className="border rounded-md overflow-hidden text-sm md:text-base my-6"
      aria-labelledby="important-links-heading"
    >
      {/* Section Header */}
      <header className="bg-white text-center py-2 leading-tight space-y-0">
        <h1
          id="important-links-heading"
          className="text-[#008101] font-extrabold text-2xl md:text-3xl"
        >
          Useful Important Links
        </h1>
      </header>

      {/* Table Rows */}
      <div className="divide-y border-t">
        {elements?.map((el) => (
          <div
            key={el.id}
            className="flex  text-center md:flex-row text-2xl hover:bg-[#f4ff81]"
          >
            {/* Label Column */}
            <div className="w-1/2 md:w-1/2 p-2 border-r">
              <ColorMarkdownRenderer content={el.label} pClassName='font-bold text-[#fe00fe]' />
            </div>

            {/* Value Column */}
            <div className="w-1/2 md:w-1/2 p-2 break-words">
              <ColorMarkdownRenderer content={el.value} aClassName='hover:underline font-bold'/>
            </div>
          </div>
          
        ))}
      </div>
    </section>
  );
}
