'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import SearchInput from '@/components/search/SearchInput';
import { fetchRecords } from '@/lib/api';
import Image from 'next/image';

export default function SearchSection({ animatedPlaceholderTitles = [] }) {
  const [searchResults, setSearchResults] = useState([]);
  const [pagination, setPagination] = useState({ index: 1, items: 100, count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const resultsContainerRef = useRef(null);

  const handleSearch = useCallback(async (searchTerm, pageIndex = 1) => {
    setCurrentSearchTerm(searchTerm);
    if (!searchTerm) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await fetchRecords({ searchTerm, index: pageIndex, items: 100 });
      console.log('result', result)
      if (result?.stat && result?.data) {
        const data = result.data || { list: [], items: 100, count: 0, index: 1 };
        setSearchResults(data.list);
        setPagination({
          index: parseInt(data.index),
          items: parseInt(data.items),
          count: parseInt(data.count),
        });
      } else {
        setSearchResults([]);
        setPagination({ index: 1, items: 100, count: 0 });
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong while fetching records.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <section className="hidden md:block" aria-labelledby="search-heading">
      <div className="flex justify-between items-center mt-4 px-4">
        <h2 id="search-heading" className="text-xl md:text-2xl lg:text-3xl font-bold leading-none">
          Search Records
        </h2>
        <SearchInput onSearch={handleSearch} animatedPlaceholderTitles={animatedPlaceholderTitles} />
      </div>

      {isLoading && (
        <div className="px-4 mt-4 text-center text-blue-600" role="status" aria-live="polite">
          Loading...
        </div>
      )}

      {hasSearched && !isLoading && (
        <div tabIndex={-1} className="px-4 mt-6 outline-none" ref={resultsContainerRef}>
          <div className="border border-gray-300 rounded-md overflow-hidden mb-6">
            <div className="bg-[#A80909] text-white text-center font-bold text-lg px-4 py-3" id="search-results-heading">
              Matched Records
            </div>
            <ul className="divide-y divide-gray-300 min-h-[100px]" aria-labelledby="search-results-heading">
              {error ? (
                <li className="p-4 text-center text-red-600" role="alert">
                  Error: {error}
                </li>
              ) : searchResults?.length === 0 ? (
                <li className="p-4 text-center">
                  No matching results found. Try different keywords.
                </li>
              ) : (
                searchResults.map((record, index) => (
                  <li key={record?.unique_id || index} className="bg-white px-2 py-2 text-[#2e01ff] group flex items-top gap-1 hover:bg-gray-50 ">
                    <span className="text-black select-none">•</span>
                    <Link
                      href={`/${record?.title_slug || ''}`}
                      className="  font-semibold leading-tight transition-transform duration-150 ease-in-out hover:scale-[1.01] focus-visible:outline focus-visible:ring focus-visible:ring-blue-500"
                      aria-label={`Go to ${record?.title}`}
                      title={record?.title || 'View Record'}
                    >
                      <span className="text-sm sm:text-base group-hover:underline group-hover:text-[#e65100]">
                        {record?.title}
                        {record?.show?.new && (
                          <Image
                            src="/gifs/new3.webp"
                            alt="New badge"
                            width={40}
                            height={16}
                            priority
                            className="inline-block ml-2 w-[40px] h-[16px] align-middle object-contain"
                          />
                        )}
                      </span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {!error && pagination.count > pagination.items && (
            <nav className="flex justify-between items-center mt-6" aria-label="Pagination Navigation">
              <button
                onClick={() => handleSearch(currentSearchTerm, pagination.index - 1)}
                disabled={pagination.index <= 1}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-700" aria-current="page">
                Page {pagination.index} of {Math.ceil(pagination.count / pagination.items)}
              </span>
              <button
                onClick={() => handleSearch(currentSearchTerm, pagination.index + 1)}
                disabled={pagination.index >= Math.ceil(pagination.count / pagination.items)}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          )}
        </div>
      )}
    </section>
  );
}
