'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function UpdateNewsForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    _id: initialData?._id || '',
    seoTitle: initialData?.seoTitle || '',
    h1: initialData?.h1 || '',
    metaDescription: initialData?.metaDescription || '',
    articleBody: initialData?.articleBody || '',
    trendingTags: initialData?.trendingTags ? initialData.trendingTags.join(', ') : '',
    faqSection: initialData?.faqSection || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...formData.faqSection];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFormData(prev => ({ ...prev, faqSection: newFaqs }));
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqSection: [...prev.faqSection, { question: '', answer: '' }]
    }));
  };

  const removeFaq = (index) => {
    const newFaqs = [...formData.faqSection];
    newFaqs.splice(index, 1);
    setFormData(prev => ({ ...prev, faqSection: newFaqs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        trendingTags: formData.trendingTags.split(',').map(tag => tag.trim()).filter(Boolean)
      };
      await onSubmit(submissionData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-xl max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2">Edit News Article</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">SEO Title</label>
          <input
            type="text"
            name="seoTitle"
            required
            value={formData.seoTitle}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">H1 / Headline</label>
          <input
            type="text"
            name="h1"
            required
            value={formData.h1}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Meta Description</label>
          <textarea
            name="metaDescription"
            rows="2"
            value={formData.metaDescription}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Article Body (Supports raw text or basic HTML)</label>
          <textarea
            name="articleBody"
            required
            rows="10"
            value={formData.articleBody}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">Trending Tags (Comma separated)</label>
          <input
            type="text"
            name="trendingTags"
            value={formData.trendingTags}
            onChange={handleChange}
            placeholder="#SSC, #Jobs, #India"
            className="mt-1 w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-lg font-semibold text-gray-700">FAQ Section</label>
            <button
              type="button"
              onClick={addFaq}
              className="flex items-center text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
            >
              <Plus className="w-4 h-4 mr-1" /> Add FAQ
            </button>
          </div>

          <div className="space-y-4">
            {formData.faqSection.map((faq, index) => (
              <div key={index} className="p-4 border rounded bg-gray-50 relative">
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Remove FAQ"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="mb-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Question</label>
                  <input
                    type="text"
                    required
                    value={faq.question}
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Answer</label>
                  <textarea
                    required
                    rows="2"
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            ))}
            {formData.faqSection.length === 0 && (
              <p className="text-gray-500 text-sm text-center">No FAQs added yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border rounded-lg hover:bg-gray-100 font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 font-semibold disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </form>
  );
}
