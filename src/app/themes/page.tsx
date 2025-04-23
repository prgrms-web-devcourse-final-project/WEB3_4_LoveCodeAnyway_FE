"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ThemeCard } from "@/components/ThemeCard";
import { ThemeSearch } from "@/components/ThemeSearch";
import { EscapeRoom } from "@/types/EscapeRoom";
import { PageLoading } from "@/components/PageLoading";

export default function ThemesPage() {
  const [themes, setThemes] = useState<EscapeRoom[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    regionId: [] as number[],
    tagIds: [] as number[],
    participants: "",
  });
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const ITEMS_PER_PAGE = 12;

  const loadMoreThemes = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);
    try {
      if (reset) {
        setPage(0);
        setThemes([]);
        setHasMore(true);
      }

      const currentPage = reset ? 0 : page;

      const response = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : "https://api.ddobang.site"
        }/api/v1/themes?page=${currentPage}&size=${ITEMS_PER_PAGE}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            regionId: selectedFilters.regionId,
            tagIds: selectedFilters.tagIds,
            keyword: searchKeyword,
            participants: selectedFilters.participants
              ? parseInt(selectedFilters.participants.replace(/[^0-9]/g, ""))
              : undefined,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data && data.data) {
        const apiThemes = data.data.content || [];

        if (apiThemes.length === 0) {
          setHasMore(false);
        } else {
          // API 응답에서 받은 테마 데이터를 EscapeRoom 타입으로 변환
          const newThemes = apiThemes.map((theme: any) => ({
            id: theme.id?.toString(),
            title: theme.name || "",
            category: theme.storeName || "",
            date: "오늘",
            location: theme.storeName?.split(" ")[0] || "",
            participants: theme.recommendedParticipants || "2-4인",
            subInfo: theme.runtime ? `${theme.runtime}분` : "",
            tags: theme.tags || [],
            image: theme.thumbnailUrl || "/images/mystery-room.jpg",
            rating: "80",
          }));

          setThemes((prev) => {
            if (reset || currentPage === 0) return newThemes;

            // 중복 제거
            const uniqueThemes = [
              ...new Set([...prev, ...newThemes].map((theme) => theme.id)),
            ].map(
              (id) => [...prev, ...newThemes].find((theme) => theme.id === id)!
            );
            return uniqueThemes;
          });

          setPage((prev) => (reset ? 1 : prev + 1));
          setHasMore(data.data.hasNext || false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("테마 목록을 불러오는 중 오류가 발생했습니다:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    loadMoreThemes(true);
  };

  const handleFilterApply = (filters: any) => {
    setSelectedFilters({
      regionId: Array.isArray(filters.regions)
        ? filters.regions.map((region: string) => parseInt(region))
        : [],
      tagIds: filters.tagIds || [],
      participants: filters.participant || "",
    });
    loadMoreThemes(true);
  };

  useEffect(() => {
    loadMoreThemes();
  }, []);

  useEffect(() => {
    if (inView) {
      loadMoreThemes();
    }
  }, [inView]);

  // 스켈레톤 카드 렌더링 함수
  const renderSkeletonCards = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer h-[450px] flex flex-col"
        >
          {/* 이미지 섹션 */}
          <div className="relative h-[220px] bg-gray-200 animate-pulse"></div>

          {/* 내용 섹션 */}
          <div className="p-5 flex flex-col h-full">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="mt-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="mt-auto">
              <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">방탈출 테마</h1>
        </div>

        <ThemeSearch
          onSearch={handleSearch}
          onFilterApply={handleFilterApply}
        />

        {initialLoading ? (
          <PageLoading />
        ) : (
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {themes.map((theme) => (
                <ThemeCard key={theme.id} room={theme} />
              ))}
              {loading && !initialLoading && renderSkeletonCards()}
            </div>
            {themes.length === 0 && !loading && (
              <div className="text-center my-20">
                <p className="text-xl text-gray-500 mb-4">
                  표시할 테마가 없습니다.
                </p>
                <p className="text-gray-400">
                  다른 검색어나 필터로 시도해보세요.
                </p>
              </div>
            )}
          </div>
        )}

        {/* 무한 스크롤 감지용 요소 */}
        <div ref={ref} className="h-10 w-full" />
      </main>
    </div>
  );
}
