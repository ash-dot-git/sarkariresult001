import * as RecordQueries from '../db/queries/recordQueries.js';
import crypto from 'crypto';

/**
 * Record Service — Business Logic Layer
 *
 * Sits between the API/server-component layer and the query layer.
 * Handles:
 *   - Parameter validation and defaults
 *   - Converting pagination params (index/items → skip/limit)
 *   - Formatting responses in the standard shape that existing consumers expect
 *   - Generating unique IDs and timestamps for new records
 *
 * Response format (matches the legacy Realm function contract):
 *   { stat: true, data: { list: [], count: 0, index: 1, items: 25 } }
 */

// ─── HELPERS ───────────────────────────────────────────────────────────────────

/**
 * Strips custom formatting tags like {red}...{/red} and markdown to generate a clean slug.
 */
function createSlug(text) {
  if (!text) return `post-${Date.now()}`;
  return text
    .replace(/\{\w+\}/g, '') // Remove opening tags like {red}
    .replace(/\{\/\w+\}/g, '') // Remove closing tags like {/red}
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Extracts meta details from the dynamic sections array and pushes them to the root of the record.
 * This mimics the logic previously handled invisibly by MongoDB Realm functions.
 */
function processRecordMetadata(record) {
  if (!record.sections || !Array.isArray(record.sections)) return;

  const metaSection = record.sections.find(s => s.title === 'Meta Details');
  if (metaSection && Array.isArray(metaSection.elements)) {
    // Extract title (prioritize 'Name of Post', fallback to 'Title' or 'Display Title')
    const nameOfPost = metaSection.elements.find(e => e.name === 'name_of_post')?.value;
    const regularTitle = metaSection.elements.find(e => e.name === 'title')?.value;
    const displayTitle = metaSection.elements.find(e => e.name === 'display_title')?.value;
    
    // Assign root level title
    record.title = nameOfPost || regularTitle || displayTitle || 'Untitled Post';
    
    // Assign root level name_of_organisation
    const org = metaSection.elements.find(e => e.name === 'name_of_organisation')?.value;
    if (org) record.name_of_organisation = org;
  } else if (!record.title) {
    record.title = 'Untitled Post';
  }

  // Always generate a slug if generating a new record or if title_slug is missing
  if (!record.title_slug || record.title_slug.trim() === '') {
    record.title_slug = createSlug(record.title);
  } else {
    // If updating, ensure slug is clean
    record.title_slug = createSlug(record.title_slug);
  }
}

/**
 * Converts 1-based page index + items-per-page into MongoDB skip/limit.
 * @param {number} index - 1-based page number.
 * @param {number} items - Items per page.
 * @returns {{ skip: number, limit: number }}
 */
function paginate(index = 1, items = 25) {
  const page = Math.max(1, parseInt(index, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(items, 10) || 25));
  const skip = (page - 1) * limit;
  return { skip, limit };
}

/**
 * Wraps data in the standard success response envelope.
 * @param {object} data - The payload to return.
 * @returns {{ stat: true, data: object }}
 */
function success(data) {
  return { stat: true, data };
}

/**
 * Wraps an error in the standard failure response envelope.
 * @param {string} message - A human-readable error message.
 * @returns {{ stat: false, message: string }}
 */
function failure(message) {
  return { stat: false, message };
}

// ─── READ OPERATIONS ───────────────────────────────────────────────────────────

/**
 * Get all records with optional search and category filters.
 * Used by: admin dashboard, search functionality.
 *
 * @param {{ searchTerm?: string, index?: number, items?: number, categories?: string[] }} params
 * @returns {Promise<object>} Standard response with { list, count, index, items }.
 */
export async function getAllRecords({ searchTerm = '', index = 1, items = 25, categories = [] } = {}) {
  try {
    const { skip, limit } = paginate(index, items);
    const result = await RecordQueries.findAllRecords({ searchTerm, skip, limit, categories });

    return success({
      list: result.list,
      count: result.count,
      index: parseInt(index, 10),
      items: limit,
    });
  } catch (error) {
    console.error('[RecordService] getAllRecords failed:', error.message);
    return failure('Failed to fetch records.');
  }
}

/**
 * Get a single record's full details by its URL slug.
 * Used by: [slug]/page.jsx detail page.
 *
 * @param {{ title_slug: string }} params
 * @returns {Promise<object>} Standard response with { data: record }.
 */
export async function getRecordDetails({ title_slug } = {}) {
  try {
    if (!title_slug) return failure('title_slug is required.');

    const record = await RecordQueries.findRecordBySlug(title_slug);
    if (!record) return failure(`Record not found: ${title_slug}`);

    // Return the record directly — page.jsx accesses callApi().data to get the record
    return success(record);
  } catch (error) {
    console.error('[RecordService] getRecordDetails failed:', error.message);
    return failure('Failed to fetch record details.');
  }
}

/**
 * Get records for a specific category (e.g., "latest-jobs", "admit-cards").
 * Used by: ListingTable component, category listing pages.
 *
 * @param {{ category: string, index?: number, items?: number, exclude?: string }} params
 * @returns {Promise<object>} Standard response with { list, count }.
 */
export async function getCategoryRecords({ category, index = 1, items = 25, exclude = '' } = {}) {
  try {
    if (!category) return failure('category is required.');

    const { skip, limit } = paginate(index, items);
    const result = await RecordQueries.findRecordsByCategory({ category, skip, limit, exclude });

    return success({
      list: result.list,
      count: result.count,
      index: parseInt(index, 10),
      items: limit,
    });
  } catch (error) {
    console.error('[RecordService] getCategoryRecords failed:', error.message);
    return failure('Failed to fetch category records.');
  }
}

/**
 * Get records matching a filter key (exam type, state, qualification).
 * Used by: /sarkari-result/[category] filter pages.
 *
 * @param {{ category: string, index?: number, items?: number }} params
 * @returns {Promise<object>} Standard response with { list, count }.
 */
export async function getFilteredRecords({ category, index = 1, items = 50 } = {}) {
  try {
    if (!category) return failure('filter category is required.');

    const { skip, limit } = paginate(index, items);
    const result = await RecordQueries.findRecordsByFilter({ filterKey: category, skip, limit });

    return success({
      list: result.list,
      count: result.count,
      index: parseInt(index, 10),
      items: limit,
    });
  } catch (error) {
    console.error('[RecordService] getFilteredRecords failed:', error.message);
    return failure('Failed to fetch filtered records.');
  }
}

/**
 * Get the latest important/highlighted records for the home page.
 * Used by: LatestUpdates component on home page.
 *
 * @param {{ index?: number, items?: number }} params
 * @returns {Promise<object>} Standard response with { list }.
 */
export async function getLatestImportantRecords({ index = 1, items = 10 } = {}) {
  try {
    const { skip, limit } = paginate(index, items);
    const result = await RecordQueries.findLatestImportantRecords({ skip, limit });

    return success({ list: result.list });
  } catch (error) {
    console.error('[RecordService] getLatestImportantRecords failed:', error.message);
    return failure('Failed to fetch important records.');
  }
}

/**
 * Get all title slugs for static site generation (generateStaticParams).
 * Used by: [slug]/page.jsx and sitemap generation.
 *
 * @returns {Promise<object>} Standard response with { list: string[] }.
 */
export async function getAllSlugs() {
  try {
    const slugs = await RecordQueries.findAllSlugs();
    return success({ list: slugs });
  } catch (error) {
    console.error('[RecordService] getAllSlugs failed:', error.message);
    return failure('Failed to fetch slugs.');
  }
}

// ─── WRITE OPERATIONS (Admin only) ─────────────────────────────────────────────

/**
 * Fetches all slugs and their last updated dates for dynamic sitemap.
 * Used by: src/app/sitemap.js
 *
 * @returns {Promise<object>} Standard response with { list }
 */
export async function getAllSitemapNodes() {
  try {
    const slugs = await RecordQueries.getAllSitemapNodes();
    return success({ list: slugs });
  } catch (error) {
    console.error('[RecordService] getAllSitemapNodes failed:', error.message);
    return failure('Failed to fetch sitemap nodes.');
  }
}

/**
 * Add a new record to the database.
 * Generates a unique_id and sets timestamps automatically.
 * Used by: admin panel create form.
 *
 * @param {{ record: object }} params - The record to insert.
 * @returns {Promise<object>} Standard response with { insertedId }.
 */
export async function addRecord({ record } = {}) {
  try {
    if (!record) return failure('Record data is required.');

    // Generate a unique ID if not provided
    if (!record.unique_id) {
      record.unique_id = crypto.randomUUID().replace(/-/g, '');
    }

    // Set timestamps
    const now = String(Date.now());
    record.inserted = record.inserted || now;
    record.updated = now;

    // Default flags
    record.pendingForm = record.pendingForm ?? false;
    record.active = record.active ?? true;

    // Process meta details (extract title, slug, org from sections)
    processRecordMetadata(record);

    // Ensure slug uniqueness (if necessary, though MongoDB index usually enforces it)
    let existingRecord = await RecordQueries.findRecordBySlug(record.title_slug);
    if (existingRecord) {
      record.title_slug = `${record.title_slug}-${crypto.randomBytes(3).toString('hex')}`;
    }

    const result = await RecordQueries.insertRecord(record);

    return success({
      insertedId: result.insertedId,
      unique_id: record.unique_id,
    });
  } catch (error) {
    console.error('[RecordService] addRecord failed:', error.message);
    return failure('Failed to add record.');
  }
}

/**
 * Update an existing record by its unique_id.
 * Used by: admin panel edit form.
 *
 * @param {{ unique_id: string, updateData: object }} params
 * @returns {Promise<object>} Standard response with { modifiedCount }.
 */
export async function updateRecord({ unique_id, updateData, id } = {}) {
  try {
    // Support both `unique_id` and `id` param names (API route uses `id`)
    const recordId = unique_id || id;
    if (!recordId) return failure('unique_id is required.');
    if (!updateData) return failure('updateData is required.');

    // Process meta details just in case the title/org was updated
    processRecordMetadata(updateData);

    const result = await RecordQueries.updateRecordById(recordId, updateData);

    if (result.matchedCount === 0) {
      return failure(`Record not found: ${recordId}`);
    }

    return success({ modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error('[RecordService] updateRecord failed:', error.message);
    return failure('Failed to update record.');
  }
}

/**
 * Delete a record by its unique_id.
 * Used by: admin panel delete action.
 *
 * @param {{ unique_id: string }} params
 * @returns {Promise<object>} Standard response with { deletedCount }.
 */
export async function deleteRecord({ unique_id, id } = {}) {
  try {
    // Support both `unique_id` and `id` param names
    const recordId = unique_id || id;
    if (!recordId) return failure('unique_id is required.');

    const result = await RecordQueries.deleteRecordById(recordId);

    if (result.deletedCount === 0) {
      return failure(`Record not found: ${recordId}`);
    }

    return success({ deletedCount: result.deletedCount });
  } catch (error) {
    console.error('[RecordService] deleteRecord failed:', error.message);
    return failure('Failed to delete record.');
  }
}
