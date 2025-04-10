"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "@/components/Calendar";

// 임시 데이터
const userProfile = {
  nickname: "방탈러",
  profileImage: "/images/profile.jpg",
  gender: "male",
  mannerScore: 4.5,
  tags: ["#공포매니아", "#추리고수", "#액션러버", "#초보환영", "#친절한"],
  stats: {
    successRate: 75,
    averageClear: 45,
    totalRooms: 30,
  },
};

const wishThemes = [
  {
    id: 1,
    title: "비밀의 방",
    storeName: "이스케이프 홍대점",
    genre: "추리",
    playTime: "60분",
    thumbnail: "/images/theme-1.jpg",
  },
  // ... 더 많은 테마
];

export default function MyPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation activePage="my" />

      {/* Section 1: 사용자 프로필 */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-6">
              <div className="relative">
                <Image
                  src={userProfile.profileImage}
                  alt="프로필 이미지"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {userProfile.gender === "male" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    )}
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {userProfile.nickname}
                </h1>
                <div className="flex gap-2 mb-4">
                  <span className="text-sm text-gray-600">
                    매너점수 {userProfile.mannerScore}
                  </span>
                </div>
                <div className="flex gap-2">
                  {userProfile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              프로필 수정
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">평균 성공률</div>
              <div className="text-2xl font-bold">
                {userProfile.stats.successRate}%
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">평균 클리어</div>
              <div className="text-2xl font-bold">
                {userProfile.stats.averageClear}분
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">누적 방 수</div>
              <div className="text-2xl font-bold">
                {userProfile.stats.totalRooms}개
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 모임 희망 테마 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">모임 희망 테마</h2>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              테마 추가
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishThemes.map((theme) => (
              <Link
                key={theme.id}
                href={`/themes/${theme.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={theme.thumbnail}
                    alt={theme.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{theme.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {theme.storeName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{theme.genre}</span>
                    <span>•</span>
                    <span>{theme.playTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: 나의 탈출일지 */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">나의 탈출일지</h2>
            <Link
              href="/my/diary"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              전체보기
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <Calendar
                selectedDate={selectedDate}
                onChange={setSelectedDate}
                markedDates={[
                  new Date(),
                  new Date(2024, 2, 15),
                  new Date(2024, 2, 20),
                ]}
              />
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              {selectedDate ? (
                <div className="space-y-4">
                  <div className="text-lg font-medium mb-4">
                    {selectedDate.toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      weekday: "long",
                    })}
                  </div>
                  {/* 선택된 날짜의 탈출일지 목록 */}
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium mb-1">비밀의 방</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          이스케이프 홍대점
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>4인 참여</span>
                          <span>•</span>
                          <span>60분</span>
                          <span>•</span>
                          <span className="text-green-500">성공</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                        힌트 2회
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  날짜를 선택하면 탈출일지를 확인할 수 있습니다
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 나의 모임 히스토리 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">나의 모임 히스토리</h2>
            <Link
              href="/my/meetings"
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              전체보기
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                      <Image
                        src={`/images/meeting-${item}.jpg`}
                        alt="Meeting thumbnail"
                        width={96}
                        height={96}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">
                        공포 테마 같이 도전하실 분!
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        비밀의 방 [미스터리 룸 잠입전]
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>이스케이프 홍대점</span>
                        <span>•</span>
                        <span>2024.03.15 (금)</span>
                        <span>•</span>
                        <span>4인 참여</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      후기 작성
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
