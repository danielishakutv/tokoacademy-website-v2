/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['tokoacademy.org', 'wp.tokoacademy.org'],
    unoptimized: true,
  },
  trailingSlash: true,
  reactStrictMode: true,
  compress: true,
}

module.exports = nextConfig
