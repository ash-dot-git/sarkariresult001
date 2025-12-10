'use client';

import { useState, useEffect, useRef } from 'react';

// This is the base input component. It is not exported as it's only used here.
const BaseStyledInput = ({ ...props }) => (
  <input
    {...props}
    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
  />
);

export default function AutoCompleteInput({ value, onChange, suggestions, ...props }) {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const listRef = useRef(null);


  // Effect to handle clicks outside the component to close the suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const handleChange = (e) => {
    const inputValue = e.target.value;
    onChange?.(e);

    if (inputValue && Array.isArray(suggestions)) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions ? suggestions : []);
    }

    setHighlightedIndex(-1);
  };

  
  const handleKeyDown = (e) => {
    if (!filteredSuggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : 0
    );
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    setHighlightedIndex((prev) =>
      prev > 0 ? prev - 1 : filteredSuggestions.length - 1
  );
} else if (e.key === 'Enter' && highlightedIndex >= 0) {
  e.preventDefault();
  handleSelect(filteredSuggestions[highlightedIndex]);
}
};

useEffect(() => {
  // Effect to reset suggestions when the component is focused
  if (isFocused && value.trim() === '' && Array.isArray(suggestions)) {
    setFilteredSuggestions(suggestions);
  }
}, [isFocused, value, suggestions]);

useEffect(() => {
  if (highlightedIndex >= 0 && listRef.current) {
    const activeItem = listRef.current.children[highlightedIndex];
    if (activeItem) activeItem.focus({ block: 'nearest' });
  }
}, [highlightedIndex]);

const handleSelect = (suggestion) => {
  const syntheticEvent = {
    target: {
      value: suggestion,
      name: props.name || '', // optional: retain field name
    },
  };

  // Call parent's onChange
  if (onChange) {
    onChange(syntheticEvent);
  }

  // Clear suggestions & close list
  setFilteredSuggestions([]);
  setIsFocused(false);
  setHighlightedIndex(-1); // reset selection index if you support arrow keys
};




  return (
    <div className="relative w-full" ref={containerRef}>
      <BaseStyledInput
        {...props}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        // onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        onKeyDown={handleKeyDown}
        autoComplete="off" // Prevent browser's native autocomplete
      />
      {/* Ensure suggestions are only shown when focused and there are suggestions to show */}
      {isFocused && filteredSuggestions.length > 0 && (
        <ul className="absolute z-50 left-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto block min-w-full">
          {/* <ul className="absolute z-50 left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto inline-block min-w-full"> */}
          {/* // <ul className="absolute left-0 right-0 w-full z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"> */}
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion} // Use the suggestion itself as the key, assuming they are unique
              onClick={() => handleSelect(suggestion)}
              className={`p-2 cursor-pointer bg-white hover:bg-gray-100 ${
                index === highlightedIndex ? 'bg-indigo-100' : ''
              }`}

            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}