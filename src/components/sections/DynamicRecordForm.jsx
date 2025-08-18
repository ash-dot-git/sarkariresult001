"use client";

import { useState, useEffect } from 'react';
import { detailsSchema } from '@/data/schema';
import SchemaField from '@/components/ui/SchemaField';

export default function DynamicRecordForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({});

  // Initialize form with default values from schema or existing data for editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      const defaultData = {};
      Object.keys(detailsSchema).forEach(key => {
        const field = detailsSchema[key];
        if (field.default === 'today') {
          defaultData[key] = new Date().toISOString().split('T')[0];
        } else if (field.default) {
          defaultData[key] = field.default;
        }
      });
      setFormData(defaultData);
    }
  }, [initialData]);

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      alert('Record saved successfully!');
      // Reset form after successful submission if it's not an update
      if (!initialData) {
        setFormData({});
      }
    } catch (error) {
      console.error("Failed to save record:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 border-b pb-4">
        {initialData ? 'Update Record' : 'Add New Record'}
      </h2>
      
      <div className="space-y-6">
        {Object.keys(detailsSchema).map(key => (
          <SchemaField
            key={key}
            fieldName={key}
            schema={detailsSchema[key]}
            value={formData[key]}
            onChange={handleFieldChange}
          />
        ))}
      </div>

      <div className="pt-6 border-t">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
          aria-label={initialData ? 'Update record' : 'Save new record'}
        >
          {initialData ? 'Update Record' : 'Save New Record'}
        </button>
      </div>
    </form>
  );
}