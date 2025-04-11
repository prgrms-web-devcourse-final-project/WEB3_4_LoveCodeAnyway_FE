"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "@/components/Calendar";
import axios from "axios";

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.NODE_ENV === "development"
  ? "http://localhost:8080"
  : "https://api.ddobang.site";

// 타입 정의
type UserProfile = {
  nickname: string;
  profileImage: string;
  gender: string;
  mannerScore: number;
  tags: string[];
  stats: {
    successRate: number;
    averageClear: number;
    totalRooms: number;
  };
};

type WishTheme = {
  id: number;
  title: string;
  storeName: string;
  genre: string;
  playTime: string;
  thumbnailUrl: string;
};

type CalendarDiary = {
  id: number;
  date: string;
  title: string;
  themeName: string;
  isSuccess: boolean;
};

export default function MyPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [wishThemes, setWishThemes] = useState<WishTheme[]>([]);
  const [calendarDiaries, setCalendarDiaries] = useState<CalendarDiary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 프로필 정보 가져오기
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
        withCredentials: true,
      });
      setUserProfile(response.data.data);
    } catch (error) {
      console.error("프로필 로딩 에러:", error);
      setError("프로필을 불러오는데 실패했습니다.");
    }
  };

  // 희망 테마 가져오기
  const fetchWishThemes = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/users/me/wish-themes`,
        {
          withCredentials: true,
        }
      );
      setWishThemes(response.data.data);
    } catch (error) {
      console.error("희망 테마 로딩 에러:", error);
      setError("희망 테마를 불러오는데 실패했습니다.");
    }
  };

  // 달력 데이터 가져오기
  const fetchCalendarDiaries = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/diaries/calendar`,
        {
          withCredentials: true,
        }
      );
      setCalendarDiaries(response.data.data);
    } catch (error) {
      console.error("달력 데이터 로딩 에러:", error);
      setError("달력 데이터를 불러오는데 실패했습니다.");
    }
  };

  // 컴포넌트 마운트 시 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchUserProfile(),
          fetchWishThemes(),
          fetchCalendarDiaries(),
        ]);
      } catch (error) {
        console.error("데이터 로딩 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">프로필을 찾을 수 없습니다.</div>
      </div>
    );
  }

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
                  src={userProfile.profileImage || "/images/profile.jpg"}
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
            <Link
              href="/my/profile/edit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              프로필 수정
            </Link>
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
            <Link
              href="/themes"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              테마 추가
            </Link>
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
                    src={theme.thumbnailUrl || "/images/theme-placeholder.jpg"}
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
                markedDates={calendarDiaries.map(
                  (diary) => new Date(diary.date)
                )}
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
                    })}
                  </div>
                  {calendarDiaries
                    .filter(
                      (diary) =>
                        new Date(diary.date).toDateString() ===
                        selectedDate.toDateString()
                    )
                    .map((diary) => (
                      <Link
                        key={diary.id}
                        href={`/my/diary/${diary.id}`}
                        className="block bg-white p-4 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-medium mb-2">{diary.title}</h3>
                        <p className="text-sm text-gray-600">
                          {diary.themeName}
                        </p>
                        <span
                          className={`inline-block mt-2 px-2 py-1 text-sm rounded ${
                            diary.isSuccess
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {diary.isSuccess ? "성공" : "실패"}
                        </span>
                      </Link>
                    ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  날짜를 선택하면 해당 날짜의 탈출일지를 볼 수 있습니다.
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
              href="/my/parties"
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
                      <div key={item} className="space-y-2">
                        <div className="aspect-video relative rounded-lg overflow-hidden">
                          <Image
                            src={`/images/meeting-${item}.jpg`}
                            alt="Party thumbnail"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
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
