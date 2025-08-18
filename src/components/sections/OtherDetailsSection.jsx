import React from 'react';
import ColorMarkdownRenderer from '../ui/ColorMarkdownRenderer';

export function OtherDetailsSection({ elements }) {
  return (
    <section
      className="border rounded-md overflow-hidden text-sm md:text-base my-6"
      aria-labelledby="other-details-section"
    >
      <div className="divide-y border-t">
        {elements?.map((el) => (
          <div key={el.id} className="p-4 space-y-2">
            {/* Label as heading inside the div */}
            <div className="bg-[#5c0a38] text-center text-white text-xl font-bold px-4 py-2 rounded">
              <ColorMarkdownRenderer content={el.label} pClassName="text-white" />
            </div>

            {/* Value row */}
            <div className="px-4 py-2 bg-white">
              <ColorMarkdownRenderer
                content={el.value}
                aClassName="hover:underline font-semibold"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
