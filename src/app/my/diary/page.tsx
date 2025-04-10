"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { DiaryCard } from "@/components/DiaryCard";
import { DiarySearch } from "@/components/DiarySearch";
import { Diary } from "@/types/Diary";
import { useRouter } from "next/navigation";

// 더미 데이터 생성 함수
const generateDiaries = (start: number, end: number): Diary[] => {
  const baseDiaries = [
    {
      id: "1",
      themeName: "공포의 저택",
      storeName: "이스케이프 홍대점",
      isSuccess: true,
      playDate: "2024.03.15 19:00",
      escapeTime: "45:30",
      hintCount: 2,
    },
    {
      id: "2",
      themeName: "셜록홈즈",
      storeName: "이스케이프 강남점",
      isSuccess: false,
      playDate: "2024.03.16 15:00",
      escapeTime: "60:00",
      hintCount: 5,
    },
    {
      id: "3",
      themeName: "우주정거장",
      storeName: "이스케이프 신대방점",
      isSuccess: true,
      playDate: "2024.03.17 14:00",
      escapeTime: "38:45",
      hintCount: 1,
    },
    {
      id: "4",
      themeName: "미스터리 하우스",
      storeName: "이스케이프 건대점",
      isSuccess: true,
      playDate: "2024.03.18 16:00",
      escapeTime: "42:15",
      hintCount: 3,
    },
    {
      id: "5",
      themeName: "좀비 아포칼립스",
      storeName: "이스케이프 신촌점",
      isSuccess: false,
      playDate: "2024.03.19 20:00",
      escapeTime: "55:20",
      hintCount: 4,
    },
    {
      id: "6",
      themeName: "마법사의 탑",
      storeName: "이스케이프 강서점",
      isSuccess: true,
      playDate: "2024.03.20 13:00",
      escapeTime: "39:45",
      hintCount: 2,
    },
    {
      id: "7",
      themeName: "추리 게임",
      storeName: "이스케이프 종로점",
      isSuccess: true,
      playDate: "2024.03.21 15:00",
      escapeTime: "41:30",
      hintCount: 1,
    },
    {
      id: "8",
      themeName: "호러 스토리",
      storeName: "이스케이프 마포점",
      isSuccess: false,
      playDate: "2024.03.22 19:00",
      escapeTime: "58:15",
      hintCount: 5,
    },
    {
      id: "9",
      themeName: "SF 어드벤처",
      storeName: "이스케이프 서초점",
      isSuccess: true,
      playDate: "2024.03.23 14:00",
      escapeTime: "43:20",
      hintCount: 2,
    },
    {
      id: "10",
      themeName: "미스터리 박물관",
      storeName: "이스케이프 용산점",
      isSuccess: true,
      playDate: "2024.03.24 16:00",
      escapeTime: "40:10",
      hintCount: 1,
    },
    {
      id: "11",
      themeName: "좀비 서바이벌",
      storeName: "이스케이프 강북점",
      isSuccess: false,
      playDate: "2024.03.25 20:00",
      escapeTime: "56:45",
      hintCount: 4,
    },
    {
      id: "12",
      themeName: "마법의 숲",
      storeName: "이스케이프 중구점",
      isSuccess: true,
      playDate: "2024.03.26 13:00",
      escapeTime: "38:20",
      hintCount: 2,
    },
  ];

  // start부터 end까지의 데이터를 반환
  return baseDiaries.slice(start, end);
};

export default function MyEscapePage() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    region: "",
    genre: "",
    dateRange: "",
    isSuccess: "",
    noHint: false,
  });
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 12;

  const loadDiaries = async (pageNum: number) => {
    setLoading(true);
    try {
      const startIndex = (pageNum - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newDiaries = generateDiaries(startIndex, endIndex);
      setDiaries(newDiaries);
      setPage(pageNum);
      setHasMore(newDiaries.length === itemsPerPage);
    } catch (error) {
      console.error("Error loading diaries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiaries(1);
  }, []);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    loadDiaries(1);
  };

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    loadDiaries(1);
  };

  const handlePageChange = (newPage: number) => {
    loadDiaries(newPage);
  };

  const handleCreateDiary = () => {
    router.push("/diary/new");
  };

  // 실제 앱에서는 검색어와 필터에 따라 필터링 로직 추가 필요
  const filteredDiaries = diaries.filter((diary) => {
    // 검색어 필터링
    if (
      searchKeyword &&
      !diary.themeName.toLowerCase().includes(searchKeyword.toLowerCase()) &&
      !diary.storeName.toLowerCase().includes(searchKeyword.toLowerCase())
    ) {
      return false;
    }

    // 성공 여부 필터링
    if (
      activeFilters.isSuccess &&
      diary.isSuccess.toString() !== activeFilters.isSuccess
    ) {
      return false;
    }

    // 힌트 사용 여부 필터링
    if (activeFilters.noHint && diary.hintCount > 0) {
      return false;
    }

    return true;
  });

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navigation activePage="my-escape" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">나의 탈출일지</h1>
          <button
            onClick={handleCreateDiary}
            className="px-4 py-2 bg-[#FFB130] text-white rounded-lg hover:bg-[#FFB130]/90"
          >
            일지 작성
          </button>
        </div>

        <DiarySearch
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
        />

        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDiaries.map((diary) => (
              <DiaryCard key={diary.id} diary={diary} />
            ))}
          </div>

          {filteredDiaries.length === 0 && !loading && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">
                일치하는 탈출일지가 없습니다
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                다른 검색어나 필터를 사용해보세요.
              </p>
            </div>
          )}

          {/* 로딩 인디케이터 */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          )}

          {/* 페이지네이션 */}
          {!loading && filteredDiaries.length > 0 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePageChange(num)}
                    className={`px-3 py-1 rounded-md ${
                      page === num
                        ? "bg-[#FFB130] text-white"
                        : "border border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!hasMore}
                  className="px-3 py-1 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
