"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Navigation } from "@/components/Navigation";
import { MeetingCard } from "@/components/MeetingCard";
import { MeetingSearch } from "@/components/MeetingSearch";
import { EscapeRoom } from "@/types/EscapeRoom";

// 더미 데이터 생성 함수
const generateMeetings = (start: number, end: number): EscapeRoom[] => {
  const baseMeetings = [
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
      title: "판타지 테마 같이 가실 분",
      category: "마법사의 성",
      date: "2024.03.18 16:00",
      location: "건대입구역",
      participants: "2/4명",
      host: {
        name: "마법사",
        image: "/images/host4.jpg",
      },
      image: "/images/mystery-room.jpg",
      description:
        "신비로운 판타지 테마에 도전하실 분들을 찾습니다. 마법과 환상의 세계로 함께 떠나요!",
    },
    {
      id: "5",
      title: "역사 테마 도전하실 분",
      category: "조선의 비밀",
      date: "2024.03.19 13:00",
      location: "종각역",
      participants: "3/6명",
      host: {
        name: "시간여행자",
        image: "/images/host1.jpg",
      },
      image: "/images/horror-room.jpg",
      description:
        "조선시대를 배경으로 한 역사 테마입니다. 함께 시간여행을 떠나보아요!",
    },
    {
      id: "6",
      title: "액션 테마 도전자 구합니다",
      category: "첩보 작전",
      date: "2024.03.20 20:00",
      location: "강남역",
      participants: "2/4명",
      host: {
        name: "액션킹",
        image: "/images/host2.jpg",
      },
      image: "/images/sf-room.jpg",
      description:
        "스피드한 액션 테마에 도전하실 분을 찾습니다. 긴장감 넘치는 미션을 함께 해결해요!",
    },
    {
      id: "7",
      title: "미스터리 테마 함께해요",
      category: "실종사건",
      date: "2024.03.21 17:00",
      location: "홍대입구역",
      participants: "1/4명",
      host: {
        name: "셜록",
        image: "/images/host3.jpg",
      },
      image: "/images/mystery-room.jpg",
      description:
        "복잡한 미스터리를 함께 풀어갈 분들을 찾습니다. 추리를 좋아하시는 분들 환영!",
    },
    {
      id: "8",
      title: "공포 테마 멤버 구해요",
      category: "병원 탈출",
      date: "2024.03.22 19:00",
      location: "신촌역",
      participants: "2/4명",
      host: {
        name: "공포매니아",
        image: "/images/host4.jpg",
      },
      image: "/images/horror-room.jpg",
      description:
        "무서운 걸 좋아하시는 분들 모여주세요! 함께 공포 테마를 정복해봐요.",
    },
    {
      id: "9",
      title: "초보자 환영! 쉬운 테마",
      category: "보물찾기",
      date: "2024.03.23 15:00",
      location: "잠실역",
      participants: "3/6명",
      host: {
        name: "방탈출초보",
        image: "/images/host1.jpg",
      },
      image: "/images/sf-room.jpg",
      description:
        "방탈출 처음이신 분들 환영합니다! 쉬운 난이도로 시작해보아요.",
    },
    {
      id: "10",
      title: "고인물들의 고난이도 도전",
      category: "천재의 방",
      date: "2024.03.24 18:00",
      location: "강남역",
      participants: "2/4명",
      host: {
        name: "탈출고수",
        image: "/images/host2.jpg",
      },
      image: "/images/mystery-room.jpg",
      description:
        "방탈출 경험이 많으신 분들 모여주세요! 최고 난이도에 도전합니다.",
    },
    {
      id: "11",
      title: "타임어택 도전하실 분",
      category: "시간도둑",
      date: "2024.03.25 14:00",
      location: "건대입구역",
      participants: "2/4명",
      host: {
        name: "스피드러너",
        image: "/images/host3.jpg",
      },
      image: "/images/horror-room.jpg",
      description:
        "빠른 탈출을 목표로 합니다! 시간 제한에 도전하실 분들을 찾습니다.",
    },
    {
      id: "12",
      title: "힐링 테마 여유롭게 즐겨요",
      category: "비밀정원",
      date: "2024.03.26 16:00",
      location: "홍대입구역",
      participants: "2/4명",
      host: {
        name: "느긋이",
        image: "/images/host4.jpg",
      },
      image: "/images/sf-room.jpg",
      description:
        "급할 것 없이 여유롭게 즐기실 분들 모집합니다. 함께 힐링해요!",
    },
    {
      id: "13",
      title: "추리 테마 도전자 모집",
      category: "명탐정의 방",
      date: "2024.03.27 19:00",
      location: "신촌역",
      participants: "2/4명",
      host: {
        name: "추리마스터",
        image: "/images/host1.jpg",
      },
      image: "/images/mystery-room.jpg",
      description: "추리력이 뛰어난 분들 모여주세요! 함께 미스터리를 풀어봐요.",
    },
    {
      id: "14",
      title: "공포 테마 같이 가실 분",
      category: "저주받은 저택",
      date: "2024.03.28 20:00",
      location: "강남역",
      participants: "3/4명",
      host: {
        name: "공포전문가",
        image: "/images/host2.jpg",
      },
      image: "/images/horror-room.jpg",
      description:
        "무서운 걸 좋아하시는 분들 모여주세요! 함께 공포 테마를 정복해봐요.",
    },
    {
      id: "15",
      title: "SF 테마 도전하실 분",
      category: "우주정거장",
      date: "2024.03.29 15:00",
      location: "건대입구역",
      participants: "2/4명",
      host: {
        name: "우주탐험가",
        image: "/images/host3.jpg",
      },
      image: "/images/sf-room.jpg",
      description:
        "우주를 배경으로 한 SF 테마에 도전할 분들을 찾습니다. 미래적인 퍼즐을 함께 풀어봐요!",
    },
    {
      id: "16",
      title: "판타지 테마 멤버 구합니다",
      category: "마법사의 성",
      date: "2024.03.30 14:00",
      location: "홍대입구역",
      participants: "2/4명",
      host: {
        name: "마법사",
        image: "/images/host4.jpg",
      },
      image: "/images/mystery-room.jpg",
      description:
        "신비로운 판타지 테마에 도전하실 분들을 찾습니다. 마법과 환상의 세계로 함께 떠나요!",
    },
  ];

  return baseMeetings.map((meeting, index) => ({
    ...meeting,
    id: (start + index + 1).toString(),
  }));
};

export default function MeetingsPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    region: "",
    date: "",
    members: "",
  });
  const [meetings, setMeetings] = useState<EscapeRoom[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const ITEMS_PER_PAGE = 8;

  const loadMoreMeetings = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const newMeetings = generateMeetings(start, end);

    if (newMeetings.length === 0) {
      setHasMore(false);
    } else {
      setMeetings((prev) => {
        const uniqueMeetings = [
          ...new Set([...prev, ...newMeetings].map((meeting) => meeting.id)),
        ].map(
          (id) =>
            [...prev, ...newMeetings].find((meeting) => meeting.id === id)!
        );
        return uniqueMeetings;
      });
      setPage((prev) => prev + 1);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMoreMeetings();
  }, []);

  useEffect(() => {
    if (inView) {
      loadMoreMeetings();
    }
  }, [inView]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setMeetings([]);
    setPage(1);
    setHasMore(true);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setMeetings([]);
    setPage(1);
    setHasMore(true);
  };

  const handleCardClick = () => {
    alert("준비 중입니다.");
  };

  // 실제 앱에서는 검색어와 필터에 따라 필터링 로직 추가 필요
  const filteredMeetings = meetings.filter((meeting) => {
    // 검색어 필터링
    if (
      searchKeyword &&
      !meeting.title.toLowerCase().includes(searchKeyword.toLowerCase())
    ) {
      return false;
    }

    // 지역 필터링
    if (activeFilters.region && meeting.location !== activeFilters.region) {
      return false;
    }

    // 날짜 필터링 (간단한 예시)
    if (activeFilters.date && !meeting.date.includes(activeFilters.date)) {
      return false;
    }

    // 인원 필터링 (간단한 예시)
    if (
      activeFilters.members &&
      !meeting.participants.includes(activeFilters.members)
    ) {
      return false;
    }

    return true;
  });

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navigation activePage="meetings" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <MeetingSearch
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMeetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              room={meeting}
              onClick={() => handleCardClick()}
            />
          ))}
        </div>

        {filteredMeetings.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">
              검색 결과가 없습니다
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              다른 검색어나 필터를 사용해보세요.
            </p>
          </div>
        )}

        {/* 로딩 인디케이터 */}
        <div ref={ref} className="flex justify-center py-8">
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          )}
          {!hasMore && (
            <p className="text-gray-500">더 이상 표시할 모임이 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
}
