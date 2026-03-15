import * as RecordService from './services/recordService.js';

/**
 * Server-Side API Gateway — For Server Components Only
 *
 * This module routes action names to service functions. It replaces the
 * legacy Realm App Services (callMongoFunction) with direct MongoDB queries.
 *
 * IMPORTANT: Only import this in Server Components and API routes.
 * Never import in 'use client' components.
 *
 * The callApi() function signature is preserved so that all existing consumers
 * (ListingTable, LatestUpdates, [slug]/page, etc.) work without changes.
 */

/**
 * Maps action names to their corresponding service functions.
 * Adding a new action is as simple as adding a new entry here.
 * @type {Record<string, (params: object) => Promise<object>>}
 */
const ACTION_MAP = {
  getAllRecords:              RecordService.getAllRecords,
  getRecordDetails:          RecordService.getRecordDetails,
  getCategoryRecords:        RecordService.getCategoryRecords,
  getFilteredRecords:        RecordService.getFilteredRecords,
  getLatestImportantRecords: RecordService.getLatestImportantRecords,
  getAllSlugs:               RecordService.getAllSlugs,
  getAllSitemapNodes:        RecordService.getAllSitemapNodes,
  addRecord:                 RecordService.addRecord,
  updateRecord:              RecordService.updateRecord,
  deleteRecord:              RecordService.deleteRecord,
};

/**
 * Executes a server-side action by name. Drop-in replacement for the old
 * Realm-based callApi. Maintains the same interface so no consumer changes needed.
 *
 * @param {string} action  - The action name (e.g., 'getCategoryRecords').
 * @param {object} payload - The parameters for the action.
 * @returns {Promise<object>} The service response in { stat, data } format.
 * @throws {Error} If the action is unknown or the service call fails.
 */
export async function callApi(action, payload) {
  const handler = ACTION_MAP[action];

  if (!handler) {
    throw new Error(`Unknown action: '${action}'. Available: ${Object.keys(ACTION_MAP).join(', ')}`);
  }

  try {
    const result = await handler(payload);

    // Check for service-level failures
    if (result && result.stat === false) {
      throw new Error(result.message || `Action '${action}' returned a failure status.`);
    }

    return result;
  } catch (error) {
    console.error(`[api-server] Action '${action}' failed:`, error.message);
    throw error;
  }
}

/**
 * Convenience function to fetch all title slugs.
 * Used by generateStaticParams in [slug]/page.jsx.
 *
 * @param {object} [payload={}] - Optional parameters (unused, kept for compatibility).
 * @returns {Promise<string[]>} Array of title_slug strings.
 */
export async function getAllSlugs(payload = {}) {
  try {
    const response = await callApi('getAllSlugs', payload);
    return response?.data?.list || [];
  } catch (error) {
    console.error('[api-server] Failed to fetch all slugs:', error.message);
    return [];
  }
}

/**
 * Convenience function to fetch sitemap nodes.
 * Used by sitemap.js generator.
 *
 * @returns {Promise<Array<{title_slug: string, updated: string}>>}
 */
export async function getAllSitemapNodes() {
  try {
    const response = await callApi('getAllSitemapNodes', {});
    return response?.data?.list || [];
  } catch (error) {
    console.error('[api-server] Failed to fetch sitemap nodes:', error.message);
    return [];
  }
}