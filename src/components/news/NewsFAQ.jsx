'use client';

/**
 * @component NewsFAQ
 * @description Accordion-style FAQ section for news article pages.
 * Includes FAQPage JSON-LD schema markup for Google rich results.
 *
 * @param {Object} props
 * @param {Array<{question: string, answer: string}>} props.faqs - Array of FAQ objects
 */

import { useState } from 'react';

export default function NewsFAQ({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  /** Toggle accordion item */
  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  /** Generate FAQPage JSON-LD schema */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="mt-8 mb-6" aria-labelledby="faq-heading">
      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h2
        id="faq-heading"
        className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"
      >
        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Frequently Asked Questions
      </h2>

      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="text-[0.95rem] font-semibold text-gray-800 pr-4">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 flex-shrink-0 text-gray-500 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
            >
              <p className="px-4 py-3 text-sm text-gray-700 leading-relaxed border-t border-gray-100">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
