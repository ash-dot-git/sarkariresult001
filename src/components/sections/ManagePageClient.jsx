'use client';

import { useState, useEffect } from 'react';
import UpdateRecordForm from '@/components/sections/UpdateRecordForm';
import AdminLogin from '@/components/ui/AdminLogin';
import { Search, X } from 'lucide-react';
import { fetchRecords, fetchRecordById, addNewRecord, updateRecord, deleteRecord } from '@/lib/api';
import PosterDetailsForm from '@/components/sections/PosterDetailsForm';


export default function ManagePageClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('list');
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [pagination, setPagination] = useState({
    index: 1,
    items: 10, // Items per page
    count: 0, // Total records
  });
  const [posterRecord, setPosterRecord] = useState(null);

  const loadRecords = async (term = '', pageIndex = 1, categories = []) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchRecords({ searchTerm: term, index: pageIndex, items: pagination.items, categories });

      // console.log('Fetched records data:', result);
      if (!result?.stat || !result?.data?.list) {
        throw new Error('Failed to fetch records. The API returned an invalid response.');
      }
      const data = result.data || { list: [], items: 10, count: 0, index: 1 }
      setRecords(data.list);
      setPagination({
        index: parseInt(data.index),
        items: parseInt(data.items),
        count: parseInt(data.count),
      });
    } catch (err) {
      setError('Something Went Wrong');//err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // This effect runs when the component mounts and whenever the view changes.
    // If the user is authenticated and the view is 'list', it fetches the records.
    if (isAuthenticated && view === 'list') {
      loadRecords(searchTerm, pagination.index, selectedCategories);
    }
  }, [isAuthenticated, view]);

  useEffect(() => {
    if (searchTerm === '') {
      loadRecords('', 1, selectedCategories);
    }
  }, [searchTerm]);

  const handleSearch = () => {
    // Reset to page 1 for a new search
    loadRecords(searchTerm, 1, selectedCategories);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    // Reset to page 1 when clearing search
    loadRecords('', 1, selectedCategories);
  };

  const handleLogin = async (secret) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secret }),
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const handleFormSubmit = async (formData) => {
    const isUpdating = selectedRecord && selectedRecord.unique_id && !formData.pendingForm;
    // console.log('Form Data:', formData);
    try {
      if (isUpdating) {
        await updateRecord(selectedRecord.unique_id, formData);
        alert('Record updated successfully!');
        localStorage.removeItem(`formData_${selectedRecord.unique_id}`);
      } else {
        await addNewRecord(formData);
        alert('Record saved successfully!');
        localStorage.removeItem('formData_new');
      }

      await loadRecords();

      // Only switch view if it's not a draft save
      if (!formData.pendingForm) {
        setView('list');
        setSelectedRecord(null);
      } else {
        alert('Draft saved!');
      }
    } catch (e) {
      // This will now catch the correct, specific error message from the API.
      console.error("Full error details:", e);
      setError(`Operation failed: ${e.message}`);
      alert(`Operation failed: ${e.message}`);
    }
  };

  const handleEdit = async (record) => {
    setIsLoading(true);
    setError(null);
    try {
      const detailedRecord = await fetchRecordById(record.unique_id, { noCache: true });
      if (detailedRecord === null) {
        throw new Error('Failed to fetch record details');
      }
      setSelectedRecord(detailedRecord);
      setView('form');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedRecord(null); // Still set to null for a new form
    setView('form');
    // We don't clear 'formData_new' here, UpdateRecordForm will handle loading it.
  };

  const handleDelete = async (recordId) => {
    if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
      try {
        const success = await deleteRecord(recordId);
        if (!success) {
          throw new Error('Failed to delete record');
        }
        await loadRecords();
        alert('Record deleted successfully!');
      } catch (error) {
        console.error("Failed to delete record:", error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleCategoryChange = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    loadRecords(searchTerm, 1, newCategories);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  function formatReadableDate(input, time = false) {
    input = String(input).trim();
    let date;

    // DD-MM-YYYY or DD/MM/YYYY
    if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(input)) {
      const [day, month, year] = input.split(/[-/]/);
      date = new Date(`${year}-${month}-${day}`);
    }
    // YYYY-MM-DD or YYYY/MM/DD
    else if (/^\d{4}[-/]\d{2}[-/]\d{2}$/.test(input)) {
      const [year, month, day] = input.split(/[-/]/);
      date = new Date(`${year}-${month}-${day}`);
    }
    // Milliseconds
    else if (!isNaN(input)) {
      date = new Date(Number(input));
    } else {
      return 'Invalid Date';
    }

    // Check for valid date
    if (isNaN(date.getTime())) return 'Invalid Date';

    // Format options
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };

    // Add time if requested
    if (time) {
      const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
      return `${date.toLocaleDateString('en-IN', dateOptions)}, ${date.toLocaleTimeString('en-IN', timeOptions)}`;
    }

    return date.toLocaleDateString('en-IN', dateOptions);
  }



  return (
    <div className="flex flex-col flex-grow max-w-7xl mx-auto bg-white">
      {view === 'form' && (
        <div className="relative">
          <button
            onClick={() => setView('list')}
            className="bg-blue-900 text-white m-2 p-2 cursor-pointer rounded-lg text-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
            aria-label="Back to Record List"
          >
            ← Back to Record List
          </button>
          <UpdateRecordForm onSubmit={handleFormSubmit} initialData={selectedRecord} />
        </div>
      )}
      {view === 'list' && (
        <div className="bg-white p-6 min-h-[500px] shadow-lg">
          <div className="mb-8 p-4 bg-white rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <button
                onClick={handleAddNew}
                className="bg-blue-900 text-white cursor-pointer py-2 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
                aria-label="Add new record"
              >
                + Add New Record
              </button>
            </div>
            <div className="mt-4 border-t pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="text-sm font-medium text-gray-700">Filter by:</div>
                {['result', 'latest-jobs', 'admit-cards', 'answer-key', 'syllabus', 'admission', 'important', 'hidden', 'new', 'upcoming', 'documents', 'sarkari-yojna', 'offline-form'].map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="text-sm text-gray-600">{category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
              <div className="relative w-full md:w-auto md:max-w-sm">
                <input
                  type="text"
                  placeholder="Search by post name..."
                  className="w-full border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch();
                    }
                  }}
                />
                {searchTerm && (
                  <button
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    onClick={handleClearSearch}
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  onClick={handleSearch}
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {isLoading && <p className='text-center'>Loading records...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          {!isLoading && !error && (
            <div className="space-y-4">
              {Array.isArray(records) && records.length > 0 ? (
                records.map((record) => (
                  <div
                    key={record.unique_id || record._id}
                    className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <h3 className="text-lg font-bold text-gray-800 truncate">{record.title}</h3>
                      <p className="text-sm text-gray-600 truncate">{record.name_of_organisation}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Posted: {formatReadableDate(record.uploaded, true)} | Updated: {record.updated ? formatReadableDate(record.updated, true) : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Category: {record.category}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPosterRecord(record);
                          setView('poster');
                        }}
                        className="bg-green-600 text-white py-1 px-3 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Poster
                      </button>
                      <button
                        type='button'
                        onClick={() => { handleEdit(record) }}
                        className="bg-yellow-500 text-white py-1 px-3 sm:py-2 sm:px-5 rounded-lg text-sm sm:text-base hover:bg-yellow-600 transition-colors"
                        aria-label={`Edit record ${record.name || record.unique_id}`}
                      >
                        Edit
                      </button>
                      <button
                        type='button'
                        onClick={() => handleDelete(record.unique_id)}
                        className="bg-red-600 text-white py-1 px-3 sm:py-2 sm:px-5 rounded-lg text-sm sm:text-base hover:bg-red-700 transition-colors"
                        aria-label={`Delete record ${record.name || record.unique_id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No records found.</p>
              )}
            </div>
          )}
          {!isLoading && !error && pagination.count > 0 && (
            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={() => loadRecords(searchTerm, pagination.index - 1, selectedCategories)}
                disabled={pagination.index <= 1}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {pagination.index} of {Math.ceil(pagination.count / pagination.items)}
              </span>
              <button
                type="button"
                onClick={() => loadRecords(searchTerm, pagination.index + 1, selectedCategories)}
                disabled={pagination.index * pagination.items >= pagination.count}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      
      {view === 'poster' && posterRecord && (
        <PosterDetailsForm
          record={posterRecord}
          onBack={() => {
            setView('list');
            setPosterRecord(null);
          }}
        />
      )}
    </div>
  );
}