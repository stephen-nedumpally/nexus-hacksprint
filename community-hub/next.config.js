/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com', // For Google user profile images
      'encrypted-tbn0.gstatic.com', // For startup logos
      'api.dicebear.com', // For generated avatars
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },
  },
}

module.exports = nextConfig
