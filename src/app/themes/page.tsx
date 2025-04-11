"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Navigation } from "@/components/Navigation";
import { ThemeCard } from "@/components/ThemeCard";
import { ThemeSearch } from "@/components/ThemeSearch";
import { EscapeRoom } from "@/types/EscapeRoom";
import client from "@/lib/backend/client";

export default function ThemesPage() {
  const [themes, setThemes] = useState<EscapeRoom[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
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

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navigation activePage="themes" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <ThemeSearch
          onSearch={handleSearch}
          onFilterApply={handleFilterApply}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {themes.map((theme) => (
            <ThemeCard key={theme.id} room={theme} />
          ))}
        </div>

        {/* 로딩 인디케이터 */}
        <div ref={ref} className="flex justify-center py-8">
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          )}
          {!hasMore && themes.length > 0 && (
            <p className="text-gray-500">더 이상 표시할 테마가 없습니다.</p>
          )}
          {!hasMore && themes.length === 0 && (
            <p className="text-gray-500">표시할 테마가 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
}
