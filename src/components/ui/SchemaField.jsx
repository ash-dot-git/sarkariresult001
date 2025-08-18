"use client";

import React from 'react';

// A versatile, recursive component to render any part of the JSON schema.
export default function SchemaField({ fieldName, schema, value, onChange }) {
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const handleInputChange = (e) => {
    onChange(fieldName, e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(fieldName, suggestion);
    setShowSuggestions(false);
  };

  const handleArrayChange = (index, itemValue) => {
    const newArray = [...(value || [])];
    newArray[index] = itemValue;
    onChange(fieldName, newArray);
  };

  const addArrayItem = () => {
    const newArray = [...(value || [])];
    // Initialize with an empty object for object arrays, or an empty string for simple arrays
    const newItem = schema.items?.type === 'object' ? {} : '';
    onChange(fieldName, [...newArray, newItem]);
  };

  const removeArrayItem = (index) => {
    const newArray = [...(value || [])];
    newArray.splice(index, 1);
    onChange(fieldName, newArray);
  };

  const handleObjectChange = (subFieldName, subFieldValue) => {
    onChange(fieldName, { ...(value || {}), [subFieldName]: subFieldValue });
  };

  const renderField = () => {
    switch (schema.type) {
      case 'text':
      case 'number':
      case 'url':
        const filteredSuggestions = schema.suggestions?.filter(s =>
          s.toLowerCase().includes((value || '').toLowerCase())
        );
        return (
          <div className="relative">
            <input
              type={schema.type}
              value={value || ''}
              onChange={handleInputChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delay to allow click
              placeholder={schema.placeholder}
              className="border p-2 w-full rounded-md"
              autoComplete="off"
            />
            {showSuggestions && filteredSuggestions?.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto">
                {filteredSuggestions.map(suggestion => (
                  <li
                    key={suggestion}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                    onMouseDown={() => handleSuggestionClick(suggestion)} // Use onMouseDown to avoid blur event conflict
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={handleInputChange}
            placeholder={schema.placeholder}
            className="border p-2 w-full rounded-md"
            rows="4"
          />
        );
      case 'date': {
        const dateInputRef = React.useRef(null);
        return (
          <div className="relative cursor-pointer" onClick={() => dateInputRef.current?.showPicker()}>
            <input
              ref={dateInputRef}
              type="date"
              value={value || ''}
              onChange={handleInputChange}
              className="border p-2 w-full rounded-md pr-10"
            />
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
          </div>
        );
      }
      case 'array':
        return (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            {(value || []).map((item, index) => (
              <div key={index} className="flex items-start space-x-3 mb-3 p-3 bg-white border rounded-lg">
                <div className="flex-grow">
                  <SchemaField
                    fieldName={index.toString()}
                    schema={schema.items}
                    value={item}
                    onChange={(name, itemValue) => handleArrayChange(index, itemValue)}
                  />
                </div>
                <button type="button" onClick={() => removeArrayItem(index)} className="bg-red-500 text-white px-3 py-1 rounded-md mt-1" aria-label={`Remove item ${index + 1}`}><span aria-hidden="true">&ndash;</span></button>
              </div>
            ))}
            <button type="button" onClick={addArrayItem} className="bg-green-500 text-white px-4 py-1 mt-2 rounded-md" aria-label="Add new item"><span aria-hidden="true">+ Add Item</span></button>
          </div>
        );
      case 'object':
        return (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
            {Object.keys(schema.properties).map(subKey => (
              <div key={subKey}>
                 <SchemaField
                    fieldName={subKey}
                    schema={schema.properties[subKey]}
                    value={value ? value[subKey] : undefined}
                    onChange={handleObjectChange}
                  />
              </div>
            ))}
          </div>
        );
      default:
        return <p className="text-red-500">Unsupported field type: {schema.type}</p>;
    }
  };

  return (
    <div>
      <label className="block text-md font-semibold text-gray-800 capitalize mb-2">
        {fieldName.replace(/_/g, ' ')}
      </label>
      {renderField()}
    </div>
  );
}