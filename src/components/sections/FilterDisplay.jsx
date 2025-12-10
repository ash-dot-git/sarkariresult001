'use client';

import { Tag } from 'lucide-react';

const FilterPill = ({ text }) => (
  <div className="flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm">
    <Tag size={14} className="mr-2" />
    {text}
  </div>
);

export default function FilterDisplay({ filters }) {
  if (!filters || Object?.values(filters)?.every(arr => !arr || arr?.length === 0)) {
    return null;
  }

  const {
    exam_type = [],
    applicable_states = [],
    minimum_qualification = [],
    other_tags = [],
  } = filters;

  const allFilters = [
    ...exam_type,
    ...applicable_states,
    ...minimum_qualification,
    ...other_tags,
  ];

  if (allFilters?.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="filters-heading" className="my-4">
      <h2 id="filters-heading" className="sr-only">
        Post Filters
      </h2>
      <div className="flex flex-wrap gap-2" role="list">
        {allFilters.map((item) => (
          <div key={item} role="listitem">
            <FilterPill text={item} />
          </div>
        ))}
      </div>
    </section>
  );
}