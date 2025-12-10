'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export default function MultiSelectAutocomplete({
  selectedItems,
  onSelectionChange,
  suggestions,
  placeholder,
}) {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      const filtered = suggestions.filter(
        (s) =>
          s.toLowerCase().includes(value.toLowerCase()) &&
          !selectedItems.includes(s)
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(
        suggestions.filter((s) => !selectedItems.includes(s))
      );
    }
  };

  const handleSelect = (item) => {
    onSelectionChange([...selectedItems, item]);
    setInputValue('');
    setFilteredSuggestions(suggestions.filter((s) => ![...selectedItems, item].includes(s)));
  };

  const handleRemove = (item) => {
    onSelectionChange(selectedItems.filter((i) => i !== item));
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md shadow-sm"
        onClick={() => setIsFocused(true)}
      >
        {selectedItems.map((item) => (
          <div
            key={item}
            className="flex items-center gap-1 bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm"
          >
            {item}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(item);
              }}
              className="ml-1 text-indigo-600 hover:text-indigo-800"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            setFilteredSuggestions(
              suggestions.filter((s) => !selectedItems.includes(s))
            );
          }}
          placeholder={placeholder}
          className="flex-grow p-1 bg-transparent focus:outline-none"
        />
      </div>
      {isFocused && filteredSuggestions.length > 0 && (
        <ul className="absolute z-50 left-0 top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto block min-w-full">
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => handleSelect(suggestion)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}