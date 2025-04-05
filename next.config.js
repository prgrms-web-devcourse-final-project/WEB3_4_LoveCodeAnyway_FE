/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 빌드 시 ESLint 검사를 실행하지 않음
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
