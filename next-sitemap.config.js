/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://newsarkariresult.co.in',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin*', '/api/*', '/dashboard'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin'] },
    ],
  },
};
