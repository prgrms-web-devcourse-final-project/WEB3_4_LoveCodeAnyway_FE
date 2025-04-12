"use client";

import { useState, useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation as SwiperNavigation,
  Pagination,
} from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// API 기본 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.NODE_ENV === "development"
  ? "http://localhost:8080"
  : "https://api.ddobang.site";

// 테마 태그 목록
const tags = ["#전체", "#공포", "#추리", "#액션", "#판타지", "#SF"];

// 테마 타입 정의
type Theme = {
  id: number;
  name: string;
  storeName: string;
  thumbnailUrl?: string;
  tags?: string[];
  rating?: number;
  region?: string;
  playTime?: string;
  recommendedPlayers?: string;
  genre?: string;
};

// 모임 타입 정의
type Party = {
  id: number;
  themeId: number;
  themeName: string;
  themeThumbnailUrl?: string;
  storeName: string;
  title: string;
  scheduledAt: string;
  acceptedParticipantCount: number;
  totalParticipants: number;
};

export default function HomePage() {
  // 상태 관리
  const [popularActiveTag, setPopularActiveTag] = useState("#전체");
  const [newActiveTag, setNewActiveTag] = useState("#전체");
  const [rankingThemes, setRankingThemes] = useState<Theme[]>([]);
  const [newThemes, setNewThemes] = useState<Theme[]>([]);
  const [parties, setParties] = useState<Party[]>([]);
  const [isLoadingRanking, setIsLoadingRanking] = useState(false);
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [isLoadingParties, setIsLoadingParties] = useState(false);

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    fetchRankingThemes();
    fetchNewThemes();
    fetchParties();
  }, []);

  // 인기 테마 태그 선택 시 API 호출
  useEffect(() => {
    fetchRankingThemes(popularActiveTag);
  }, [popularActiveTag]);

  // 신규 테마 태그 선택 시 API 호출
  useEffect(() => {
    fetchNewThemes(newActiveTag);
  }, [newActiveTag]);

  // 랭킹 테마 가져오기
  const fetchRankingThemes = async (tag?: string) => {
    setIsLoadingRanking(true);
    try {
      const tagName = tag === "#전체" ? "" : tag ? tag.substring(1) : "";
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/themes/popular`,
        {
          params: {
            tagName,
          },
          withCredentials: true,
        }
      );
      setRankingThemes(response.data.data || []);
    } catch (error) {
      console.error("랭킹 테마 조회 실패:", error);
      setRankingThemes([]);
    } finally {
      setIsLoadingRanking(false);
    }
  };

  // 신규 테마 가져오기
  const fetchNewThemes = async (tag?: string) => {
    setIsLoadingNew(true);
    try {
      const tagName = tag === "#전체" ? "" : tag ? tag.substring(1) : "";
      const response = await axios.get(`${API_BASE_URL}/api/v1/themes/newest`, {
        params: {
          tagName,
        },
        withCredentials: true,
      });
      setNewThemes(response.data.data || []);
    } catch (error) {
      console.error("신규 테마 조회 실패:", error);
      setNewThemes([]);
    } finally {
      setIsLoadingNew(false);
    }
  };

  // 실시간 모집 파티 가져오기
  const fetchParties = async () => {
    setIsLoadingParties(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/parties/main`, {
        withCredentials: true,
      });
      // API 응답이 없거나 빈 배열인 경우 더미 데이터 사용
      setParties(
        response.data.data?.length ? response.data.data : getDummyParties()
      );
    } catch (error) {
      console.error("모임 조회 실패:", error);
      setParties(getDummyParties());
    } finally {
      setIsLoadingParties(false);
    }
  };

  // 더미 파티 데이터 생성 함수
  const getDummyParties = (): Party[] => {
    return [
      {
        id: 1,
        themeId: 101,
        themeName: "마법사의 방",
        themeThumbnailUrl: "",
        storeName: "마법의 방탈출",
        title: "마법사의 방 함께 하실 분 구합니다!",
        scheduledAt: "2024-03-20T19:00:00",
        acceptedParticipantCount: 2,
        totalParticipants: 4,
      },
      {
        id: 2,
        themeId: 102,
        themeName: "추리왕",
        themeThumbnailUrl: "",
        storeName: "추리방탈출",
        title: "추리왕 테마 함께 하실 분",
        scheduledAt: "2024-03-21T20:00:00",
        acceptedParticipantCount: 3,
        totalParticipants: 6,
      },
      {
        id: 3,
        themeId: 103,
        themeName: "좀비 아포칼립스",
        themeThumbnailUrl: "",
        storeName: "호러방탈출",
        title: "좀비 테마 2명 더 필요합니다!",
        scheduledAt: "2024-03-22T18:30:00",
        acceptedParticipantCount: 4,
        totalParticipants: 6,
      },
      {
        id: 4,
        themeId: 104,
        themeName: "타임머신",
        themeThumbnailUrl: "",
        storeName: "SF방탈출",
        title: "타임머신 테마 모임",
        scheduledAt: "2024-03-23T19:30:00",
        acceptedParticipantCount: 1,
        totalParticipants: 4,
      },
      {
        id: 5,
        themeId: 105,
        themeName: "황금열쇠",
        themeThumbnailUrl: "",
        storeName: "모험방탈출",
        title: "황금열쇠 테마 함께 하실 분",
        scheduledAt: "2024-03-24T20:00:00",
        acceptedParticipantCount: 2,
        totalParticipants: 4,
      },
    ];
  };

  // 로딩 인디케이터 컴포넌트
  const LoadingIndicator = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-32 bg-gray-200 rounded-lg mb-3 animate-pulse"></div>
            <div className="h-6 w-3/4 bg-gray-200 rounded mb-1 animate-pulse"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // 테마 스켈레톤 UI
  const ThemeSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="relative">
          <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse">
            <div className="absolute top-4 left-4 h-6 w-12 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="h-6 w-3/4 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded mb-2 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // 테마 없음 컴포넌트
  const EmptyState = () => (
    <div className="text-center py-12 min-h-[400px] flex items-center justify-center">
      <p className="text-gray-500">해당 태그의 테마가 없습니다.</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      {/* Section 1: 메인 배너 */}
      <section className="w-full h-[400px] relative bg-gray-800">
        <Navigation activePage="home" />
        <div className="max-w-7xl mx-auto h-full relative flex flex-col items-center justify-start text-center pt-8">
          <Image
            src="/logo.svg"
            alt="또방 로고"
            width={250}
            height={100}
            priority
            className="mb-6"
          />
          <h1 className="text-white text-3xl font-bold">
            방탈출 메이트 찾기, 또방
          </h1>
          <p className="text-gray-300 mt-4 max-w-2xl">
            함께 방탈출할 메이트를 찾고 계신가요?
            <br />
            또방과 함께 방탈출 크루를 만들어보세요
          </p>
        </div>
      </section>

      {/* Section 2: 마감 임박 모임 */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            마감 임박 모임
          </h2>

          <div className="relative">
            <Swiper
              modules={[Autoplay, SwiperNavigation]}
              spaceBetween={20}
              slidesPerView={1}
              centeredSlides={false}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              className="py-4"
            >
              {isLoadingParties
                ? // 스켈레톤 UI
                  [...Array(4)].map((_, index) => (
                    <SwiperSlide
                      key={`skeleton-${index}`}
                      className="p-1 h-full"
                    >
                      <div className="rounded-lg overflow-hidden h-full flex flex-col bg-white border border-gray-200">
                        <div className="p-5 flex flex-col h-full">
                          <div className="flex items-center justify-between mb-3">
                            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                          </div>

                          <div className="h-40 bg-gray-200 rounded-lg mb-3 flex-shrink-0 animate-pulse"></div>

                          <div className="h-14">
                            <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                          <div className="h-6">
                            <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                          </div>

                          <div className="flex items-center mt-auto">
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                            <div className="mx-2"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                : parties.map((party, index) => (
                    <SwiperSlide key={party.id} className="p-1 h-full">
                      <Link
                        href={`/parties/${party.id}`}
                        className={`rounded-lg overflow-hidden transition-all h-full flex flex-col bg-white border border-gray-200`}
                      >
                        <div className="p-5 flex flex-col h-full">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-gray-600 text-sm">
                              {party.storeName}
                            </div>
                            <div className="text-red-500 text-sm font-medium">
                              {new Date(party.scheduledAt).toDateString() ===
                              new Date().toDateString()
                                ? "오늘마감"
                                : "D-1"}
                            </div>
                          </div>

                          <div className="flex justify-center items-center h-40 bg-gray-100 rounded-lg mb-3 flex-shrink-0">
                            {party.themeThumbnailUrl ? (
                              <Image
                                src={party.themeThumbnailUrl}
                                alt="모임 썸네일"
                                width={120}
                                height={120}
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 text-gray-400">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-8 w-8"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          <div className="h-14">
                            <h3 className="font-medium text-lg line-clamp-2 h-full">
                              {party.title}
                            </h3>
                          </div>
                          <div className="h-6">
                            <p className="text-gray-600 text-sm line-clamp-1">
                              {party.themeName}
                            </p>
                          </div>

                          <div className="flex items-center text-gray-600 text-sm mt-auto">
                            <span>
                              {party.acceptedParticipantCount}/
                              {party.totalParticipants}명
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              {new Date(party.scheduledAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
            </Swiper>

            {/* 커스텀 네비게이션 버튼 */}
            <div className="swiper-button-next !text-[#FFB130] !right-[-20px] md:!hidden"></div>
            <div className="swiper-button-prev !text-[#FFB130] !left-[-20px] md:!hidden"></div>

            {/* 더보기 버튼 */}
            <div className="flex justify-center mt-8">
              <Link
                href="/parties"
                className="px-6 py-2 border border-[#FFB130] text-[#FFB130] rounded-full hover:bg-[#FFB130] hover:text-white transition-colors"
              >
                더보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: 랭킹 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">인기 테마</h2>
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-full text-sm ${
                  popularActiveTag === tag
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-orange-100"
                }`}
                onClick={() => setPopularActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {isLoadingRanking ? (
              <ThemeSkeleton />
            ) : rankingThemes.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="relative">
                <Swiper
                  modules={[Autoplay, SwiperNavigation]}
                  spaceBetween={20}
                  slidesPerView={1}
                  centeredSlides={false}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  navigation
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView: 3,
                    },
                    1024: {
                      slidesPerView: 4,
                    },
                  }}
                  className="py-4"
                >
                  {rankingThemes.map((theme, index) => (
                    <SwiperSlide key={theme.id}>
                      <Link
                        href={`/themes/${theme.id}`}
                        className="relative block group h-full"
                      >
                        <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative">
                          {theme.thumbnailUrl ? (
                            <Image
                              src={theme.thumbnailUrl}
                              alt={theme.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <svg
                              width="64"
                              height="64"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FFB230"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="theme-image"
                            >
                              <path d="M14.5 3H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.5L14.5 3Z"></path>
                              <polyline points="14 3 14 9 20 9"></polyline>
                              <circle cx="10" cy="13" r="2"></circle>
                              <path d="m20 17-1.5-1.5a2 2 0 0 0-3 0L10 22"></path>
                            </svg>
                          )}

                          {/* 랭킹 뱃지 */}
                          <div className="absolute top-4 left-4">
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                              {index + 1}위
                            </span>
                          </div>

                          {/* 오버레이 정보 */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                            <h3 className="font-medium mb-1 text-lg">
                              {theme.name}
                            </h3>
                            <p className="text-sm">{theme.storeName}</p>
                            <div className="flex items-center mt-2 text-xs">
                              <span>{theme.playTime || "60분"}</span>
                              <span className="mx-2">•</span>
                              <span>{theme.recommendedPlayers || "2-4인"}</span>
                              <span className="mx-2">•</span>
                              <span>
                                {theme.genre ||
                                  popularActiveTag.replace("#", "")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* 인기 테마 더보기 버튼 */}
                <div className="flex justify-center mt-8">
                  <Link
                    href="/themes"
                    className="px-6 py-2 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    더보기
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 4: 신규 테마 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">최신 테마</h2>
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-full text-sm ${
                  newActiveTag === tag
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 hover:bg-blue-100"
                }`}
                onClick={() => setNewActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {isLoadingNew ? (
              <ThemeSkeleton />
            ) : newThemes.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="relative">
                <Swiper
                  modules={[Autoplay, SwiperNavigation]}
                  spaceBetween={20}
                  slidesPerView={1}
                  centeredSlides={false}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  navigation
                  breakpoints={{
                    640: {
                      slidesPerView: 2,
                    },
                    768: {
                      slidesPerView: 3,
                    },
                    1024: {
                      slidesPerView: 4,
                    },
                  }}
                  className="py-4"
                >
                  {newThemes.map((theme) => (
                    <SwiperSlide key={theme.id}>
                      <Link
                        href={`/themes/${theme.id}`}
                        className="relative block group h-full"
                      >
                        <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center relative">
                          {theme.thumbnailUrl ? (
                            <Image
                              src={theme.thumbnailUrl}
                              alt={theme.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <svg
                              width="64"
                              height="64"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#FFB230"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="theme-image"
                            >
                              <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="2"
                              ></rect>
                              <path d="M3 9h18"></path>
                              <path d="M9 21V9"></path>
                              <path d="m12 6 1.5-1.5"></path>
                              <path d="M12 6 10.5 4.5"></path>
                            </svg>
                          )}

                          {/* NEW 뱃지 */}
                          <div className="absolute top-4 left-4">
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                              NEW
                            </span>
                          </div>

                          {/* 오버레이 정보 */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                            <h3 className="font-medium mb-1 text-lg">
                              {theme.name}
                            </h3>
                            <p className="text-sm">{theme.storeName}</p>
                            <div className="flex items-center mt-2 text-xs">
                              <span>{theme.playTime || "60분"}</span>
                              <span className="mx-2">•</span>
                              <span>{theme.recommendedPlayers || "2-4인"}</span>
                              <span className="mx-2">•</span>
                              <span>
                                {theme.genre || newActiveTag.replace("#", "")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* 신규 테마 더보기 버튼 */}
                <div className="flex justify-center mt-8">
                  <Link
                    href="/themes"
                    className="px-6 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    더보기
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
