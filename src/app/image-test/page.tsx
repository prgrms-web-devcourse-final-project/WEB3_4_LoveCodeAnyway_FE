"use client";

import { Navigation } from "@/components/Navigation";
import Image from "next/image";
import { useState } from "react";

export default function ImageTestPage() {
  // 테스트 이미지 URL
  const cafefilesImageUrl = "https://cafefiles.pstatic.net/MjAyNDA0MTFfMTc1/MDAxNzEyODEyODM3NDc1.QaT4BMKZyYEUF9iQXnFl2Hxg5fGW44DYNnVpvnzQWpYg.LxVoIeKGBX9UPkiIX0JxHWM3bEjTiA66JQk7Ax4GGP0g.JPEG/%BD%C3%BC%B1%C0%AF%C1%F6%C7%D5%BF%B9%BE%DF.jpg";
  const naverbookingImageUrl = "https://naverbooking-phinf.pstatic.net/20230905_64/1693877492148vQPjv_JPEG/KakaoTalk_Photo_2023-09-05-11-50-43_002.jpeg?type=f804_408";
  const insecureImageUrl = "https://www.xn--vh3bn2thtas7l8te.com/file/theme/2_a.jpg";
  
  // 프록시를 통한 URL 변환
  const proxyImageUrl = `/img-proxy/file/theme/2_a.jpg`;

  const [cafeSrcError, setCafeSrcError] = useState(false);
  const [bookingSrcError, setBookingSrcError] = useState(false);
  const [insecureSrcError, setInsecureSrcError] = useState(false);
  const [proxySrcError, setProxySrcError] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activePage="" />
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">외부 이미지 로딩 테스트</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* cafefiles.pstatic.net 이미지 테스트 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">cafefiles.pstatic.net</h2>
            <div className="relative aspect-video bg-gray-100 overflow-hidden rounded-lg mb-4">
              {!cafeSrcError ? (
                <Image
                  src={cafefilesImageUrl}
                  alt="네이버 카페 이미지 테스트"
                  fill
                  className="object-cover"
                  unoptimized={true}
                  onError={() => setCafeSrcError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">이미지 로딩 실패</p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 break-all">{cafefilesImageUrl}</p>
          </div>
          
          {/* naverbooking-phinf.pstatic.net 이미지 테스트 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">naverbooking-phinf.pstatic.net</h2>
            <div className="relative aspect-video bg-gray-100 overflow-hidden rounded-lg mb-4">
              {!bookingSrcError ? (
                <Image
                  src={naverbookingImageUrl}
                  alt="네이버 예약 이미지 테스트"
                  fill
                  className="object-cover"
                  unoptimized={true}
                  onError={() => setBookingSrcError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">이미지 로딩 실패</p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 break-all">{naverbookingImageUrl}</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">인증서 오류 사이트 이미지 테스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* 인증서 오류 사이트 직접 접근 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">인증서 오류 사이트 - unoptimized</h2>
            <div className="relative aspect-video bg-gray-100 overflow-hidden rounded-lg mb-4">
              {!insecureSrcError ? (
                <Image
                  src={insecureImageUrl}
                  alt="인증서 오류 테스트 - 직접 접근"
                  fill
                  className="object-cover"
                  unoptimized={true}
                  onError={() => setInsecureSrcError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">이미지 로딩 실패</p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 break-all">{insecureImageUrl}</p>
          </div>
          
          {/* 인증서 오류 사이트 프록시 접근 */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">인증서 오류 사이트 - 프록시 방식</h2>
            <div className="relative aspect-video bg-gray-100 overflow-hidden rounded-lg mb-4">
              {!proxySrcError ? (
                <Image
                  src={proxyImageUrl}
                  alt="인증서 오류 테스트 - 프록시 접근"
                  fill
                  className="object-cover"
                  onError={() => setProxySrcError(true)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-red-500">이미지 로딩 실패</p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 break-all">{proxyImageUrl}</p>
            <p className="text-xs text-gray-400 mt-2">
              Next.js rewrites를 통한 프록시 방식 (unoptimized 옵션 없음)
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">이미지 로딩 상태</h2>
          <ul className="list-disc pl-5">
            <li className="mb-2">
              카페 이미지: 
              <span className={cafeSrcError ? "text-red-500" : "text-green-500"}>
                {cafeSrcError ? " 실패" : " 성공"}
              </span>
            </li>
            <li className="mb-2">
              예약 이미지: 
              <span className={bookingSrcError ? "text-red-500" : "text-green-500"}>
                {bookingSrcError ? " 실패" : " 성공"}
              </span>
            </li>
            <li className="mb-2">
              인증서 오류 이미지 (직접): 
              <span className={insecureSrcError ? "text-red-500" : "text-green-500"}>
                {insecureSrcError ? " 실패" : " 성공"}
              </span>
            </li>
            <li>
              인증서 오류 이미지 (프록시): 
              <span className={proxySrcError ? "text-red-500" : "text-green-500"}>
                {proxySrcError ? " 실패" : " 성공"}
              </span>
            </li>
          </ul>
        </div>
        
        <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">인증서 오류 이미지 해결 방법</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>unoptimized={"{true}"} 사용</strong>: Next.js의 Image 컴포넌트에 unoptimized 옵션을 설정하면 
              이미지 최적화를 건너뛰고 직접 로드합니다.
            </li>
            <li>
              <strong>프록시 방식</strong>: Next.js의 rewrites를 사용하여 서버 측에서 이미지를 프록시합니다. 
              이 방법은 브라우저가 아닌 서버에서 이미지를 가져오므로 인증서 문제를 우회할 수 있습니다.
            </li>
            <li>
              <strong>img 태그 직접 사용</strong>: 
              <code className="bg-gray-100 px-2 py-1 rounded">{`<img src="${insecureImageUrl}" alt="직접 이미지 태그" />`}</code>
            </li>
          </ol>
          <div className="mt-4">
            <p className="text-sm text-gray-700">
              위 방법 중 프록시 방식이 보안 측면에서 가장 안전합니다. 
              사용자는 항상 안전한 자체 도메인에서 이미지를 로드합니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 