"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { PageLoading } from "@/components/PageLoading";

// API 기본 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.NODE_ENV === "development"
  ? "http://localhost:8080"
  : "https://api.ddobang.site";

// 일지 타입 정의
interface Diary {
  id: number;
  themeId: number;
  themeName: string;
  storeName: string;
  thumbnailUrl?: string;
  escapeDate: string;
  escapeTime?: number; // 탈출 시간 (초)
  hintCount?: number; // 힌트 수
  escapeResult: boolean; // 성공 여부
  ratingAvg: number;
  isPartyDiary?: boolean; // 모임 기반 일지 여부
}

// 필터 타입 정의
interface DiaryFilter {
  keyword: string;
  region?: string[];
  genre?: string[];
  dateFrom?: string;
  dateTo?: string;
  escapeResult?: boolean | null; // true: 성공, false: 실패, null: 전체
  noHint?: boolean | null; // true: 노힌트, null: 전체
}

// 페이지네이션 타입 정의
interface PaginationInfo {
  totalPages: number;
  currentPage: number;
  totalElements: number;
}

export default function DiaryPage() {
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filter, setFilter] = useState<DiaryFilter>({ keyword: "" });
  const [appliedFiltersCount, setAppliedFiltersCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalPages: 1,
    currentPage: 1,
    totalElements: 0,
  });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filterModalRef = useRef<HTMLDivElement>(null);

  // 검색어 입력 지연 처리를 위한 타이머
  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  // 필터 모달 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterModalRef.current &&
        !filterModalRef.current.contains(event.target as Node)
      ) {
        setIsFilterModalOpen(false);
      }
    };

    if (isFilterModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterModalOpen]);

  // 초기 데이터 로딩
  useEffect(() => {
    fetchDiaries(1);
  }, []);

  // 검색어 변경 시 API 호출 (디바운스 적용)
  useEffect(() => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      const newFilter = { ...filter, keyword: searchKeyword };
      setFilter(newFilter);
      fetchDiaries(1, newFilter);
    }, 300);

    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, [searchKeyword]);

  // 필터에 적용된 조건 수 계산
  useEffect(() => {
    let count = 0;
    if (filter.region && filter.region.length > 0) count++;
    if (filter.genre && filter.genre.length > 0) count++;
    if (filter.dateFrom || filter.dateTo) count++;
    if (filter.escapeResult !== null) count++;
    if (filter.noHint !== null) count++;
    setAppliedFiltersCount(count);
  }, [filter]);

  // 일지 목록 조회
  const fetchDiaries = async (
    page: number,
    currentFilter: DiaryFilter = filter
  ) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/diaries/list`,
        {
          ...currentFilter,
          page: page - 1, // 백엔드는 0-indexed pagination
          size: 10,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      // API 응답 구조 확인
      if (response.data && response.data.data) {
        const { content, totalPages, number, totalElements } =
          response.data.data;

        setDiaries(content || []);
        setPagination({
          totalPages: totalPages || 1,
          currentPage: (number || 0) + 1, // 백엔드는 0-indexed, 프론트는 1-indexed
          totalElements: totalElements || 0,
        });
      } else {
        setDiaries([]);
        setPagination({
          totalPages: 1,
          currentPage: 1,
          totalElements: 0,
        });
      }
    } catch (error) {
      console.error("일지 목록을 불러오는 중 오류가 발생했습니다:", error);
      setDiaries([]);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // 필터 적용 핸들러
  const handleApplyFilter = (newFilter: Partial<DiaryFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    fetchDiaries(1, updatedFilter);
    setIsFilterModalOpen(false);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;

    fetchDiaries(newPage);

    // 스크롤을 상단으로 이동
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 시간 포맷 헬퍼 함수 (초 -> MM:SS)
  const formatTime = (seconds?: number): string => {
    if (!seconds) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // 날짜 포맷 헬퍼 함수 (YYYY.MM.DD 형식)
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ".")
      .replace(/\.$/, "");
  };

  // 페이지네이션 렌더링 함수
  const renderPagination = () => {
    const { totalPages, currentPage } = pagination;
    if (totalPages <= 1) return null;

    // 표시할 페이지 번호 계산 (최대 5개)
    let pageNumbers: number[] = [];

    if (totalPages <= 5) {
      // 5페이지 이하면 모든 페이지 표시
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // 5페이지 초과면 현재 페이지 중심으로 표시
      const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
      pageNumbers = Array.from({ length: 5 }, (_, i) => startPage + i);
    }

    return (
      <div className="flex justify-center mt-8">
        <div className="flex items-center gap-1">
          {/* 이전 버튼 */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "border border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            &lt;
          </button>

          {/* 페이지 번호 */}
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              disabled={pageNum === currentPage}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                pageNum === currentPage
                  ? "bg-[#FFB130] text-white"
                  : "border border-gray-300 hover:bg-gray-50 text-gray-700"
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* 다음 버튼 */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded-md ${
              currentPage === totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "border border-gray-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activePage="my-diary" />
      <main className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">나의 탈출일지</h1>
          <Link
            href="/diary/create"
            className="bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition"
          >
            일지 작성하기
          </Link>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            {/* 검색창 */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="테마명, 매장명으로 검색"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                ref={searchInputRef}
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB130] focus:border-[#FFB130]"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>

            {/* 필터 버튼 */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              필터
              {appliedFiltersCount > 0 && (
                <span className="bg-[#FFB130] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {appliedFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 전체 페이지 로딩 */}
        <PageLoading isLoading={initialLoading} />

        {!initialLoading && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
            {/* 중단 - 카드 리스트 영역 */}
            {loading && !initialLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FFB130]"></div>
              </div>
            ) : diaries.length === 0 ? (
              <div className="w-full my-12">
                <div className="bg-gray-50 border border-gray-300 rounded-xl py-24 px-8 text-center">
                  <p className="text-lg font-medium text-gray-400">
                    등록된 탈출일지가 없습니다
                  </p>
                  <Link
                    href="/my/diary/new"
                    className="mt-4 inline-block px-6 py-2 bg-[#FFB130] text-white rounded-lg hover:bg-[#F0A420]"
                  >
                    첫 탈출일지 작성하기
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {diaries.map((diary) => (
                    <div
                      key={diary.id}
                      onClick={() => router.push(`/my/diary/${diary.id}`)}
                      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer h-full flex flex-col hover:shadow-md transition"
                    >
                      {/* 썸네일 영역 */}
                      <div className="relative h-[220px] bg-gray-200">
                        {diary.thumbnailUrl ? (
                          <Image
                            src={diary.thumbnailUrl}
                            alt={diary.themeName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12"
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
                        {/* 성공/실패 배지 */}
                        <div className="absolute top-3 right-3">
                          <div
                            className={`${
                              diary.escapeResult
                                ? "bg-green-500"
                                : "bg-red-500"
                            } text-white text-xs font-bold px-2 py-1 rounded-full`}
                          >
                            {diary.escapeResult ? "성공" : "실패"}
                          </div>
                        </div>
                        {/* 모임/개인 구분 배지 */}
                        {diary.isPartyDiary && (
                          <div className="absolute top-3 left-3">
                            <div className="bg-[#FFB130] text-white text-xs font-bold px-2 py-1 rounded-full">
                              모임
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 컨텐츠 영역 */}
                      <div className="p-5 flex flex-col h-full">
                        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                          {diary.themeName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {diary.storeName}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {formatDate(diary.escapeDate)}
                          </div>
                          {diary.escapeTime && (
                            <div className="flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {formatTime(diary.escapeTime)}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-yellow-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-medium">
                              {diary.ratingAvg.toFixed(1)}
                            </span>
                          </div>
                          {diary.hintCount !== undefined && (
                            <span className="text-sm text-gray-500">
                              힌트 {diary.hintCount}개
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && !initialLoading && renderSkeletonCards()}
                </div>
                {diaries.length === 0 && !loading && (
                  <div className="w-full my-12">
                    <div className="bg-gray-50 border border-gray-300 rounded-xl py-24 px-8 text-center">
                      <p className="text-lg font-medium text-gray-400">
                        등록된 일지가 없습니다
                      </p>
                    </div>
                  </div>
                )}
                {renderPagination()}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
