"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { ThemeCard } from "@/components/ThemeCard";
import { ThemeSearch } from "@/components/ThemeSearch";
import { Pagination } from "@/components/Pagination";
import { EscapeRoom } from "@/types/EscapeRoom";

export default function ThemesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  // 더미 데이터
  const popularThemes: EscapeRoom[] = [
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
    },
    {
      id: "5",
      title: "비밀의 방",
      category: "미스터리 룸 강남점",
      date: "오늘",
      location: "강남",
      participants: "2-4인",
      subInfo: "60분",
      tags: ["공포", "추리"],
      image: "/images/mystery-room.jpg",
    },
    {
      id: "6",
      title: "타임머신",
      category: "이스케이프 홍대점",
      date: "오늘",
      location: "홍대",
      participants: "3-6인",
      subInfo: "75분",
      tags: ["SF", "액션"],
      image: "/images/sf-room.jpg",
    },
    {
      id: "7",
      title: "탐정사무소",
      category: "방탈출 신촌점",
      date: "오늘",
      location: "신촌",
      participants: "2-5인",
      subInfo: "90분",
      tags: ["추리", "미스터리"],
      image: "/images/detective-room.jpg",
    },
    {
      id: "8",
      title: "저주받은 저택",
      category: "호러룸 건대점",
      date: "오늘",
      location: "건대",
      participants: "2-4인",
      subInfo: "70분",
      tags: ["공포", "어드벤처"],
      image: "/images/horror-room.jpg",
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navigation activePage="themes" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        <h1 className="text-2xl font-bold mb-6">방탈출 테마</h1>

        <ThemeSearch />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularThemes.map((theme) => (
            <ThemeCard key={theme.id} room={theme} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={3}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
