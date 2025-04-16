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
        hostname: 'www.themazex.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'www.thecode06.kr',
      },
      {
        protocol: 'https',
        hostname: 'xn--vh3bn2thtas7l8te.com',
      },
      {
        protocol: 'https',
        hostname: 'www.xn--vh3bn2thtas7l8te.com',
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
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data: https: http:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://dapi.kakao.com; script-src-elem 'self' 'unsafe-inline' https://dapi.kakao.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.ddobang.site http://localhost:8080 https://dapi.kakao.com;",
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://api.ddobang.site/api/v1/:path*",
      },
      // 인증서 오류 도메인 프록시
      {
        source: "/img-proxy/:path*",
        destination: "http://xn--vh3bn2thtas7l8te.com/:path*",
      },
    ];
  },
  // 웹 보안 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Referrer-Policy',
            value: 'no-referrer',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; img-src 'self' data: https: http:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://dapi.kakao.com; script-src-elem 'self' 'unsafe-inline' https://dapi.kakao.com; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.ddobang.site http://localhost:8080 https://dapi.kakao.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
