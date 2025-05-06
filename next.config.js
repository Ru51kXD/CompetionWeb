/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  swcMinify: true,
  optimizeFonts: true,
  experimental: {
    optimizeCss: true
  }
}

module.exports = nextConfig 