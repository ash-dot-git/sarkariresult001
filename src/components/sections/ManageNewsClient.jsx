'use client';

import { useState, useEffect } from 'react';
import { Search, X, Zap } from 'lucide-react';
import Link from 'next/link';
import UpdateNewsForm from './UpdateNewsForm';
import AdminLogin from '@/components/ui/AdminLogin';

export default function ManageNewsClient() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [pagination, setPagination] = useState({
    index: 1,
    items: 20,
    count: 0,
  });

  const loadRecords = async (term = '', pageIndex = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/news?search=${encodeURIComponent(term)}&page=${pageIndex}&limit=${pagination.items}`);
      const data = await res.json();
      if (data.stat) {
        setRecords(data.data.list);
        setPagination({
          index: data.data.index,
          items: data.data.items,
          count: data.data.count,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && view === 'list') {
      loadRecords(searchTerm, pagination.index);
    }
  }, [isAuthenticated, view]);

  const handleSearch = () => {
    loadRecords(searchTerm, 1);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    loadRecords('', 1);
  };

  const handleLogin = async (secret) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setView('form');
  };

  const handleFormSubmit = async (formData) => {
    try {
      const res = await fetch('/api/admin/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.stat) throw new Error(data.message);
      
      alert('Article updated successfully!');
      setView('list');
      setSelectedRecord(null);
      loadRecords(searchTerm, pagination.index);
    } catch (e) {
      alert(`Operation failed: ${e.message}`);
    }
  };

  const handleGenerateNews = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/admin/news/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customApiKey: customApiKey || undefined })
      });
      const data = await res.json();
      if (!data.stat) throw new Error(data.message);
      alert(`News Generation Complete!\nGenerated: ${data.data.successCount}, Skipped: ${data.data.skipCount}`);
      loadRecords(searchTerm, 1);
    } catch (error) {
      alert(`Generation Failed: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  function formatReadableDate(input) {
    if (!input) return 'N/A';
    const date = new Date(input);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <div className="flex flex-col flex-grow max-w-7xl mx-auto bg-white p-6">
      {view === 'form' ? (
        <div className="relative">
          <button
            onClick={() => setView('list')}
            className="bg-blue-900 text-white mb-4 p-2 px-4 cursor-pointer rounded-lg font-semibold hover:bg-blue-800"
          >
            ← Back to News List
          </button>
          <UpdateNewsForm 
            initialData={selectedRecord} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setView('list')} 
          />
        </div>
      ) : (
        <div className="bg-white p-6 min-h-[500px] shadow-lg rounded-xl">
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">News Management</h1>
                <p className="text-gray-600 mt-1">View, edit, or generate news articles.</p>
              </div>
              
              <div className="flex flex-col items-end gap-3">
                <Link href="/admin/manage" className="bg-blue-900 text-white py-2 px-6 rounded-lg text-sm font-bold hover:bg-blue-800 transition-colors">
                  ← Go to Regular Records
                </Link>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100 flex flex-col sm:flex-row gap-3 items-end">
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Custom Gemini API Key (Optional)</label>
                    <input
                      type="password"
                      placeholder="Bypass env limits"
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button
                    onClick={handleGenerateNews}
                    disabled={isGenerating}
                    className="bg-green-600 text-white whitespace-nowrap cursor-pointer py-2 px-6 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate News'}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-6 flex justify-end">
              <div className="relative w-full md:w-auto md:max-w-sm">
                <input
                  type="text"
                  placeholder="Search by SEO Title..."
                  className="w-full border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                {searchTerm && (
                  <button
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                    onClick={handleClearSearch}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <p className="text-center py-10">Loading news articles...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-10">Error: {error}</p>
          ) : (
            <div className="space-y-4">
              {records.length > 0 ? (
                records.map((record) => (
                  <div
                    key={record._id}
                    className="flex justify-between items-center p-4 border rounded-lg bg-white hover:bg-blue-50 shadow-sm transition-colors"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <h3 className="text-lg font-bold text-blue-900 truncate">{record.seoTitle || record.originalTitle}</h3>
                      <p className="text-sm text-gray-600 truncate mb-1">Slug: {record.slug}</p>
                      <div className="flex gap-4 text-xs text-gray-500 font-medium">
                        <span>Pub: {formatReadableDate(record.pubDate)}</span>
                        <span>Gen: {formatReadableDate(record.generatedAt)}</span>
                        <span>FAQs: {record.faqSection?.length || 0}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleEdit(record)}
                        className="bg-yellow-500 text-white py-2 px-5 rounded-lg text-sm hover:bg-yellow-600 font-bold shadow-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-10">No news articles found.</p>
              )}
            </div>
          )}
          
          {pagination.count > 0 && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => loadRecords(searchTerm, pagination.index - 1)}
                disabled={pagination.index <= 1}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-gray-600">
                Page {pagination.index} of {Math.ceil(pagination.count / pagination.items)}
              </span>
              <button
                onClick={() => loadRecords(searchTerm, pagination.index + 1)}
                disabled={pagination.index * pagination.items >= pagination.count}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
