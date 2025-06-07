/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['firebasestorage.googleapis.com'],
  },
  trailingSlash: true,
  basePath: '',
  assetPrefix: '/',
}

module.exports = nextConfig 