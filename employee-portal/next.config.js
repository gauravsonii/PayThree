/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['localhost', 'vercel.app', 'github.com', '*.vercel.app']
  },
  output: 'standalone',
  experimental: {
    appDir: true,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/my-esops',
        permanent: false,
      },
    ];
  },
  // Ensure proper static generation
  trailingSlash: false,
  generateEtags: false,
};

module.exports = nextConfig;
