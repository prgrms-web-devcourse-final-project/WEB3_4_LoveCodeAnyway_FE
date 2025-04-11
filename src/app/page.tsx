"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

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
  const [activeTag, setActiveTag] = useState("#전체");
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

  // 태그 선택 시 API 호출
  useEffect(() => {
    const selectedTag = activeTag === "#전체" ? "" : activeTag.substring(1); // '#' 제거
    fetchRankingThemes(selectedTag);
    fetchNewThemes(selectedTag);
  }, [activeTag]);

  // 랭킹 테마 가져오기
  const fetchRankingThemes = async (tag?: string) => {
    setIsLoadingRanking(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/themes/ranking`,
        {
          tagName: tag || "",
          limit: 3,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.data) {
        setRankingThemes(response.data.data);
      }
    } catch (error) {
      console.error("랭킹 테마 로딩 에러:", error);
      setRankingThemes([]);
    } finally {
      setIsLoadingRanking(false);
    }
  };

  // 신규 테마 가져오기
  const fetchNewThemes = async (tag?: string) => {
    setIsLoadingNew(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/themes/new`,
        {
          tagName: tag || "",
          limit: 3,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.data) {
        setNewThemes(response.data.data);
      }
    } catch (error) {
      console.error("신규 테마 로딩 에러:", error);
      setNewThemes([]);
    } finally {
      setIsLoadingNew(false);
    }
  };

  // 실시간 모집 파티 가져오기
  const fetchParties = async () => {
    setIsLoadingParties(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/parties/main`,
        {
          limit: 4,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data && response.data.data) {
        // 데이터 형식 확인 및 변환
        const partyData = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data.content || [];

        setParties(partyData);
      }
    } catch (error) {
      console.error("실시간 모집 로딩 에러:", error);
      setParties([]);
    } finally {
      setIsLoadingParties(false);
    }
  };

  // 로딩 인디케이터 컴포넌트
  const LoadingIndicator = () => (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );

  // 테마 없음 컴포넌트
  const EmptyState = () => (
    <div className="text-center py-12">
      <p className="text-gray-500">해당 태그의 테마가 없습니다.</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-white">
      {/* Section 1: 메인 배너 */}
      <section className="w-full h-[400px] relative bg-gray-800">
        <Navigation activePage="home" />
        <div className="max-w-7xl mx-auto h-full relative flex flex-col items-center justify-center">
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
          <p className="text-gray-300 mt-4 text-center max-w-2xl">
            방탈출 테마 정보부터 모임 참여까지
            <br />
            다양한 방탈출 커뮤니티를 경험해보세요
          </p>
        </div>
      </section>

      {/* Section 2: 소셜링 */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <h2 className="text-lg font-medium">실시간 모집</h2>
        </div>
        <h3 className="text-2xl font-bold text-center mb-8">
          함께 방탈출할 메이트를 찾고 계신가요?
          <br />
          또방과 함께 방탈출 크루를 만들어보세요
        </h3>

        {isLoadingParties ? (
          <LoadingIndicator />
        ) : parties.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">현재 모집 중인 파티가 없습니다.</p>
            <Link
              href="/parties/create"
              className="inline-block mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              모임 만들기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {parties.map((party) => (
              <Link
                key={party.id}
                href={`/parties/${party.id}`}
                className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-gray-600 text-sm">홍대입구역</div>
                    <div className="text-red-500 text-sm font-medium">D-1</div>
                  </div>

                  <div className="flex justify-center items-center h-32 bg-gray-100 rounded-lg mb-3">
                    {party.themeThumbnailUrl ? (
                      <Image
                        src={party.themeThumbnailUrl}
                        alt="모임 썸네일"
                        width={100}
                        height={100}
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

                  <h3 className="font-medium text-lg mb-1">{party.title}</h3>

                  <div className="flex items-center text-gray-600 text-sm">
                    <span>난이도 4.5</span>
                    <span className="mx-2">•</span>
                    <span>
                      {party.acceptedParticipantCount}/{party.totalParticipants}
                      명
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Section 3: 랭킹 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">RANKING</h2>
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeTag === tag
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {isLoadingRanking ? (
            <LoadingIndicator />
          ) : rankingThemes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rankingThemes.map((theme, index) => (
                <Link
                  href={`/themes/${theme.id}`}
                  key={theme.id}
                  className="relative group"
                >
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
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
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                      {index + 1}위
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium mb-1">{theme.name}</h3>
                    <p className="text-sm text-gray-600">{theme.storeName}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 4: 신규 테마 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">NEW THEMES</h2>
          <div className="flex justify-center gap-4 mb-8 flex-wrap">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeTag === tag
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {isLoadingNew ? (
            <LoadingIndicator />
          ) : newThemes.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newThemes.map((theme) => (
                <Link
                  href={`/themes/${theme.id}`}
                  key={theme.id}
                  className="relative group"
                >
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
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
                        <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                        <path d="M3 9h18"></path>
                        <path d="M9 21V9"></path>
                        <path d="m12 6 1.5-1.5"></path>
                        <path d="M12 6 10.5 4.5"></path>
                      </svg>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                      NEW
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium mb-1">{theme.name}</h3>
                    <p className="text-sm text-gray-600">{theme.storeName}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
