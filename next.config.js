/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['tokoacademy.org', 'wp.tokoacademy.org'],
  },
  trailingSlash: true,
  reactStrictMode: true,
  compress: true,
}

module.exports = nextConfig
