'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchRecords } from '@/lib/api';

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pagination, setPagination] = useState({ index: 1, items: 10, count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleSearch = async (searchTerm, pageIndex = 1) => {
    if (!searchTerm.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setQuery(searchTerm);

    try {
      // const result = await fetchRecords({ searchTerm, index: pageIndex, items: 100 });
      const result = await fetchRecords({ searchTerm, index: pageIndex, items: 100 });
      if (result.stat && result.data) {
        const data = result.data || { list: [], items: 100, count: 0, index: 1 };
        setSearchResults(data.list);
        setPagination({
          index: parseInt(data.index),
          items: parseInt(data.items),
          count: parseInt(data.count),
        });
      } else {
        setSearchResults([]);
        setPagination({ index: 1, items: 10, count: 0 });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading && hasSearched && resultsContainerRef.current) {
      resultsContainerRef.current.scrollIntoView();
    }
  }, [isLoading, hasSearched]);

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex justify-center items-start pt-16 sm:pt-24"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex items-center p-4 border-b">
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-3 pl-4 pr-10 rounded-l-md bg-gray-100 text-black text-sm outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-red-600 text-white text-sm px-4 py-3 rounded-r-md hover:bg-red-700"
            aria-label="Submit search"
            disabled={isLoading}
          >
            {'Search'}
          </button>
        </form>

        {hasSearched && (
          <div ref={resultsContainerRef} tabIndex="-1" className="p-4 max-h-[60vh] overflow-y-auto outline-none">
            {isLoading && searchResults.length === 0 ? (
              <div className="text-center p-4">Loading...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500" role="alert">Error: {error}</div>
            ) : searchResults?.length === 0 ? (
              <div className="p-4 text-center">Sorry, but nothing matched your search terms. Please try again with some different keywords.</div>
            ) : (
              <>
                <ul className="divide-y divide-gray-200" aria-labelledby="search-results">
                  {searchResults?.map((record, index) => (
                    <li key={index} className="hover:bg-gray-50 group flex items-top pl-2 py-2">
                      <span className="mr-2 text-black select-none">•</span>
                      <Link
                        href={`/${record?.title_slug || ''}`}
                        onClick={onClose}
                        title={record?.title || 'View Record'}
                        target="_blank"
                        rel="noopener"
                        aria-label={`Go to ${record?.title || 'record'}`}
                        className=" text-[#2e01ff] font-semibold leading-tight"
                      >
                        <span className="text-sm sm:text-base group-hover:underline group-hover:text-[#e65100]">
                          {record?.title}
                          {record?.show?.new && (
                            <Image
                              src="/gifs/new3.webp"
                              alt="New"
                              width={35}
                              height={14}
                              priority
                              className="object-contain inline align-middle -mt-2 ml-1"
                            />
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                {!error && pagination.count > pagination.items && (
                  <nav className="flex justify-between items-center mt-4" aria-label="Search results pagination">
                    <button
                      onClick={() => handleSearch(query, pagination.index - 1)}
                      disabled={pagination.index <= 1 || isLoading}
                      className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-gray-700">
                      Page {pagination.index} of {Math.ceil(pagination.count / pagination.items)}
                    </span>
                    <button
                      onClick={() => handleSearch(query, pagination.index + 1)}
                      disabled={pagination.index * pagination.items >= pagination.count || isLoading}
                      className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
