import { getAllSitemapNodes } from '@/lib/api-server';
import {
  examTypeOptions,
  applicableStatesOptions,
  minimumQualificationOptions,
  otherTagsOptions
} from '@/data/filters';
import { getAllSlugs } from '@/lib/newsCache';

/**
 * Static pages that should always be in the sitemap.
 * These are pages that exist as routes but aren't dynamic.
 */
const STATIC_PAGES = [
  { url: '/', changeFrequency: 'hourly', priority: 1.0 },
  { url: '/latest-jobs', changeFrequency: 'daily', priority: 0.9 },
  { url: '/result', changeFrequency: 'daily', priority: 0.9 },
  { url: '/admit-cards', changeFrequency: 'daily', priority: 0.9 },
  { url: '/answer-key', changeFrequency: 'daily', priority: 0.8 },
  { url: '/syllabus', changeFrequency: 'weekly', priority: 0.7 },
  { url: '/admission', changeFrequency: 'daily', priority: 0.8 },
  { url: '/sarkari-yojna', changeFrequency: 'daily', priority: 0.8 },
  { url: '/upcoming', changeFrequency: 'daily', priority: 0.8 },
  { url: '/documents', changeFrequency: 'weekly', priority: 0.6 },
  { url: '/offline-form', changeFrequency: 'weekly', priority: 0.6 },
  { url: '/sarkari-result', changeFrequency: 'daily', priority: 0.9 },
  { url: '/news', changeFrequency: 'hourly', priority: 0.9 },
  { url: '/about', changeFrequency: 'monthly', priority: 0.4 },
  { url: '/contact', changeFrequency: 'monthly', priority: 0.4 },
  { url: '/privacy-policy', changeFrequency: 'yearly', priority: 0.3 },
  { url: '/disclaimer', changeFrequency: 'yearly', priority: 0.3 },
];

const BASE_URL = 'https://newsarkariresult.co.in';

export default async function sitemap() {
  const nodes = await getAllSitemapNodes();

  // Dynamic post pages from the database
  const posts = nodes.map((node) => {
    let lastModified = new Date(); // Fallback to now
    try {
      if (node.updated) {
        const parsedDate = new Date(parseInt(node.updated, 10));
        // Check if date is valid
        if (!isNaN(parsedDate.getTime())) {
          lastModified = parsedDate;
        }
      }
    } catch (e) {
      console.warn(`Invalid date format for slug: ${node.title_slug}`, e);
    }

    return {
      url: `${BASE_URL}/${encodeURIComponent(node.title_slug)}`,
      lastModified: lastModified.toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
    };
  });

  // Static pages
  const staticPages = STATIC_PAGES.map((page) => ({
    url: `${BASE_URL}${page.url}`,
    lastModified: new Date().toISOString(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Category pages under /sarkari-result/[category]
  const allFilters = [
    ...examTypeOptions,
    ...applicableStatesOptions,
    ...minimumQualificationOptions,
    ...otherTagsOptions,
  ];

  const categoryPages = allFilters.map((filter) => ({
    url: `${BASE_URL}/sarkari-result/${encodeURIComponent(filter.key)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // News article pages from MongoDB
  const newsSlugs = await getAllSlugs();
  const newsPages = newsSlugs
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${BASE_URL}/news/${encodeURIComponent(item.slug)}`,
      lastModified: item.generatedAt || new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
    }));

  return [
    ...staticPages,
    ...categoryPages,
    ...posts,
    ...newsPages,
  ];
}
