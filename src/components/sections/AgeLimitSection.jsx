import React from 'react';
import ColorMarkdownRenderer from '../ui/ColorMarkdownRenderer';

export function AgeLimitSection({ elements, title }) {
  if (!elements || elements.length === 0) return null;

  return (
    <section
      aria-labelledby="age-limit-section"
      className="border rounded-md overflow-hidden my-10"
    >
      {/* Section Heading */}
      <div className="text-white font-bold text-center md:text-3xl text-2xl">
        <h2 id="age-limit-section" className="bg-green-700 ">
          {title || 'Age Limit Details'}
        </h2>
      </div>
      

      {/* Bullet List */}
      <div className="">
        <ul className="p-4 list-disc text-xl list-inside space-y-1">
          {elements.map((el) => (
            <li key={el.id}>
              <ColorMarkdownRenderer content={`**${el.label}**: ${el.value}`} asInline={false} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
