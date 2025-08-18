import { callMongoFunction } from '@/lib/mongo-app';

/**
 * A server-only function to directly call the backend logic without a network request.
 * This should ONLY be used in Server Components.
 * @param {string} action - The action to perform.
 * @param {object} payload - The payload for the action.
 * @returns {Promise<object>} - The data from the backend function.
 */
export async function callApi(action, payload) {
    try {
        const realmResponse = await callMongoFunction(action, {
            data: payload,
            srvc: 'server-side-render'
        });

        // The nested `data` property is what the original client-side functions expect.
        if (realmResponse && typeof realmResponse.stat !== 'undefined' && realmResponse.stat === false) {
            throw new Error(realmResponse.message || 'The backend function returned a failure status.');
        }

        return realmResponse;

    } catch (error) {
        console.error(`Direct server-side action '${action}' failed:`, error);
        // Re-throw to be caught by the calling server component
        throw error;
    }
}

export async function getAllSlugs(payload = {}) {
    try {
        const response = await callApi('getAllSlugs', payload);
        return response?.data?.list;
    } catch (error) {
        console.error('Failed to fetch all slugs:', error);
        return [];
    }
}