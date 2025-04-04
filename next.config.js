/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true, // Required for static export
  },
  experimental: {
    // appDir is now the default in Next.js 14, so we can remove it
  },
  compiler: {
    removeConsole: false,
  },
}

module.exports = nextConfig 