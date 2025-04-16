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
        hostname: 'cafefiles.pstatic.net',
      },
      {
        protocol: 'https',
        hostname: 'naverbooking-phinf.pstatic.net',
      },
      {
        protocol: 'https',
        hostname: 'xn--vh3bn2thtas7l8te.com',
      },
      {
        protocol: 'https',
        hostname: 'www.themazex.co.kr',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',  // 모든 경로 허용
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',  // 모든 경로 허용
      }
    ],
    unoptimized: true, // 외부 이미지에 대한 최적화 비활성화
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api.ddobang.site/api/v1/:path*",
      },
      // 이미지 프록시 처리
      {
        source: "/img-proxy/:url*",
        destination: "https://xn--vh3bn2thtas7l8te.com/:url*",
      },
    ];
  },
};

module.exports = nextConfig;
