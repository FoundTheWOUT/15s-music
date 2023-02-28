/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["15-music-test.oss-cn-guangzhou.aliyuncs.com"],
  },
};

module.exports = nextConfig;
