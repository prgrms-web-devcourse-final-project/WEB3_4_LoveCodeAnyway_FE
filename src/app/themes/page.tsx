"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Navigation } from "@/components/Navigation";
import { ThemeCard } from "@/components/ThemeCard";
import { ThemeSearch } from "@/components/ThemeSearch";
import { EscapeRoom } from "@/types/EscapeRoom";

// 더미 데이터 생성 함수
const generateThemes = (start: number, end: number): EscapeRoom[] => {
  const baseThemes = [
    {
      id: "1",
      title: "비밀의 방",
      category: "미스터리 룸 강남점",
      date: "오늘",
      location: "강남",
      participants: "2-4인",
      subInfo: "60분",
      tags: ["공포", "추리"],
      image: "/images/mystery-room.jpg",
      rating: "60",
    },
    {
      id: "2",
      title: "타임머신",
      category: "이스케이프 홍대점",
      date: "오늘",
      location: "홍대",
      participants: "3-6인",
      subInfo: "75분",
      tags: ["SF", "액션"],
      image: "/images/sf-room.jpg",
      rating: "75",
    },
    {
      id: "3",
      title: "탐정사무소",
      category: "방탈출 신촌점",
      date: "오늘",
      location: "신촌",
      participants: "2-5인",
      subInfo: "90분",
      tags: ["추리", "미스터리"],
      image: "/images/detective-room.jpg",
      rating: "90",
    },
    {
      id: "4",
      title: "저주받은 저택",
      category: "호러룸 건대점",
      date: "오늘",
      location: "건대",
      participants: "2-4인",
      subInfo: "70분",
      tags: ["공포", "어드벤처"],
      image: "/images/horror-room.jpg",
      rating: "70",
    },
    {
      id: "5",
      title: "이집트 피라미드",
      category: "이스케이프 강남점",
      date: "오늘",
      location: "강남",
      participants: "2-6인",
      subInfo: "65분",
      tags: ["어드벤처", "퍼즐"],
      image: "/images/mystery-room.jpg",
      rating: "85",
    },
    {
      id: "6",
      title: "외계인의 방문",
      category: "SF룸 홍대점",
      date: "오늘",
      location: "홍대",
      participants: "2-4인",
      subInfo: "70분",
      tags: ["SF", "미스터리"],
      image: "/images/sf-room.jpg",
      rating: "80",
    },
    {
      id: "7",
      title: "마법사의 성",
      category: "판타지룸 신촌점",
      date: "오늘",
      location: "신촌",
      participants: "3-5인",
      subInfo: "80분",
      tags: ["판타지", "퍼즐"],
      image: "/images/detective-room.jpg",
      rating: "95",
    },
    {
      id: "8",
      title: "잃어버린 보물",
      category: "어드벤처룸 건대점",
      date: "오늘",
      location: "건대",
      participants: "2-6인",
      subInfo: "75분",
      tags: ["어드벤처", "액션"],
      image: "/images/horror-room.jpg",
      rating: "88",
    },
    {
      id: "9",
      title: "연쇄 살인마의 집",
      category: "호러룸 강남점",
      date: "오늘",
      location: "강남",
      participants: "2-4인",
      subInfo: "60분",
      tags: ["공포", "추리"],
      image: "/images/mystery-room.jpg",
      rating: "92",
    },
    {
      id: "10",
      title: "시간의 문",
      category: "SF룸 홍대점",
      date: "오늘",
      location: "홍대",
      participants: "2-5인",
      subInfo: "70분",
      tags: ["SF", "퍼즐"],
      image: "/images/sf-room.jpg",
      rating: "87",
    },
    {
      id: "11",
      title: "비밀 연구소",
      category: "미스터리룸 신촌점",
      date: "오늘",
      location: "신촌",
      participants: "2-4인",
      subInfo: "65분",
      tags: ["미스터리", "SF"],
      image: "/images/detective-room.jpg",
      rating: "83",
    },
    {
      id: "12",
      title: "지하 감옥",
      category: "호러룸 건대점",
      date: "오늘",
      location: "건대",
      participants: "2-4인",
      subInfo: "70분",
      tags: ["공포", "미스터리"],
      image: "/images/horror-room.jpg",
      rating: "78",
    },
  ];

  // 기존 테마를 기반으로 새로운 테마 생성
  const extendedThemes = Array.from({ length: 100 }, (_, index) => {
    const baseTheme = baseThemes[index % baseThemes.length];
    const pageNumber = Math.floor(index / baseThemes.length) + 1;

    return {
      ...baseTheme,
      id: `theme_${index + 1}`,
      title: `${baseTheme.title} ${pageNumber > 1 ? pageNumber : ""}`,
      category: `${baseTheme.category} ${pageNumber > 1 ? pageNumber : ""}호점`,
      rating: `${Math.floor(Math.random() * 41 + 60)}`,
    };
  });

  return extendedThemes.slice(start, end);
};

export default function ThemesPage() {
  const [themes, setThemes] = useState<EscapeRoom[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const ITEMS_PER_PAGE = 12;

  const loadMoreThemes = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const newThemes = generateThemes(start, end);

    if (newThemes.length === 0) {
      setHasMore(false);
    } else {
      setThemes((prev) => {
        const uniqueThemes = [
          ...new Set([...prev, ...newThemes].map((theme) => theme.id)),
        ].map(
          (id) => [...prev, ...newThemes].find((theme) => theme.id === id)!
        );
        return uniqueThemes;
      });
      setPage((prev) => prev + 1);
    }

    setLoading(false);
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
        <ThemeSearch />

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
          {!hasMore && (
            <p className="text-gray-500">더 이상 표시할 테마가 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
}
