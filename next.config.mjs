/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: *.googlesyndication.com *.google.com *.googletagservices.com *.googletagmanager.com *.doubleclick.net *.google-analytics.com *.adservice.google.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com *.google.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: *.google.com *.gstatic.com *.googlesyndication.com *.doubleclick.net *.google.com.sg *.google.co.in i.ibb.co",
              "connect-src 'self' https: *.google.com *.google-analytics.com *.googlesyndication.com *.doubleclick.net *.adservice.google.com realm.mongodb.com",
              "frame-src 'self' https: *.google.com *.googlesyndication.com *.doubleclick.net",
            ].join('; '),
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
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;