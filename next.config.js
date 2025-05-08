/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // turn off build-time Google Fonts fetching
    optimizeFonts: false,
  },
};

module.exports = nextConfig;
