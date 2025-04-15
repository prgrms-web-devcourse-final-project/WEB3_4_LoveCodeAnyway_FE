/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 빌드 시 ESLint 검사를 실행하지 않음
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 타입 체크를 실행하지 않음
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    unoptimized: true, // 외부 이미지에 대한 최적화 비활성화
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api.ddobang.site/api/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
