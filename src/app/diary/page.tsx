"use client";

import { useState, useEffect } from "react";
import { DiarySearch } from "@/components/DiarySearch";
import { DiaryFilterModal } from "@/components/DiaryFilterModal";
import { useInView } from "react-intersection-observer";
import axios from "axios";

// 기본 다이어리 인터페이스
interface Diary {
  id: number;
  title: string;
  date: string;
  success: boolean;
  theme: string;
  location: string;
  participants: string[];
  content: string;
}

// API 응답 타입 정의
interface DiaryApiResponse {
  id: number;
  title: string;
  playDate: string;
  isSuccess: boolean;
  themeName: string;
  storeName: string;
  participants: string[];
  content: string;
}

// 페이지네이션 응답 타입
interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// API 응답 전체 타입
interface ApiResponse {
  message?: string;
  data?: PageResponse<DiaryApiResponse>;
}

export default function DiaryPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({
    success: null,
    dateRange: null,
  });
  const [page, setPage] = useState(0); // API는 0부터 시작하는 페이지 인덱스 사용
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [diaries, setDiaries] = useState<Diary[]>([]);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  // 기본 베이스 URL 설정
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://api.ddobang.site";

  // API 응답을 Diary 형식으로 변환하는 함수
  const convertApiToDiary = (apiDiary: DiaryApiResponse): Diary => {
    return {
      id: apiDiary.id,
      title: apiDiary.title,
      date: apiDiary.playDate,
      success: apiDiary.isSuccess,
      theme: apiDiary.themeName,
      location: apiDiary.storeName,
      participants: apiDiary.participants || [],
      content: apiDiary.content || "",
    };
  };

  const loadMoreDiaries = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      // API 요청 파라미터
      const requestData = {
        page: page,
        size: 12,
        keyword: searchKeyword || undefined,
        isSuccess:
          activeFilters.success !== null ? activeFilters.success : undefined,
        startDate: activeFilters.dateRange?.start || undefined,
        endDate: activeFilters.dateRange?.end || undefined,
      };

      // API 호출
      const response = await axios.post<ApiResponse>(
        `${baseUrl}/api/v1/diaries/list`,
        requestData
      );

      // 응답 데이터 확인
      console.log("API 응답:", response.data);

      // 데이터가 있는지 확인
      if (response.data.data) {
        const apiDiaries = response.data.data.content || [];

        // 응답이 비어있으면 더 이상 데이터가 없음
        if (apiDiaries.length === 0) {
          setHasMore(false);
        } else {
          // API 응답을 UI 형식으로 변환
          const newDiaries = apiDiaries.map(convertApiToDiary);

          // 기존 데이터에 추가
          setDiaries((prev) => [...prev, ...newDiaries]);

          // 다음 페이지 설정
          setPage((prev) => prev + 1);

          // 마지막 페이지인지 확인
          setHasMore(!response.data.data.last);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading diaries:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (diaries.length === 0 && hasMore) {
      loadMoreDiaries();
    }
  }, [diaries.length]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMoreDiaries();
    }
  }, [inView]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setDiaries([]);
    setPage(0);
    setHasMore(true);
    // 검색 시 즉시 데이터 로드
    setTimeout(loadMoreDiaries, 0);
  };

  const handleFilterApply = (filters: any) => {
    setActiveFilters(filters);
    setIsFilterOpen(false);
    setDiaries([]);
    setPage(0);
    setHasMore(true);
    // 필터 적용 시 즉시 데이터 로드
    setTimeout(loadMoreDiaries, 0);
  };

  const filteredDiaries = diaries;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">다이어리</h1>

        <div className="mb-8">
          <DiarySearch
            onSearch={handleSearch}
            onFilterClick={() => setIsFilterOpen(true)}
            {...({} as any)}
          />
        </div>

        <div className="space-y-4">
          {filteredDiaries.map((diary) => (
            <div
              key={diary.id}
              className="bg-white rounded-lg shadow-sm p-5 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-bold">{diary.title}</h2>
                  <p className="text-sm text-gray-500">{diary.date}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs ${
                    diary.success
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {diary.success ? "성공" : "실패"}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-gray-600 text-sm">{diary.content}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs text-gray-500">
                <span>{diary.theme}</span>
                <span>•</span>
                <span>{diary.location}</span>
                <span>•</span>
                <span>{diary.participants.join(", ")}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          )}

          {!hasMore && filteredDiaries.length > 0 && (
            <div className="text-center py-4 text-sm text-gray-500">
              더 이상의 다이어리가 없습니다.
            </div>
          )}

          {filteredDiaries.length === 0 && !loading && (
            <div className="text-center py-8 text-sm text-gray-500">
              검색 결과가 없습니다.
            </div>
          )}

          <div ref={ref} className="h-8" />
        </div>
      </div>

      <DiaryFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
}
