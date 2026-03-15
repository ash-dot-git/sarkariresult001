import { getAllSitemapNodes } from '@/lib/api-server';

export default async function sitemap() {
  const nodes = await getAllSitemapNodes();

  const posts = nodes.map((node) => ({
    url: `https://newsarkariresult.co.in/${node.title_slug}`,
    lastModified: new Date(parseInt(node.updated, 10)).toISOString(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

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
