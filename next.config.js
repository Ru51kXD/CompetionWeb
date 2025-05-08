/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'randomuser.me', 'via.placeholder.com', 'cdn.viberu.ru', 'www.google.com'],
  },
  swcMinify: true,
  optimizeFonts: true,
  experimental: {
    optimizeCss: true
  }
}

module.exports = nextConfig 