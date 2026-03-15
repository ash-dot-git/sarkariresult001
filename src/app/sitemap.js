import { getAllSitemapNodes } from '@/lib/api-server';

export default async function sitemap() {
  const nodes = await getAllSitemapNodes();

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
      url: `https://newsarkariresult.co.in/${node.title_slug}`,
      lastModified: lastModified.toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
    };
  });

  return [
    {
      url: 'https://newsarkariresult.co.in',
      lastModified: new Date().toISOString(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    ...posts,
  ];
}
