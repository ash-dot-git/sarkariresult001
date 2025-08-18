const getApiEndpoint = () => {
    // If running on the client, always use a relative path.
    if (typeof window !== 'undefined') {
        return '/api/records';
    }
    // If on the server, construct an absolute URL.
    if (process.env.VERCEL_URL) {
        // Vercel provides the domain name.
        return `https://${process.env.VERCEL_URL}/api/records`;
    }
    if (process.env.URL) {
        // Netlify provides the full base URL.
        return `${process.env.URL}/api/records`;
    }
    // Fallback for local server development.
    return 'http://localhost:3000/api/records';
};

const API_ENDPOINT = getApiEndpoint();

async function apiRequest(action, payload, cacheOptions = {}) {
    // Default to 'no-store' for client-side, but allow override for server-side caching
    const defaultCache = typeof window !== 'undefined' ? { cache: 'no-store' } : {};
    const finalCacheOptions = { ...defaultCache, ...cacheOptions };

    try {
        console.log(`Executing API request for action: ${action} against ${API_ENDPOINT}`);
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                action,
                payload,
                srvc: typeof window !== 'undefined' ? 'web-client' : 'server-render'
            }),
            ...finalCacheOptions,
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const textBody = await response.text();
            throw new Error(`Expected JSON response, but received '${contentType}'. Body: ${textBody.substring(0, 200)}...`);
        }

        const result = await response.json();

        if (result.data && typeof result.data.stat !== 'undefined' && result.data.stat === false) {
            const errorDetails = result.data.message || JSON.stringify(result.data.data) || 'Unknown error from service.';
            console.error(`API Error for action '${action}' (from nested response):`, errorDetails);
            throw new Error(errorDetails);
        }

        if (!response.ok || !result.stat) {
            const errorDetails = result.message || response.statusText;
            console.error(`API Error for action '${action}':`, errorDetails);
            throw new Error(`API request failed for ${action}: ${errorDetails}`);
        }

        return result;

    } catch (error) {
        console.error(`Failed to execute API request for action '${action}':`, error);
        throw error;
    }
}

export const fetchRecords = async ({ searchTerm = '', index = 1, items = 25, categories = [] }) => {
  const data = await apiRequest('getAllRecords', { searchTerm, index, items, categories });
  return data?.data || {list: [], count: 0, index: 1, items: 25};
};

export const fetchCategoryRecords = async ({ category, searchTerm = '', index = 1, items = 20, exclude = '', }) => {
  const data = await apiRequest('getCategoryRecords', { category, searchTerm, index, items, exclude }, { next: { revalidate: 300 } });
  return data?.data || {list: [], count: 0, index: 1, items: 25};
};

export const fetchRecordById = async (slug, options = {}) => {
  const cacheOptions = options.noCache ? { cache: 'no-store' } : { next: { revalidate: 60 } };
  const result = await apiRequest('getRecordDetails', { title_slug: slug }, cacheOptions);
  return result?.data?.data || null;
};

export const addRecord = async (record) => {
    return await apiRequest('addRecord', { record });
};

export const updateRecord = async (unique_id, updateData) => {
    return await apiRequest('updateRecord', { unique_id, updateData });
};

export const deleteRecord = async (unique_id) => {
    const result = await apiRequest('deleteRecord', { unique_id });
    return result;
};