const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://www.googlesyndication.com https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://adservice.google.com https://*.google.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.google.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https: https://*.google.com https://*.google-analytics.com https://*.googlesyndication.com https://*.doubleclick.net https://ep1.adtrafficquality.google.com https://adservice.google.com https://realm.mongodb.com",
  "frame-src 'self' https: https://googleads.g.doubleclick.net https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com",
  "frame-ancestors 'none'",
].join('; ');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)", // applies to all routes
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
