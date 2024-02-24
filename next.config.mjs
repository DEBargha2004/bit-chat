/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        hostname: 'cdn-icons-png.flaticon.com'
      },
      {
        hostname: 'firebasestorage.googleapis.com'
      }
    ]
  }
}

export default nextConfig
