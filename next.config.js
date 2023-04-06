/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_URL ?? '',
};

module.exports = nextConfig;
