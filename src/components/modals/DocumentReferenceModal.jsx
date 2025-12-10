'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { fetchRecords } from '@/lib/api'; // We'll reuse this to get all records

export default function DocumentReferenceModal({ onSelect, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allRecords = await fetchRecords();
        setRecords(allRecords);
      } catch (err) {
        setError('Failed to load records.');
      } finally {
        setIsLoading(false);
      }
    };
    loadRecords();
  }, []);

  const filteredRecords = records.filter(record =>
    record.name_of_post.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Select a Document</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-800"  aria-label="Close modal">
            <X aria-hidden="true"/>
          </button>
        </div>
        <div className="relative mb-4">
          <StyledInput
            type="text"
            placeholder="Search for a document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex-grow overflow-y-auto border rounded-lg">
          {isLoading && <p className="p-4 text-center">Loading...</p>}
          {error && <p className="p-4 text-center text-red-500">{error}</p>}
          {!isLoading && !error && (
            <ul className="divide-y">
              {filteredRecords.length > 0 ? (
                filteredRecords.map(record => (
                  <li
                    key={record._id}
                    onClick={() => onSelect(record)}
                    className="p-4 hover:bg-gray-100 cursor-pointer"
                  >
                    <p className="font-semibold">{record.name_of_post}</p>
                    <p className="text-sm text-gray-600">{record.name_of_organisation}</p>
                  </li>
                ))
              ) : (
                <p className="p-4 text-center text-gray-500">No documents found.</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

// Re-using the styled input from the form for consistency
const StyledInput = ({ ...props }) => (
  <input
    {...props}
    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
  />
);