import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 인증서 오류가 있는 도메인 목록
const CERTIFICATE_ERROR_DOMAINS = [
  'xn--vh3bn2thtas7l8te.com',
  'www.xn--vh3bn2thtas7l8te.com'
];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // 현재 요청 URL 문자열
  const requestUrl = request.url;
  
  // 인증서 오류 도메인이 포함된 요청인지 확인
  const hasErrorDomain = CERTIFICATE_ERROR_DOMAINS.some(domain => 
    requestUrl.includes(domain)
  );
  
  if (hasErrorDomain) {
    try {
      console.log('인증서 오류 도메인 감지:', requestUrl);
      
      // URL에서 도메인 이후 경로 추출
      const urlObj = new URL(requestUrl);
      const path = urlObj.pathname;
      
      // 프록시 URL로 변경
      const proxyUrl = new URL(request.nextUrl.origin);
      proxyUrl.pathname = `/img-proxy${path}`;
      
      console.log('프록시 URL로 변환:', proxyUrl.toString());
      
      // 요청을 프록시 URL로 리다이렉션
      return NextResponse.rewrite(proxyUrl);
    } catch (e) {
      console.error('미들웨어 URL 처리 오류:', e);
    }
  }
  
  return NextResponse.next();
}

// 모든 경로에 미들웨어 적용 (API 및 정적 파일 제외)
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}; 