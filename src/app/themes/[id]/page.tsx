"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { useParams } from "next/navigation";
import { StarRating } from "@/components/StarRating";
import { RadarChart } from "@/components/RadarChart";
import { KakaoMap } from "@/components/KakaoMap";
import Image from "next/image";

interface ThemeDetail {
  id: string;
  title: string;
  category: string;
  image: string;
  themeTypes: string[];
  noHintEscapeRate: number;
  userEscapeRate: number;
  difficulty: number;
  price: number;
  playTime: number;
  recommendedPlayers: string;
  description: string;
  address: string;
  phoneNumber: string;
  ratings: {
    content: number;
    satisfaction: number;
    production: number;
    story: number;
    interior: number;
  };
  playCharacteristics: {
    difficulty: number;
    horror: number;
    activity: number;
    puzzles: number;
    devices: number;
  };
  statistics: {
    noHintEscapeRate: number;
    averageEscapeTime: number;
  };
}

export default function ThemeDetailPage() {
  const params = useParams();
  const themeId = params.id;

  // 평점 관련 상태
  const [liked, setLiked] = useState(false);

  // 실제 API 연동 시 themeId를 이용하여 데이터를 가져오도록 수정
  // 현재는 하드코딩된 데미 데이터 사용
  const themeDetail: ThemeDetail = {
    id: themeId as string,
    title: "미스터리 하우스",
    category: "미스터리 룸 강남점",
    image: "/images/mystery-room.jpg",
    themeTypes: ["미스터리", "추리", "공포"],
    noHintEscapeRate: 45,
    userEscapeRate: 78,
    difficulty: 4,
    price: 25000,
    playTime: 60,
    recommendedPlayers: "2-4",
    description:
      "어느 날 갑자기 사라진 탐정의 흔적을 찾아 미스터리를 해결하세요. 다양한 퍼즐과 장치들이 여러분을 기다립니다.",
    address: "서울특별시 강남구 테헤란로 123",
    phoneNumber: "02-1234-5678",
    ratings: {
      content: 4.5,
      satisfaction: 4.8,
      production: 4.2,
      story: 4.6,
      interior: 4.3,
    },
    playCharacteristics: {
      difficulty: 4.2,
      horror: 2.5,
      activity: 3.8,
      puzzles: 4.5,
      devices: 3.9,
    },
    statistics: {
      noHintEscapeRate: 45,
      averageEscapeTime: 52,
    },
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navigation activePage="themes" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {/* 섹션 1: 테마 정보 */}
        <div className="mb-8">
          <div className="mb-2">
            <h1 className="text-2xl font-bold mb-1">{themeDetail.title}</h1>
            <span className="text-gray-500">{themeDetail.category}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{themeDetail.playTime}분</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>{themeDetail.recommendedPlayers}인</span>
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            {themeDetail.themeTypes.map((type, index) => {
              // 태그별 색상 매핑
              const getTagStyle = (type: string) => {
                switch (type.toLowerCase()) {
                  case "미스터리":
                    return "bg-purple-100 text-purple-800";
                  case "추리":
                    return "bg-blue-100 text-blue-800";
                  case "공포":
                    return "bg-red-100 text-red-800";
                  case "액션":
                    return "bg-orange-100 text-orange-800";
                  case "sf":
                    return "bg-cyan-100 text-cyan-800";
                  case "판타지":
                    return "bg-indigo-100 text-indigo-800";
                  case "어드벤처":
                    return "bg-green-100 text-green-800";
                  case "퍼즐":
                    return "bg-yellow-100 text-yellow-800";
                  default:
                    return "bg-gray-100 text-gray-800";
                }
              };

              return (
                <span
                  key={index}
                  className={`inline-block px-3 py-1 text-sm rounded-full ${getTagStyle(
                    type
                  )}`}
                >
                  #{type}
                </span>
              );
            })}
          </div>
          <div className="relative w-full h-[400px] bg-gray-100 rounded-2xl overflow-hidden mb-4">
            <Image
              src={themeDetail.image}
              alt={themeDetail.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-2xl"
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">유저 탈출률</span>
                <span className="font-bold text-xl">
                  {themeDetail.userEscapeRate}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">노힌트 탈출률</span>
                <span className="font-bold text-xl">
                  {themeDetail.noHintEscapeRate}%
                </span>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">난이도</span>
                <StarRating rating={themeDetail.difficulty} maxRating={5} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">가격</span>
                <span className="font-medium">
                  {themeDetail.price.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 섹션 2: 설명 및 위치 */}
        <section className="bg-white rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex gap-8">
            <div className="w-1/2">
              <h2 className="text-2xl font-bold mb-4">테마 설명</h2>
              <p className="text-gray-600 leading-relaxed">
                {themeDetail.description}
              </p>
            </div>
            <div className="w-1/2">
              <h2 className="text-2xl font-bold mb-4">매장 위치</h2>
              <div className="h-64 bg-gray-200 rounded-lg mb-4">
                <KakaoMap address={themeDetail.address} />
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">{themeDetail.address}</p>
                <p className="text-gray-600">{themeDetail.phoneNumber}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 섹션 3: 평가 및 통계 */}
        <section className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-3 gap-8">
            {/* 유저 평가 */}
            <div>
              <h2 className="text-2xl font-bold mb-6">유저 평가</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">컨텐츠 품질</span>
                  <StarRating
                    rating={themeDetail.ratings.content}
                    maxRating={5}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">만족도</span>
                  <StarRating
                    rating={themeDetail.ratings.satisfaction}
                    maxRating={5}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">연출</span>
                  <StarRating
                    rating={themeDetail.ratings.production}
                    maxRating={5}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">스토리</span>
                  <StarRating
                    rating={themeDetail.ratings.story}
                    maxRating={5}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">인테리어</span>
                  <StarRating
                    rating={themeDetail.ratings.interior}
                    maxRating={5}
                  />
                </div>
              </div>
            </div>

            {/* 플레이 특성 */}
            <div>
              <h2 className="text-2xl font-bold mb-6">플레이 특성</h2>
              <div className="h-64">
                <RadarChart
                  data={[
                    themeDetail.playCharacteristics.difficulty,
                    themeDetail.playCharacteristics.horror,
                    themeDetail.playCharacteristics.activity,
                    themeDetail.playCharacteristics.puzzles,
                    themeDetail.playCharacteristics.devices,
                  ]}
                  labels={[
                    "난이도",
                    "공포도",
                    "활동성",
                    "문제 구성",
                    "장치 비율",
                  ]}
                />
              </div>
            </div>

            {/* 탈출 통계 */}
            <div>
              <h2 className="text-2xl font-bold mb-6">탈출 통계</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-600 mb-2">노힌트 탈출률</p>
                  <p className="text-4xl font-bold">
                    {themeDetail.statistics.noHintEscapeRate}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-2">평균 탈출 시간</p>
                  <p className="text-4xl font-bold">
                    {themeDetail.statistics.averageEscapeTime}분
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 액션 버튼 */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => setLiked(!liked)}
            className="flex-1 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 flex justify-center items-center text-gray-700"
          >
            <svg
              className={`w-5 h-5 mr-2 ${
                liked ? "text-red-500" : "text-gray-700"
              }`}
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            희망테마 등록
          </button>
          <Link href="/reservation" className="flex-1">
            <button className="w-full py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-900 flex justify-center items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              예약하러 가기
            </button>
          </Link>
          <Link href="/meetings/create" className="flex-1">
            <button className="w-full py-4 bg-white border border-gray-300 rounded-xl font-medium hover:bg-gray-50 flex justify-center items-center text-gray-700">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              모임 만들기
            </button>
          </Link>
          <Link href="/meetings" className="flex-1">
            <button className="w-full py-4 bg-white border border-gray-300 rounded-xl font-medium hover:bg-gray-50 flex justify-center items-center text-gray-700">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              모임 찾기
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
