"use client";

import { Navigation } from "@/components/Navigation";
import Image from "next/image";
import { useState } from "react";

export default function ImageTestPage() {
  // 두 도메인에서 가져올 테스트 이미지 URL
  const cafefilesImageUrl = "https://cafefiles.pstatic.net/MjAyNDA0MTFfMTc1/MDAxNzEyODEyODM3NDc1.QaT4BMKZyYEUF9iQXnFl2Hxg5fGW44DYNnVpvnzQWpYg.LxVoIeKGBX9UPkiIX0JxHWM3bEjTiA66JQk7Ax4GGP0g.JPEG/%BD%C3%BC%B1%C0%AF%C1%F6%C7%D5%BF%B9%BE%DF.jpg";
  const naverbookingImageUrl = "https://naverbooking-phinf.pstatic.net/20230905_64/1693877492148vQPjv_JPEG/KakaoTalk_Photo_2023-09-05-11-50-43_002.jpeg?type=f804_408";

  const [cafeSrcError, setCafeSrcError] = useState(false);
  const [bookingSrcError, setBookingSrcError] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activePage="" />
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">외부 이미지 로딩 테스트</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">이미지 로딩 상태</h2>
          <ul className="list-disc pl-5">
            <li className="mb-2">
              카페 이미지: 
              <span className={cafeSrcError ? "text-red-500" : "text-green-500"}>
                {cafeSrcError ? " 실패" : " 성공"}
              </span>
            </li>
            <li>
              예약 이미지: 
              <span className={bookingSrcError ? "text-red-500" : "text-green-500"}>
                {bookingSrcError ? " 실패" : " 성공"}
              </span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
} 