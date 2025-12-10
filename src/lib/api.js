// utils/api.js

export const fetchRecords = async ({ searchTerm = '', index = 1, items = 25, categories = [] }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-all-records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: { searchTerm, index, items, categories },
      srvc: "get all records",
    }),
    next: { revalidate: 300 }, // ISR
  });
  console.log('respo')
  if (!res.ok) return { list: [], count: 0, index: 1, items: 25 };
  const json = await res.json();
  
  return json || { list: [], count: 0, index: 1, items: 25 };
};

export const fetchCategoryRecords = async ({ category, searchTerm = '', index = 1, items = 20, exclude = '' }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-category-records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: { category, searchTerm, index, items, exclude },
      srvc: "get category records",
    }),
    next: { revalidate: 300 },
  });

  if (!res.ok) return { list: [], count: 0, index: 1, items: 25 };
  const json = await res.json();
  return json || { list: [], count: 0, index: 1, items: 25 };
};

export const fetchRecordById = async (slug, options = {}) => {
  const cacheOptions = options.noCache ? { cache: "no-store" } : { next: { revalidate: 60 } };

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-record-details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: { title_slug: slug },
      srvc: "get record details",
    }),
    ...cacheOptions,
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json?.data || null;
};

export const addNewRecord = async (record) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/add-record`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: { record },
      srvc: "add record",
    }),
  });

  const json = await res.json();
  return json;
};

export const updateRecord = async (unique_id, updateData) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/update-record`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: { unique_id, updateData },
      srvc: "update record",
    }),
  });

  const json = await res.json();
  return json;
};

export const deleteRecord = async (unique_id) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/delete-record`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: { unique_id },
      srvc: "delete record",
    }),
  });

  const json = await res.json();
  return json?.data;
};

export const addPosterDetails = async (data) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/add-poster-details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: data,
      srvc: "add poster details",
    }),
  });

  const json = await res.json();
  return json?.data;
};

export const updatePosterDetails = async (data) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/update-poster-details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: data,
      srvc: "update poster details",
    }),
  });

  const json = await res.json();
  return json?.data;
};

export const deletePosterDetails = async (data) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/delete-poster-details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: data,
      srvc: "delete poster details",
    }),
  });

  const json = await res.json();
  return json?.data;
};


export const getPosterDetails = async (data) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v0/get-poster-details`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: data,
      srvc: "get poster details",
    }),
  });

  const json = await res.json();
  return json?.data;
};
