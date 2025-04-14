/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/studio/:path*',
        destination: '/studio/:path*',
      },
    ];
  },
}

module.exports = nextConfig 