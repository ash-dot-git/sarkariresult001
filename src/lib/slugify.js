/**
 * @module slugify
 * @description Converts titles into URL-friendly slugs.
 */

/**
 * Converts a title string into a URL-friendly slug.
 * - Lowercases the string
 * - Removes special characters (keeps alphanumeric and spaces)
 * - Replaces spaces/consecutive hyphens with single hyphens
 * - Trims hyphens from start/end
 * - Caps at 80 characters (breaks at word boundary)
 *
 * @param {string} title - The title to slugify
 * @returns {string} URL-friendly slug
 *
 * @example
 * toSlug("India's PM Modi Visits Japan — A New Era!") // "indias-pm-modi-visits-japan-a-new-era"
 */
export function toSlug(title) {
  if (!title || typeof title !== 'string') return '';

  let slug = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '')     // Remove special chars
    .replace(/[\s-]+/g, '-')          // Spaces/hyphens to single hyphen
    .replace(/^-+|-+$/g, '');         // Trim hyphens

  // Cap at 80 chars, breaking at word boundary
  if (slug.length > 80) {
    slug = slug.substring(0, 80);
    const lastHyphen = slug.lastIndexOf('-');
    if (lastHyphen > 40) {
      slug = slug.substring(0, lastHyphen);
    }
  }

  return slug;
}
