import Script from 'next/script';
import React from 'react';

const FAQ = ({ faqs = [] }) => {
  if (!faqs.length) return null;


  return (
    <section
      className="bg-gray-50 border-t border-b border-gray-200 py-6 md:py-10 px-4"
      aria-labelledby="faq-heading"
    >

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h2
            id="faq-heading"
            className="text-2xl md:text-3xl font-bold text-slate-800"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-base text-slate-600">
            Answers to common questions related to Sarkari job updates and site usage.
          </p>
        </header>

        <dl className="space-y-4 text-slate-800 text-base">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition p-4"
            >
              <dt
                className="font-semibold text-lg"
              >
                {faq.question}
              </dt>
              <dd
                className="mt-2 text-slate-700 leading-relaxed"
              >
                <div>{faq.answer}</div>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

export default FAQ;
