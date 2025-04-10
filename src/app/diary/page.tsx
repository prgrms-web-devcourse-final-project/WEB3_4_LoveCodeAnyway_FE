"use client";

import { useState, useEffect } from "react";
import { DiarySearch } from "@/components/DiarySearch";
import { DiaryFilterModal } from "@/components/DiaryFilterModal";
import { useInView } from "react-intersection-observer";

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

export default function DiaryPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    success: boolean | null;
    dateRange: { start: string; end: string } | null;
  }>({
    success: null,
    dateRange: null,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [diaries, setDiaries] = useState<Diary[]>([]);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const baseDiaries: Diary[] = [
    {
      id: 1,
      title: "첫 번째 방탈출",
      date: "2024-03-15",
      success: true,
      theme: "공포",
      location: "서울 강남",
      participants: ["김철수", "이영희", "박지민"],
      content: "오늘 처음으로 방탈출을 했어요. 정말 재미있었고 성공했어요!",
    },
    {
      id: 2,
      title: "두 번째 도전",
      date: "2024-03-20",
      success: false,
      theme: "미스터리",
      location: "서울 홍대",
      participants: ["김철수", "이영희"],
      content: "이번에는 실패했지만 다음에는 꼭 성공할 거예요.",
    },
    {
      id: 3,
      title: "세 번째 도전",
      date: "2024-03-25",
      success: true,
      theme: "액션",
      location: "서울 신촌",
      participants: ["김철수", "이영희", "박지민", "최수진"],
      content: "이번에는 모두 함께 성공했어요! 정말 기분 좋았습니다.",
    },
    {
      id: 4,
      title: "네 번째 도전",
      date: "2024-03-28",
      success: true,
      theme: "판타지",
      location: "서울 건대",
      participants: ["김철수", "이영희", "박지민"],
      content: "판타지 테마는 정말 신기했어요. 다음에도 꼭 다시 해보고 싶어요!",
    },
    {
      id: 5,
      title: "다섯 번째 도전",
      date: "2024-04-01",
      success: false,
      theme: "스릴러",
      location: "서울 강서",
      participants: ["김철수", "이영희", "박지민", "최수진", "정다운"],
      content: "너무 무서워서 실패했어요. 하지만 재미있었어요!",
    },
    {
      id: 6,
      title: "여섯 번째 도전",
      date: "2024-04-05",
      success: true,
      theme: "추리",
      location: "서울 종로",
      participants: ["김철수", "이영희"],
      content:
        "추리 테마는 정말 머리를 많이 써야 했어요. 성공해서 기분 좋아요!",
    },
    {
      id: 7,
      title: "일곱 번째 도전",
      date: "2024-04-10",
      success: true,
      theme: "모험",
      location: "서울 송파",
      participants: ["김철수", "이영희", "박지민", "최수진"],
      content: "모험 테마는 정말 재미있었어요. 다음에도 꼭 다시 해보고 싶어요!",
    },
    {
      id: 8,
      title: "여덟 번째 도전",
      date: "2024-04-15",
      success: false,
      theme: "SF",
      location: "서울 마포",
      participants: ["김철수", "이영희", "박지민"],
      content:
        "SF 테마는 정말 신기했어요. 하지만 실패했어요. 다음에는 꼭 성공할 거예요!",
    },
    {
      id: 9,
      title: "아홉 번째 도전",
      date: "2024-04-20",
      success: true,
      theme: "로맨스",
      location: "서울 서초",
      participants: ["김철수", "이영희"],
      content: "로맨스 테마는 정말 달콤했어요. 성공해서 기분 좋아요!",
    },
    {
      id: 10,
      title: "열 번째 도전",
      date: "2024-04-25",
      success: true,
      theme: "코미디",
      location: "서울 용산",
      participants: ["김철수", "이영희", "박지민", "최수진", "정다운"],
      content: "코미디 테마는 정말 웃겼어요. 모두 함께 성공해서 기분 좋아요!",
    },
    {
      id: 11,
      title: "열한 번째 도전",
      date: "2024-04-30",
      success: false,
      theme: "호러",
      location: "서울 강북",
      participants: ["김철수", "이영희", "박지민"],
      content: "호러 테마는 정말 무서웠어요. 실패했지만 재미있었어요!",
    },
    {
      id: 12,
      title: "열두 번째 도전",
      date: "2024-05-05",
      success: true,
      theme: "액션",
      location: "서울 중구",
      participants: ["김철수", "이영희", "박지민", "최수진"],
      content: "액션 테마는 정말 재미있었어요. 성공해서 기분 좋아요!",
    },
    {
      id: 13,
      title: "열세 번째 도전",
      date: "2024-05-10",
      success: true,
      theme: "미스터리",
      location: "서울 동작",
      participants: ["김철수", "이영희"],
      content: "미스터리 테마는 정말 재미있었어요. 성공해서 기분 좋아요!",
    },
    {
      id: 14,
      title: "열네 번째 도전",
      date: "2024-05-15",
      success: false,
      theme: "판타지",
      location: "서울 서대문",
      participants: ["김철수", "이영희", "박지민", "최수진", "정다운"],
      content:
        "판타지 테마는 정말 신기했어요. 하지만 실패했어요. 다음에는 꼭 성공할 거예요!",
    },
    {
      id: 15,
      title: "열다섯 번째 도전",
      date: "2024-05-20",
      success: true,
      theme: "스릴러",
      location: "서울 노원",
      participants: ["김철수", "이영희", "박지민"],
      content: "스릴러 테마는 정말 재미있었어요. 성공해서 기분 좋아요!",
    },
    {
      id: 16,
      title: "열여섯 번째 도전",
      date: "2024-05-25",
      success: true,
      theme: "추리",
      location: "서울 광진",
      participants: ["김철수", "이영희", "박지민", "최수진"],
      content:
        "추리 테마는 정말 머리를 많이 써야 했어요. 성공해서 기분 좋아요!",
    },
    {
      id: 17,
      title: "열일곱 번째 도전",
      date: "2024-05-30",
      success: false,
      theme: "모험",
      location: "서울 성북",
      participants: ["김철수", "이영희"],
      content:
        "모험 테마는 정말 재미있었어요. 하지만 실패했어요. 다음에는 꼭 성공할 거예요!",
    },
    {
      id: 18,
      title: "열여덟 번째 도전",
      date: "2024-06-05",
      success: true,
      theme: "SF",
      location: "서울 강동",
      participants: ["김철수", "이영희", "박지민", "최수진", "정다운"],
      content: "SF 테마는 정말 신기했어요. 성공해서 기분 좋아요!",
    },
    {
      id: 19,
      title: "열아홉 번째 도전",
      date: "2024-06-10",
      success: true,
      theme: "로맨스",
      location: "서울 은평",
      participants: ["김철수", "이영희", "박지민"],
      content: "로맨스 테마는 정말 달콤했어요. 성공해서 기분 좋아요!",
    },
    {
      id: 20,
      title: "스무 번째 도전",
      date: "2024-06-15",
      success: false,
      theme: "코미디",
      location: "서울 도봉",
      participants: ["김철수", "이영희", "박지민", "최수진"],
      content:
        "코미디 테마는 정말 웃겼어요. 하지만 실패했어요. 다음에는 꼭 성공할 거예요!",
    },
  ];

  const loadMoreDiaries = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const itemsPerPage = 12;
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newDiaries = baseDiaries.slice(startIndex, endIndex);

      if (newDiaries.length === 0) {
        setHasMore(false);
      } else {
        setDiaries((prev) => [...prev, ...newDiaries]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error loading more diaries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (diaries.length === 0) {
      loadMoreDiaries();
    }
  }, [diaries.length]);

  if (inView && !loading) {
    loadMoreDiaries();
  }

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setDiaries([]);
    setPage(1);
    setHasMore(true);
    loadMoreDiaries();
  };

  const handleFilterApply = (filters: {
    success: boolean | null;
    dateRange: { start: string; end: string } | null;
  }) => {
    setActiveFilters(filters);
    setDiaries([]);
    setPage(1);
    setHasMore(true);
    loadMoreDiaries();
  };

  const filteredDiaries = diaries.filter((diary) => {
    const matchesSearch = diary.title
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
    const matchesSuccess =
      activeFilters.success === null || diary.success === activeFilters.success;
    const matchesDateRange =
      !activeFilters.dateRange ||
      (diary.date >= activeFilters.dateRange.start &&
        diary.date <= activeFilters.dateRange.end);

    return matchesSearch && matchesSuccess && matchesDateRange;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">다이어리</h1>

        <div className="mb-8">
          <DiarySearch
            onSearch={handleSearch}
            onFilterClick={() => setIsFilterOpen(true)}
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
