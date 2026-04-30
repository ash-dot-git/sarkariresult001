import { getCollection, withRetry } from '../connection.js';

/**
 * Record Queries — Pure Database Access Layer (Repository Pattern)
 *
 * Every function here performs a single, focused MongoDB operation against the
 * `jobsorvacancies` collection. No business logic, no response formatting.
 *
 * This separation makes it trivial to swap out MongoDB for another database:
 * only this file needs to change, everything else stays the same.
 *
 * Collection: datavault.jobsorvacancies
 * Document fields: _id, category, show, sections, pendingForm, title_slug,
 *                  unique_id, active, inserted, description, title, updated
 */

const COLLECTION_NAME = 'jobsorvacancies';

/**
 * Returns the jobsorvacancies collection handle.
 * @returns {Promise<import('mongodb').Collection>}
 */
async function collection() {
  return getCollection(COLLECTION_NAME);
}

// ─── READ QUERIES ──────────────────────────────────────────────────────────────

/**
 * Fetches a paginated list of all published records, optionally filtered
 * by search term and/or categories.
 *
 * @param {object} params
 * @param {string} [params.searchTerm=''] - Text to search in title/description.
 * @param {number} [params.skip=0]        - Documents to skip (for pagination).
 * @param {number} [params.limit=25]      - Max documents to return.
 * @param {string[]} [params.categories]  - Filter by these categories.
 * @returns {Promise<{list: object[], count: number}>}
 */
export async function findAllRecords({ searchTerm = '', skip = 0, limit = 25, categories = [] } = {}) {
  return withRetry(async () => {
    const col = await collection();

    // Base filter: only published, non-draft records
    const filter = { pendingForm: { $ne: true } };

    // Apply category filter if specified
    if (categories.length > 0) {
      filter.category = { $in: categories };
    }

    // Apply text search if a search term is provided
    if (searchTerm.trim()) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Run count and find in parallel for better performance
    const [count, list] = await Promise.all([
      col.countDocuments(filter),
      col.find(filter)
        .sort({ updated: -1 })
        .skip(skip)
        .limit(limit)
        .project({
          _id: 0,
          title: 1,
          title_slug: 1,
          category: 1,
          description: 1,
          show: 1,
          unique_id: 1,
          inserted: 1,
          updated: 1,
        })
        .toArray(),
    ]);

    return { list, count };
  });
}

/**
 * Fetches a single record by its URL slug.
 *
 * @param {string} slug - The title_slug of the record.
 * @returns {Promise<object|null>} The full document, or null if not found.
 */
export async function findRecordBySlug(slug) {
  return withRetry(async () => {
    const col = await collection();
    return col.findOne(
      { title_slug: slug },
      { projection: { _id: 0 } }
    );
  });
}

/**
 * Fetches paginated records for a specific category.
 *
 * @param {object} params
 * @param {string} params.category        - The category to filter by.
 * @param {number} [params.skip=0]        - Documents to skip.
 * @param {number} [params.limit=25]      - Max documents to return.
 * @param {string} [params.exclude='']    - Slug to exclude (for "related posts").
 * @returns {Promise<{list: object[], count: number}>}
 */
export async function findRecordsByCategory({ category, skip = 0, limit = 25, exclude = '' } = {}) {
  return withRetry(async () => {
    const col = await collection();

    const filter = {
      category,
      pendingForm: { $ne: true },
    };

    // Exclude a specific record (used by RelatedPosts to avoid showing same post)
    if (exclude) {
      filter.title_slug = { $ne: exclude };
    }

    const [count, list] = await Promise.all([
      col.countDocuments(filter),
      col.find(filter)
        .sort({ updated: -1 })
        .skip(skip)
        .limit(limit)
        .project({
          _id: 0,
          title: 1,
          title_slug: 1,
          category: 1,
          show: 1,
          unique_id: 1,
          inserted: 1,
          updated: 1,
        })
        .toArray(),
    ]);

    return { list, count };
  });
}

/**
 * Fetches records matching a filter key. The filter key is checked against
 * the `category` field. This powers the /sarkari-result/[category] pages
 * where categories like "ssc", "banking", "railway" map to exam_type filters.
 *
 * @param {object} params
 * @param {string} params.filterKey - The filter category key.
 * @param {number} [params.skip=0]  - Documents to skip.
 * @param {number} [params.limit=50] - Max documents to return.
 * @returns {Promise<{list: object[], count: number}>}
 */
export async function findRecordsByFilter({ filterKey, skip = 0, limit = 50 } = {}) {
  return withRetry(async () => {
    const col = await collection();

    // Search across all filter arrays for the filter key
    const filter = {
      pendingForm: { $ne: true },
      $or: [
        { category: filterKey },
        { 'filters.exam_type': filterKey },
        { 'filters.applicable_states': filterKey },
        { 'filters.minimum_qualification': filterKey },
        { 'filters.other_tags': filterKey },
      ],
    };

    const [count, list] = await Promise.all([
      col.countDocuments(filter),
      col.find(filter)
        .sort({ updated: -1 })
        .skip(skip)
        .limit(limit)
        .project({
          _id: 0,
          title: 1,
          title_slug: 1,
          category: 1,
          show: 1,
          unique_id: 1,
          inserted: 1,
          updated: 1,
        })
        .toArray(),
    ]);

    return { list, count };
  });
}

/**
 * Fetches the latest records marked as "important" (visible on home page cards).
 * Important records are those with at least one show flag set to true.
 *
 * @param {object} params
 * @param {number} [params.skip=0]   - Documents to skip.
 * @param {number} [params.limit=10] - Max documents to return.
 * @returns {Promise<{list: object[]}>}
 */
export async function findLatestImportantRecords({ skip = 0, limit = 10 } = {}) {
  return withRetry(async () => {
    const col = await collection();

    const filter = {
      pendingForm: { $ne: true },
      $or: [
        { 'show.jobs': true },
        { 'show.results': true },
        { 'show.admitCard': true },
        { 'show.admission': true },
        { 'show.answerKey': true },
      ],
    };

    const list = await col.find(filter)
      .sort({ updated: -1 })
      .skip(skip)
      .limit(limit)
      .project({
        _id: 0,
        title: 1,
        title_slug: 1,
        category: 1,
        description: 1,
        show: 1,
        unique_id: 1,
        inserted: 1,
        updated: 1,
      })
      .toArray();

    return { list };
  });
}

/**
 * Fetches all title_slugs for static site generation (generateStaticParams).
 * Returns only the slug field to minimize payload.
 *
 * @returns {Promise<string[]>} Array of title_slug strings.
 */
export async function findAllSlugs() {
  return withRetry(async () => {
    const col = await collection();

    const docs = await col.find(
      { pendingForm: { $ne: true } },
      { projection: { _id: 0, title_slug: 1 } }
    ).toArray();

    return docs.map((doc) => doc.title_slug);
  });
}

// ─── WRITE QUERIES ─────────────────────────────────────────────────────────────

/**
 * Fetches all title_slugs and updated dates for dynamic sitemap generation.
 * @returns {Promise<Array<{title_slug: string, updated: string}>>}
 */
export async function getAllSitemapNodes() {
  return withRetry(async () => {
    const col = await collection();
    const docs = await col
      .find({ pendingForm: { $ne: true } })
      .project({ _id: 0, title_slug: 1, updated: 1 })
      .toArray();
    return docs;
  });
}

/**
 * Inserts a new record document into the collection.
 *
 * @param {object} record - The full record document to insert.
 * @returns {Promise<import('mongodb').InsertOneResult>}
 */
export async function insertRecord(record) {
  const col = await collection();
  return col.insertOne(record);
}

/**
 * Updates an existing record identified by its unique_id.
 *
 * @param {string} uniqueId  - The unique_id of the record to update.
 * @param {object} updateData - Fields to update (uses $set internally).
 * @returns {Promise<import('mongodb').UpdateResult>}
 */
export async function updateRecordById(uniqueId, updateData) {
  const col = await collection();
  return col.updateOne(
    { unique_id: uniqueId },
    { $set: { ...updateData, updated: String(Date.now()) } }
  );
}

/**
 * Deletes a record by its unique_id.
 *
 * @param {string} uniqueId - The unique_id of the record to delete.
 * @returns {Promise<import('mongodb').DeleteResult>}
 */
export async function deleteRecordById(uniqueId) {
  const col = await collection();
  return col.deleteOne({ unique_id: uniqueId });
}
