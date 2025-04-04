/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // appDir is now the default in Next.js 14, so we can remove it
  },
  compiler: {
    removeConsole: false,
  },
}

module.exports = nextConfig 