"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 모임 타입 정의
type PartyType = {
  id: number;
  title: string;
  themeThumbnailUrl: string;
  themeTitle: string;
  role: "HOST" | "MEMBER";
  participantsNeeded: number;
  totalParticipants: number;
  dateTime: string;
  location: string;
  reviewStatus: "WRITABLE" | "COMPLETED" | "NOT_WRITABLE";
};

export default function HistoryPage() {
  const router = useRouter();
  // 상태 관리
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "WRITABLE" | "COMPLETED" | "NOT_WRITABLE"
  >("ALL");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "HOST" | "MEMBER">(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [parties, setParties] = useState<PartyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모임 데이터 가져오기 (실제로는 API 요청)
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // API 요청을 시뮬레이션 (실제로는 fetch 사용)
    setTimeout(() => {
      // 목업 데이터
      const mockData: PartyType[] = [
        {
          id: 1,
          title: "좀비 연구소 모집합니다",
          dateTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15일 후
          location: "이스케이프 홍대점",
          participantsNeeded: 5,
          totalParticipants: 6,
          themeThumbnailUrl: "https://i.postimages.org/PJNVr12v/theme.jpg",
          themeTitle: "좀비 연구소",
          role: "HOST" as const,
          reviewStatus: "WRITABLE" as const,
        },
        {
          id: 2,
          title: "심야 병동 같이 가실 분",
          dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
          location: "플레이포인트 강남점",
          participantsNeeded: 4,
          totalParticipants: 4,
          themeThumbnailUrl: "https://i.postimg.cc/305Ft0M3/theme.jpg",
          themeTitle: "심야 병동",
          role: "MEMBER" as const,
          reviewStatus: "COMPLETED" as const,
        },
        {
          id: 3,
          title: "타임루프 도전하실 분 모집해요",
          dateTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10일 후
          location: "솔버 강남점",
          participantsNeeded: 3,
          totalParticipants: 6,
          themeThumbnailUrl: "https://i.postimages.org/PJNVr12v/theme.jpg",
          themeTitle: "타임루프",
          role: "MEMBER" as const,
          reviewStatus: "NOT_WRITABLE" as const,
        },
        {
          id: 4,
          title: "마술사의 집 모임 모집",
          dateTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15일 전
          location: "키이스케이프 건대점",
          participantsNeeded: 4,
          totalParticipants: 4,
          themeThumbnailUrl: "https://i.postimg.cc/305Ft0M3/theme.jpg",
          themeTitle: "마술사의 집",
          role: "HOST" as const,
          reviewStatus: "COMPLETED" as const,
        },
        {
          id: 5,
          title: "자살 사건 추리 모임",
          dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 후
          location: "비트포비아 홍대점",
          participantsNeeded: 4,
          totalParticipants: 6,
          themeThumbnailUrl: "https://i.postimg.cc/305Ft0M3/theme.jpg",
          themeTitle: "자살 사건 추리",
          role: "MEMBER" as const,
          reviewStatus: "NOT_WRITABLE" as const,
        },
        {
          id: 6,
          title: "공포체험 좋아하시는 분",
          dateTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20일 전
          location: "셜록홈즈 신촌점",
          participantsNeeded: 3,
          totalParticipants: 4,
          themeThumbnailUrl: "https://i.postimg.cc/305Ft0M3/theme.jpg",
          themeTitle: "공포체험",
          role: "HOST" as const,
          reviewStatus: "COMPLETED" as const,
        },
        {
          id: 7,
          title: "미스터리 방 탈출 도전",
          dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 후
          location: "비밀의 방 강남점",
          participantsNeeded: 4,
          totalParticipants: 5,
          themeThumbnailUrl: "https://i.postimg.cc/305Ft0M3/theme.jpg",
          themeTitle: "비밀의 방",
          role: "HOST" as const,
          reviewStatus: "NOT_WRITABLE" as const,
        },
        {
          id: 8,
          title: "유령의 저택 공략 모임",
          dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 후
          location: "이스케이프 종로점",
          participantsNeeded: 5,
          totalParticipants: 6,
          themeThumbnailUrl: "https://i.postimg.cc/305Ft0M3/theme.jpg",
          themeTitle: "유령의 저택",
          role: "MEMBER" as const,
          reviewStatus: "WRITABLE" as const,
        },
        {
          id: 9,
          title: "초급자만! 쉬운 테마 함께해요",
          dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 후
          location: "마스터키 명동점",
          participantsNeeded: 3,
          totalParticipants: 4,
          themeThumbnailUrl: "https://i.postimg.cc/305Ft0M3/theme.jpg",
          themeTitle: "비밀 사무실",
          role: "MEMBER" as const,
          reviewStatus: "WRITABLE" as const,
        },
        {
          id: 10,
          title: "범죄자의 하우스 도전하실 분",
          dateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10일 전
          location: "룸이스케이프 신림점",
          participantsNeeded: 6,
          totalParticipants: 6,
          themeThumbnailUrl: "https://i.postimg.cc/305Ft0M3/theme.jpg",
          themeTitle: "범죄자의 하우스",
          role: "HOST" as const,
          reviewStatus: "COMPLETED" as const,
        },
        {
          id: 11,
          title: "초특급 난이도! 지하실 탈출",
          dateTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 전
          location: "키이스케이프 홍대점",
          participantsNeeded: 4,
          totalParticipants: 5,
          themeThumbnailUrl: "https://i.postimg.cc/305Ft0M3/theme.jpg",
          themeTitle: "지하실",
          role: "MEMBER" as const,
          reviewStatus: "NOT_WRITABLE" as const,
        },
        {
          id: 12,
          title: "마지막 기회, 사망 이스케이프",
          dateTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7일 전
          location: "넥스트에디션 강남점",
          participantsNeeded: 4,
          totalParticipants: 4,
          themeThumbnailUrl: "https://i.postimg.cc/305Ft0M3/theme.jpg",
          themeTitle: "사망 이스케이프",
          role: "HOST" as const,
          reviewStatus: "WRITABLE" as const,
        },
      ];

      // 필터링 적용
      let filteredData = [...mockData];

      // 탭 필터 - 날짜 비교 간소화
      const now = new Date();
      // 날짜 표시를 위해 시간 부분 제거
      now.setHours(0, 0, 0, 0);
      
      if (activeTab === "upcoming") {
        filteredData = filteredData.filter((party) => {
          const partyDate = new Date(party.dateTime);
          // 같은 날짜도 예정된 모임에 포함
          return partyDate >= now;
        });
      } else {
        filteredData = filteredData.filter((party) => {
          const partyDate = new Date(party.dateTime);
          return partyDate < now;
        });
      }

      // 리뷰 상태 필터
      if (statusFilter !== "ALL") {
        filteredData = filteredData.filter(
          (party) => party.reviewStatus === statusFilter
        );
      }

      // 역할 필터
      if (roleFilter !== "ALL") {
        filteredData = filteredData.filter(
          (party) => party.role === roleFilter
        );
      }

      // 전체 데이터 설정
      setTotalPages(Math.ceil(filteredData.length / 6));
      
      // 현재 페이지에 해당하는 데이터만 선택
      const startIndex = (currentPage - 1) * 6;
      const endIndex = startIndex + 6;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setParties(paginatedData);
      setIsLoading(false);
    }, 500);
  }, [activeTab, statusFilter, roleFilter, currentPage]);

  // 필터 초기화
  const resetFilters = () => {
    setActiveTab("upcoming");
    setStatusFilter("ALL");
    setRoleFilter("ALL");
    setCurrentPage(1);
  };

  // 날짜 포맷 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

    return `${year}.${month}.${day} (${dayOfWeek}) ${hours}:${minutes}`;
  };

  // 이미지 URL 처리 함수
  const getImageUrl = (url: string) => {
    // postimg.cc 또는 postimages.org 도메인을 사용하는 경우 그대로 반환
    if (url.includes("postimg.cc") || url.includes("postimages.org")) {
      return url;
    }
    
    // 내부 경로인 경우 그대로 반환
    if (url.startsWith("/")) {
      return url;
    }
    
    // 기본 이미지 URL 반환
    return "https://i.postimg.cc/PJNVr12v/theme.jpg";
  };

  // 리뷰 버튼 표시 여부 및 스타일 결정 함수
  const getReviewButton = (party: PartyType) => {
    const now = new Date();
    const partyDate = new Date(party.dateTime);

    if (partyDate > now) {
      // 예정된 모임인 경우 버튼 없음
      return null;
    } else if (party.reviewStatus === "WRITABLE") {
      // 리뷰 작성 가능한 경우
      return (
        <Link
          href={`/my/review/write/${party.id}`}
          className="px-3 py-1 bg-[#FFB130] text-white text-xs rounded hover:bg-[#FFA000] transition-colors"
        >
          리뷰 작성
        </Link>
      );
    } else if (party.reviewStatus === "COMPLETED") {
      // 리뷰 작성 완료된 경우
      return (
        <button className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded cursor-default">
          작성완료
        </button>
      );
    } else {
      // 리뷰 작성 불가능한 경우
      return (
        <button className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded cursor-default">
          작성불가
        </button>
      );
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navigation activePage="my" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 마감 임박 모임 섹션 추가 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">마감 임박 모임</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 마감 임박 모임 카드 */}
            {parties.slice(0, 3).map((party) => (
              <div
                key={`deadline-${party.id}`}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={getImageUrl(party.themeThumbnailUrl)}
                    alt={party.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                    priority
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white font-bold text-lg">{party.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-white text-sm">{party.themeTitle}</span>
                      <span className="bg-[#FFB130] text-white text-xs px-2 py-1 rounded-full">
                        D-{Math.floor((new Date(party.dateTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center text-gray-600 text-sm mb-2">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{party.location}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{new Date(party.dateTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      인원: {party.participantsNeeded} / {party.totalParticipants}명
                    </div>
                    <Link
                      href={`/parties/detail/${party.id}`}
                      className="px-3 py-1 bg-[#FFB130] text-white text-xs rounded hover:bg-[#FFA000] transition-colors"
                    >
                      참여하기
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 상단 - 타이틀 + 필터 영역 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              나의 모임 히스토리
            </h1>
            <Link
              href="/parties/create"
              className="bg-[#FFB230] text-white px-4 py-2 text-sm font-medium rounded-md"
            >
              모임 만들기
            </Link>
          </div>

          {/* 탭 필터 */}
          <div className="flex mb-4 border-b border-gray-200">
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "upcoming"
                  ? "text-[#FFB230] border-b-2 border-[#FFB230]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              예정된 모임
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === "past"
                  ? "text-[#FFB230] border-b-2 border-[#FFB230]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("past")}
            >
              지난 모임
            </button>
          </div>

          {/* 세부 필터 */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  리뷰 상태:
                </label>
                <select
                  className="rounded-md border-gray-300 shadow-sm px-3 py-1.5 text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="ALL">전체</option>
                  <option value="WRITABLE">작성 가능</option>
                  <option value="COMPLETED">작성 완료</option>
                  <option value="NOT_WRITABLE">작성 불가</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">
                  내 역할:
                </label>
                <select
                  className="rounded-md border-gray-300 shadow-sm px-3 py-1.5 text-sm"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                >
                  <option value="ALL">전체</option>
                  <option value="HOST">모임장</option>
                  <option value="MEMBER">모임원</option>
                </select>
              </div>
            </div>
            <button
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={resetFilters}
            >
              필터 초기화
            </button>
          </div>
        </div>

        {/* 중단 - 카드 리스트 영역 */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <p>모임 정보를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        ) : parties.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>조건에 맞는 모임이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {parties.map((party) => (
              <div
                key={party.id}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        party.role === "HOST"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {party.role === "HOST" ? "모임장" : "모임원"}
                    </span>
                  </div>
                  <div>{getReviewButton(party)}</div>
                </div>
                <div className="flex mt-3 gap-4">
                  {party.themeThumbnailUrl ? (
                    <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                      <Image
                        src={getImageUrl(party.themeThumbnailUrl)}
                        alt={party.title}
                        fill
                        sizes="(max-width: 96px) 100vw, 96px"
                        className="object-cover"
                        unoptimized
                        priority
                        loading="eager"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{party.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{formatDate(party.dateTime)}</p>
                      <p>테마: {party.themeTitle}</p>
                      <p>장소: {party.location}</p>
                      <p>
                        인원: {party.participantsNeeded} /{" "}
                        {party.totalParticipants}명
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 하단 - 페이지네이션 영역 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`mx-1 p-2 rounded ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                &lt; 이전
              </button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`mx-1 px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-[#FFB230] text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`mx-1 p-2 rounded ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                다음 &gt;
              </button>
            </nav>
          </div>
        )}
      </div>
    </main>
  );
}
