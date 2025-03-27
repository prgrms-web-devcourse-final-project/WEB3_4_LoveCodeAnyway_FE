"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { MeetingCard } from "@/components/MeetingCard";
import { MeetingSearch } from "@/components/MeetingSearch";
import { Pagination } from "@/components/Pagination";
import { EscapeRoom } from "@/types/EscapeRoom";

export default function MeetingsPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState({
    region: "",
    date: "",
    members: "",
  });

  // 더미 데이터
  const meetingRooms: EscapeRoom[] = [
    {
      id: "1",
      title: "공포 테마 같이 도전하실 분!",
      category: "공포의 저택",
      date: "2024.03.15 19:00",
      location: "홍대입구역",
      participants: "2/4명",
      host: {
        name: "탐험마스터",
        image: "/images/host1.jpg",
      },
      image: "/images/horror-room.jpg",
      description:
        "어두운 분위기의 공포 테마를 함께 도전할 용감한 분들을 모집합니다. 스릴 넘치는 경험을 함께해요!",
    },
    {
      id: "2",
      title: "추리 테마 도전!",
      category: "셜록홈즈",
      date: "2024.03.16 15:00",
      location: "강남역",
      participants: "3/4명",
      host: {
        name: "추리왕",
        image: "/images/host2.jpg",
      },
      image: "/images/mystery-room.jpg",
      description:
        "추리력이 뛰어난 분들 모여주세요. 함께 난이도 높은 추리 테마를 클리어해봐요.",
    },
    {
      id: "3",
      title: "SF 테마 도전자 모집",
      category: "우주정거장",
      date: "2024.03.17 14:00",
      location: "신대방역",
      participants: "1/4명",
      host: {
        name: "우주인",
        image: "/images/host3.jpg",
      },
      image: "/images/sf-room.jpg",
      description:
        "우주를 배경으로 한 SF 테마에 도전할 분들을 찾습니다. 미래적인 퍼즐을 함께 풀어봐요!",
    },
    {
      id: "4",
      title: "SF 테마 도전자 모집",
      category: "우주정거장",
      date: "2024.03.17 14:00",
      location: "신대방역",
      participants: "1/4명",
      host: {
        name: "우주인",
        image: "/images/host3.jpg",
      },
      image: "/images/sf-room.jpg",
      description:
        "우주를 배경으로 한 SF 테마에 도전할 분들을 찾습니다. 미래적인 퍼즐을 함께 풀어봐요!",
    },
  ];

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCardClick = () => {
    alert("준비 중입니다.");
  };

  // 실제 앱에서는 검색어와 필터에 따라 필터링 로직 추가 필요
  const filteredRooms = meetingRooms.filter((room) => {
    // 검색어 필터링
    if (
      searchKeyword &&
      !room.title.toLowerCase().includes(searchKeyword.toLowerCase())
    ) {
      return false;
    }

    // 지역 필터링
    if (activeFilters.region && room.location !== activeFilters.region) {
      return false;
    }

    // 날짜 필터링 (간단한 예시)
    if (activeFilters.date && !room.date.includes(activeFilters.date)) {
      return false;
    }

    // 인원 필터링 (간단한 예시)
    if (
      activeFilters.members &&
      !room.participants.includes(activeFilters.members)
    ) {
      return false;
    }

    return true;
  });

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navigation activePage="meetings" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        <h1 className="text-2xl font-bold mb-6">모임 탐색</h1>

        <MeetingSearch
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <MeetingCard
              key={room.id}
              room={room}
              onClick={() => handleCardClick()}
            />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              검색 결과가 없습니다
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              다른 검색어나 필터를 사용해보세요.
            </p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={3}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
