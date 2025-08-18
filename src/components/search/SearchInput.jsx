'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({ onSearch, animatedPlaceholderTitles = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [displayPlaceholder, setDisplayPlaceholder] = useState('');
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const inputRef = useRef(null);

  // Animation refs (won’t trigger re-renders)
  const loopNumRef = useRef(0);
  const placeholderRef = useRef('');
  const isDeletingRef = useRef(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (isUserInteracting || animatedPlaceholderTitles.length === 0) return;

    const handleTyping = () => {
      const i = loopNumRef.current % animatedPlaceholderTitles.length;
      const fullText = animatedPlaceholderTitles[i];
      const current = placeholderRef.current;

      let updatedText;

      if (isDeletingRef.current) {
        updatedText = fullText.substring(0, current.length - 1);
      } else {
        updatedText = fullText.substring(0, current.length + 1);
      }

      placeholderRef.current = updatedText;
      setDisplayPlaceholder(updatedText);

      if (!isDeletingRef.current && updatedText === fullText) {
        timeoutRef.current = setTimeout(() => {
          isDeletingRef.current = true;
          handleTyping();
        }, 2000);
        return;
      } else if (isDeletingRef.current && updatedText === '') {
        isDeletingRef.current = false;
        loopNumRef.current += 1;
      }

      timeoutRef.current = setTimeout(handleTyping, isDeletingRef.current ? 75 : 150);
    };

    timeoutRef.current = setTimeout(handleTyping, 150);

    return () => clearTimeout(timeoutRef.current);
  }, [isUserInteracting, animatedPlaceholderTitles]);

  const handleSearch = () => {
    const termToSearch = searchTerm || placeholderRef.current;
    onSearch(termToSearch);
    setIsUserInteracting(true);
    if (!searchTerm) setSearchTerm(termToSearch);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
    inputRef.current?.focus();
  };

  const handleInteraction = () => {
    setIsUserInteracting(true);
    clearTimeout(timeoutRef.current);
  };

  const handleBlur = () => {
    if (searchTerm === '') {
      setTimeout(() => setIsUserInteracting(false), 100);
    }
  };

  return (
    <div className="relative w-full max-w-md" role="search">
      <input
        ref={inputRef}
        type="text"
        name="search"
        aria-label="Search input"
        placeholder={isUserInteracting ? 'Search all records...' : displayPlaceholder}
        className="w-full border outline-1 text-lg placeholder-[#982704] border-gray-700 rounded-lg py-1 pl-4 pr-12  focus:outline-none focus:ring-3 hover:ring-2 focus:ring-[#05055f]"
        value={searchTerm}
        onChange={(e) => {
          handleInteraction();
          setSearchTerm(e.target.value);
          if (e.target.value === '') handleClear();
        }}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        onFocus={handleInteraction}
        onBlur={handleBlur}
      />

      {/* Clear Button */}
      {searchTerm && (
        <button
          type="button"
          className="absolute top-1/2 cursor-pointer right-12 -translate-y-1/2 rounded-full text-gray-500 hover:text-red-500 focus:outline-none w-10 h-10 flex items-center justify-center"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      )}

      {/* Search Button */}
      <button
        type="button"
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full text-gray-500 hover:text-black focus:outline-none cursor-pointer hover:scale-110 transition-transform w-10 h-10 flex items-center justify-center"
        onClick={handleSearch}
        aria-label="Submit search"
      >
        <Search className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
};

export default SearchInput;
