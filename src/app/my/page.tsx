"use client";

import { useState, useEffect } from "react";
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
  name?: string;
  difficulty?: number;
  rating?: number;
};

type CalendarDiary = {
  id: number;
  date: string;
  title: string;
  themeName: string;
  isSuccess: boolean;
  storeName?: string;
  escapeResult?: boolean;
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
      // API 호출 코드 주석 처리
      /*
      const response = await axios.get(`${API_BASE_URL}/api/v1/users/me`, {
        withCredentials: true,
      });
      setUserProfile(response.data.data);
      */

      // 가데이터로 대체
      const mockUserProfile: UserProfile = {
        nickname: "또방이",
        profileImage: "/default-profile.svg",
        gender: "male",
        mannerScore: 4.5,
        tags: ["친절함", "시간약속", "적극적"],
        stats: {
          successRate: 85,
          averageClear: 45,
          totalRooms: 12,
        },
      };
      setUserProfile(mockUserProfile);
    } catch (error) {
      console.error("프로필 로딩 에러:", error);
      setError("프로필을 불러오는데 실패했습니다.");
    }
  };

  // 희망 테마 가져오기
  const fetchWishThemes = async () => {
    try {
      // API 호출 코드 주석 처리
      /*
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/users/me/wish-themes`,
        {
          withCredentials: true,
        }
      );
      setWishThemes(response.data.data);
      */

      // 가데이터로 대체
      const mockWishThemes: WishTheme[] = [
        {
          id: 1,
          name: "미스터리 박스",
          thumbnailUrl:
            "https://www.roomlescape.com/file/theme_info/1723787821_10bd760472.gif",
          storeName: "이스케이프 룸",
          difficulty: 3,
          genre: "미스터리",
          rating: 4.5,
        },
        {
          id: 2,
          name: "좀비 아포칼립스",
          thumbnailUrl:
            "https://www.roomlescape.com/file/theme_info/1723787821_10bd760472.gif",
          storeName: "테마월드",
          difficulty: 4,
          genre: "공포",
          rating: 4.2,
        },
      ];
      setWishThemes(mockWishThemes);
    } catch (error) {
      console.error("희망 테마 로딩 에러:", error);
      setError("희망 테마를 불러오는데 실패했습니다.");
    }
  };

  // 달력 데이터 가져오기
  const fetchCalendarDiaries = async () => {
    try {
      // API 호출 코드 주석 처리
      /*
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/diaries/calendar`,
        {
          withCredentials: true,
        }
      );
      setCalendarDiaries(response.data.data);
      */

      // 가데이터로 대체
      const mockCalendarDiaries: CalendarDiary[] = [
        {
          date: "2023-06-15",
          themeName: "미스터리 박스",
          storeName: "이스케이프 룸",
          escapeResult: true,
        },
        {
          date: "2023-06-20",
          themeName: "좀비 아포칼립스",
          storeName: "테마월드",
          escapeResult: false,
        },
      ];
      setCalendarDiaries(mockCalendarDiaries);
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
    <main className="min-h-screen bg-gray-900">
      {/* Section 1: 사용자 프로필 */}
      <section className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FFB130] shadow-md">
                  <Image
                    src={userProfile.profileImage || "/images/profile.jpg"}
                    alt="프로필 이미지"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-md">
                  <svg
                    className="w-5 h-5 text-white"
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
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-3 text-white">
                  {userProfile.nickname}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <span className="inline-flex items-center text-sm bg-gray-700 px-3 py-1 rounded-full text-gray-200">
                    <svg
                      className="w-4 h-4 text-[#FFB130] mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    매너점수{" "}
                    <span className="font-semibold ml-1">
                      {userProfile.mannerScore}
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                  {userProfile.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#FFB130] text-black rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Link
              href="/my/edit"
              className="px-6 py-2.5 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors font-medium text-sm shadow-sm flex items-center gap-2"
            >
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              프로필 수정
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFB130]/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#FFB130]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-300 mb-1">평균 성공률</div>
                  <div className="text-3xl font-bold text-white">
                    {userProfile.stats.successRate}%
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFB130]/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#FFB130]"
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
                </div>
                <div>
                  <div className="text-sm text-gray-300 mb-1">평균 클리어</div>
                  <div className="text-3xl font-bold text-white">
                    {userProfile.stats.averageClear}
                    <span className="text-lg font-medium">분</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFB130]/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#FFB130]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-300 mb-1">누적 방 수</div>
                  <div className="text-3xl font-bold text-white">
                    {userProfile.stats.totalRooms}
                    <span className="text-lg font-medium">개</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: 모임 희망 테마 */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">
                모임 희망 테마
              </h2>
              <p className="text-gray-400 mt-1">내가 참여하고 싶은 테마들</p>
            </div>
            <Link
              href="/themes"
              className="px-6 py-2.5 bg-[#FFB130] text-black rounded-full hover:bg-[#F0A120] transition-colors font-medium text-sm shadow-sm flex items-center gap-2"
            >
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              테마 추가
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishThemes.map((theme) => (
              <Link
                key={theme.id}
                href={`/themes/${theme.id}`}
                className="bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:translate-y-[-4px] duration-300 border border-gray-700"
              >
                <div className="aspect-[3/4] relative">
                  <Image
                    src={theme.thumbnailUrl || "/images/theme-placeholder.jpg"}
                    alt={theme.title || theme.name || "테마"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-white mb-2 line-clamp-1">
                    {theme.title || theme.name}
                  </h3>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-1">
                    {theme.storeName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="px-2 py-1 bg-gray-700 rounded-md">
                      {theme.genre}
                    </span>
                    <span>•</span>
                    <span className="px-2 py-1 bg-gray-700 rounded-md">
                      {theme.playTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            <div className="bg-gray-800 rounded-2xl overflow-hidden border border-dashed border-gray-600 flex flex-col items-center justify-center p-6 min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-4 shadow-sm">
                <svg
                  className="w-8 h-8 text-[#FFB130]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <p className="text-gray-300 font-medium mb-2">
                새로운 테마 추가하기
              </p>
              <p className="text-gray-400 text-sm text-center mb-4">
                관심있는 테마를 찾아보세요
              </p>
              <Link
                href="/themes"
                className="px-4 py-2 bg-[#FFB130] text-black rounded-full text-sm hover:bg-[#F0A120] transition-colors"
              >
                테마 찾기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: 나의 탈출일지 */}
      <section className="py-12 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">나의 탈출일지</h2>
            <Link
              href="/my/diary"
              className="text-[#FFB130] hover:text-[#F0A120] transition-colors"
            >
              전체보기
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-700 rounded-lg p-6">
              <Calendar
                selectedDate={selectedDate}
                onChange={setSelectedDate}
                markedDates={calendarDiaries.map(
                  (diary) => new Date(diary.date)
                )}
              />
            </div>
            <div className="bg-gray-700 rounded-lg p-6">
              {selectedDate ? (
                <div className="space-y-4">
                  <div className="text-lg font-medium mb-4 text-white">
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
                        className="block bg-gray-800 p-4 rounded-lg hover:shadow-md transition-shadow border border-gray-600"
                      >
                        <h3 className="font-medium mb-2 text-white">{diary.title}</h3>
                        <p className="text-sm text-gray-300">
                          {diary.themeName}
                        </p>
                        <span
                          className={`inline-block mt-2 px-2 py-1 text-sm rounded ${
                            diary.isSuccess
                              ? "bg-green-900 text-green-300"
                              : "bg-red-900 text-red-300"
                          }`}
                        >
                          {diary.isSuccess ? "성공" : "실패"}
                        </span>
                      </Link>
                    ))}
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  날짜를 선택하면 해당 날짜의 탈출일지를 볼 수 있습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: 나의 모임 히스토리 */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">나의 모임 히스토리</h2>
            <Link
              href="/my/history"
              className="text-[#FFB130] hover:text-[#F0A120] transition-colors"
            >
              전체보기
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-700"
              >
                <div className="p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-700 rounded-lg flex-shrink-0 relative">
                      <Image
                        src={`https://i.postimg.cc/PJNVr12v/theme.jpg`}
                        alt="Party thumbnail"
                        fill
                        className="object-cover rounded-lg"
                        unoptimized
                        onError={(e) => {
                          // 이미지 로드 오류 시 기본 이미지(Base64 데이터 URL)로 대체
                          const fallbackImage =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2VlZWVlZSIvPjxwYXRoIGQ9Ik00NSA0NUgzMFY3NUg5MFY0NUg3NVYzMEg0NVY0NVpNNzUgOTBIMzBWNzVIOTBWNDVINzVWOTBaIiBmaWxsPSIjOTk5OTk5Ii8+PC9zdmc+";
                          (e.target as HTMLImageElement).src = fallbackImage;
                          (e.target as HTMLImageElement).onerror = null; // 이중 호출 방지
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1 text-white">
                        공포 테마 같이 도전하실 분!
                      </h3>
                      <p className="text-sm text-gray-300 mb-2">
                        비밀의 방 [미스터리 룸 잠입전]
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>이스케이프 홍대점</span>
                        <span>•</span>
                        <span>2024.03.15 (금)</span>
                        <span>•</span>
                        <span>4인 참여</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button className="px-4 py-2 bg-[#FFB130] text-black rounded-lg hover:bg-[#F0A120] transition-colors">
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
