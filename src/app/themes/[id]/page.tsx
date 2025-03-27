"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { useParams } from "next/navigation";

export default function ThemeDetailPage() {
  const params = useParams();
  const themeId = params.id;

  // 평점 관련 상태
  const [liked, setLiked] = useState(false);

  // 실제 API 연동 시 themeId를 이용하여 데이터를 가져오도록 수정
  // 현재는 하드코딩된 데미 데이터 사용
  const theme = {
    id: themeId,
    title: "미스터리 하우스",
    company: "이스케이프 룸",
    rating: 4.8,
    reviewCount: 123,
    tags: ["문제해결", "공포", "추리", "스토리"],
    noHintClearRate: 75,
    totalClearRate: 82,
    difficulty: 60,
    maxDifficulty: 5,
    currentDifficulty: 3,
    price: "2-3인 80,000원",
    playTime: "60분",
    capacity: "2-4인",
    genre: "미스터리/추리",
    location: {
      address: "서울시 강남구 역삼동 123-456",
      lat: 37.5,
      lng: 127.0,
    },
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navigation activePage="themes" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 타이틀 & 기본 정보 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{theme.title}</h1>
          <div className="flex items-center mb-3">
            <span className="text-gray-700">{theme.company}</span>
            <div className="flex items-center ml-4">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-yellow-600 font-bold">
                {theme.rating}
              </span>
              <span className="ml-1 text-gray-500">
                ({theme.reviewCount} 리뷰)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {theme.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 통계 영역 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-lg p-6 mb-8">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">노힌트 탈출률</span>
            <span className="text-2xl font-bold">{theme.noHintClearRate}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">플레이 탈출률</span>
            <span className="text-2xl font-bold">{theme.totalClearRate}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">장치/문제</span>
            <span className="text-2xl font-bold">{theme.difficulty}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">난이도</span>
            <div className="flex items-center">
              {Array.from({ length: theme.maxDifficulty }).map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full mx-0.5 ${
                    index < theme.currentDifficulty ? "bg-black" : "bg-gray-200"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* 테마 이미지 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">테마 이미지</h2>
          <div className="bg-gray-200 rounded-lg overflow-hidden h-80 flex items-center justify-center">
            <span className="text-gray-500">Image</span>
          </div>
        </div>

        {/* 정보 테이블 */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-4 font-medium text-gray-700 w-1/4">가격</td>
                <td className="py-4 text-right">{theme.price}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 font-medium text-gray-700">플레이 시간</td>
                <td className="py-4 text-right">{theme.playTime}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 font-medium text-gray-700">추천 인원</td>
                <td className="py-4 text-right">{theme.capacity}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 font-medium text-gray-700">테마/장르</td>
                <td className="py-4 text-right">{theme.genre}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 매장 위치 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">매장 위치</h2>
          <div className="bg-gray-200 rounded-lg overflow-hidden h-80 mb-4">
            {/* 실제 프로젝트에서는 지도 API 연동 */}
          </div>
          <p className="text-gray-700">{theme.location.address}</p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={() => setLiked(!liked)}
            className="flex-1 py-3 border border-gray-300 rounded-lg flex justify-center items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            찜한 테마 등록
          </button>
          <Link href="/reservation" className="flex-1">
            <button className="w-full py-3 bg-black text-white rounded-lg font-medium">
              예약하기
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
