/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // For Google user profile images
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
