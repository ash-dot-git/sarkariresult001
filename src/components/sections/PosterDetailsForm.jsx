'use client';
import { useState, useEffect } from 'react';

export default function PosterDetailsForm({ record, onBack }) {
    const [form, setForm] = useState({
        postId: record?.unique_id || '',
        title: record?.title || '',
        organization: record?.name_of_organisation || '',
        description: '',
        position: '',
        totalPosts: '',
        qualification: '',
        location: '',
        dates: { start: '', end: '', exam: '' },
        age: { min: '', max: '' },
        templateId: null,
    });

    // Fetch existing poster data if available
    useEffect(() => {
        const loadPoster = async () => {
            try {
                const res = await fetch(`/api/v0/get-poster-details`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ data: { postId: record?.unique_id }, srvc: 'add poster details' }),
                    }
                );
                const json = await res.json();
                if (json?.data) setForm(json.data);
            } catch (e) {
                console.warn('No existing poster');
            }
        };
        loadPoster();
    }, [record]);

    const handleChange = (key, val) => setForm((p) => ({ ...p, [key]: val }));
    const handleNested = (group, key, val) =>
        setForm((p) => ({ ...p, [group]: { ...p[group], [key]: val } }));

    const handleSubmit = async () => {
        // Only title and organization are required
        const requiredFields = ['title', 'organization'];

        // Check if any required field is empty
        const missingField = requiredFields.find((field) => !form[field]?.trim());
        if (missingField) {
            alert(`Please fill the required field: ${missingField}`);
            return;
        }
        
        try {
            const res = await fetch('/api/v0/add-poster-details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: form, srvc: 'add poster details' }),
            });
            const json = await res.json();
            alert(json.memo || 'Poster saved');
            onBack();
        } catch {
            alert('Error saving poster');
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md w-full">
            <h2 className="text-xl font-bold mb-4">Poster Details for: {record.title}</h2>

            <div className="grid grid-cols-2 gap-4">
                <input
                    value={form.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Title"
                    required
                    className="border p-2 rounded"
                />
                <input
                    value={form.organization || ''}
                    onChange={(e) => handleChange('organization', e.target.value)}
                    placeholder="Organization"
                    required
                    className="border p-2 rounded"
                />
                <input
                    value={form.position || ''}
                    onChange={(e) => handleChange('position', e.target.value)}
                    placeholder="Position"
                    className="border p-2 rounded"
                />
                <input
                    value={form.totalPosts || ''}
                    onChange={(e) => handleChange('totalPosts', e.target.value)}
                    placeholder="Total Posts"
                    className="border p-2 rounded"
                />
                <input
                    value={form.qualification || ''}
                    onChange={(e) => handleChange('qualification', e.target.value)}
                    placeholder="Qualification"
                    className="border p-2 rounded"
                />
                <input
                    value={form.location || ''}
                    onChange={(e) => handleChange('location', e.target.value)}
                    placeholder="Location"
                    className="border p-2 rounded"
                />

                {/* Dates */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Dates</label>
                    <div className="flex gap-2">
                        <input
                            value={form.dates.start}
                            onChange={(e) => handleNested('dates', 'start', e.target.value)}
                            placeholder='start date'
                            className="border p-2 rounded w-full"
                        />
                        <input
                            value={form.dates.end}
                            onChange={(e) => handleNested('dates', 'end', e.target.value)}
                            placeholder='end date'
                            className="border p-2 rounded w-full"
                        />
                        <input
                            value={form.dates.exam}
                            onChange={(e) => handleNested('dates', 'exam', e.target.value)}
                            placeholder='exam date'
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>

                {/* Age */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Age Limit</label>
                    <div className="flex gap-2">
                        <input
                            value={form.age.min}
                            onChange={(e) => handleNested('age', 'min', e.target.value)}
                            placeholder="Min Age"
                            className="border p-2 rounded w-full"
                        />
                        <input
                            value={form.age.max}
                            onChange={(e) => handleNested('age', 'max', e.target.value)}
                            placeholder="Max Age"
                            className="border p-2 rounded w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6 gap-3">
                <button
                    onClick={onBack}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Save Poster
                </button>
            </div>
        </div>
    );
}
