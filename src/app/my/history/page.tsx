"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 모임 타입 정의
type Meeting = {
  id: number;
  title: string;
  dateTime: string;
  location: string;
  participantsNeeded: number;
  totalParticipants: number;
  themeThumbnailUrl?: string;
  role: "HOST" | "MEMBER";
  reviewStatus: "WRITABLE" | "COMPLETED" | "NOT_AVAILABLE";
};

export default function HistoryPage() {
  // 상태 관리
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">(
    "all"
  );
  const [reviewFilter, setReviewFilter] = useState<
    "all" | "writable" | "completed"
  >("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "host" | "member">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모임 데이터 가져오기 (실제로는 API 요청)
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // API 요청을 시뮬레이션 (실제로는 fetch 사용)
    setTimeout(() => {
      // 목업 데이터
      const mockData: Meeting[] = [
        {
          id: 1,
          title: "좀비 연구소 모집합니다",
          dateTime: "2023-12-25T15:30:00",
          location: "이스케이프 홍대점",
          participantsNeeded: 5,
          totalParticipants: 6,
          themeThumbnailUrl: "/images/theme-1.jpg",
          role: "HOST" as const,
          reviewStatus: "WRITABLE" as const,
        },
        {
          id: 2,
          title: "심야 병동 같이 가실 분",
          dateTime: "2023-12-20T18:00:00",
          location: "플레이포인트 강남점",
          participantsNeeded: 4,
          totalParticipants: 4,
          themeThumbnailUrl: "/images/theme-2.jpg",
          role: "MEMBER" as const,
          reviewStatus: "COMPLETED" as const,
        },
        {
          id: 3,
          title: "타임루프 도전하실 분 모집해요",
          dateTime: "2024-01-15T17:00:00",
          location: "솔버 강남점",
          participantsNeeded: 3,
          totalParticipants: 6,
          themeThumbnailUrl: "/images/theme-3.jpg",
          role: "MEMBER" as const,
          reviewStatus: "NOT_AVAILABLE" as const,
        },
        {
          id: 4,
          title: "마술사의 집 모임 모집",
          dateTime: "2023-12-10T14:00:00",
          location: "키이스케이프 건대점",
          participantsNeeded: 4,
          totalParticipants: 4,
          themeThumbnailUrl: "/images/theme-4.jpg",
          role: "HOST" as const,
          reviewStatus: "COMPLETED" as const,
        },
        {
          id: 5,
          title: "자살 사건 추리 모임",
          dateTime: "2024-01-05T20:00:00",
          location: "비트포비아 홍대점",
          participantsNeeded: 4,
          totalParticipants: 6,
          themeThumbnailUrl: "/images/theme-5.jpg",
          role: "MEMBER" as const,
          reviewStatus: "NOT_AVAILABLE" as const,
        },
        {
          id: 6,
          title: "공포체험 좋아하시는 분",
          dateTime: "2023-11-20T21:00:00",
          location: "셜록홈즈 신촌점",
          participantsNeeded: 3,
          totalParticipants: 4,
          role: "HOST" as const,
          reviewStatus: "COMPLETED" as const,
        },
      ];

      // 필터링 적용
      let filteredData = [...mockData];

      // 탭 필터
      if (activeTab === "upcoming") {
        filteredData = filteredData.filter(
          (meeting) => new Date(meeting.dateTime) > new Date()
        );
      } else if (activeTab === "past") {
        filteredData = filteredData.filter(
          (meeting) => new Date(meeting.dateTime) <= new Date()
        );
      }

      // 리뷰 상태 필터
      if (reviewFilter !== "all") {
        const status = reviewFilter === "writable" ? "WRITABLE" : "COMPLETED";
        filteredData = filteredData.filter(
          (meeting) => meeting.reviewStatus === status
        );
      }

      // 역할 필터
      if (roleFilter !== "all") {
        const role = roleFilter === "host" ? "HOST" : "MEMBER";
        filteredData = filteredData.filter((meeting) => meeting.role === role);
      }

      setMeetings(filteredData);
      setTotalPages(Math.ceil(filteredData.length / 6));
      setIsLoading(false);
    }, 500);
  }, [activeTab, reviewFilter, roleFilter, currentPage]);

  // 필터 초기화
  const resetFilters = () => {
    setActiveTab("all");
    setReviewFilter("all");
    setRoleFilter("all");
    setCurrentPage(1);
  };

  // 날짜 포맷 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

    return `${year}.${month}.${day} (${dayOfWeek}) ${hours}:${minutes}`;
  };

  // 리뷰 버튼 표시 여부 및 스타일 결정 함수
  const getReviewButton = (meeting: Meeting) => {
    const now = new Date();
    const meetingDate = new Date(meeting.dateTime);

    if (meetingDate > now) {
      // 예정된 모임인 경우 버튼 없음
      return null;
    } else if (meeting.reviewStatus === "WRITABLE") {
      // 리뷰 작성 가능한 경우
      return (
        <Link
          href={`/my/review/write/${meeting.id}`}
          className="mt-3 bg-[#FFB230] text-white px-4 py-2 text-sm font-medium rounded-md block text-center"
        >
          모임 리뷰 작성
        </Link>
      );
    } else if (meeting.reviewStatus === "COMPLETED") {
      // 리뷰 작성 완료된 경우
      return (
        <div className="mt-3 bg-gray-200 text-gray-600 px-4 py-2 text-sm font-medium rounded-md block text-center">
          리뷰 작성 완료
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* 상단 - 타이틀 + 필터 영역 */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            나의 모임 히스토리
          </h1>
          <Link
            href="/party/create"
            className="bg-[#FFB230] text-white px-4 py-2 text-sm font-medium rounded-md"
          >
            모임 만들기
          </Link>
        </div>

        {/* 탭 필터 */}
        <div className="flex mb-4 border-b border-gray-200">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "all"
                ? "text-[#FFB230] border-b-2 border-[#FFB230]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            전체
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "upcoming"
                ? "text-[#FFB230] border-b-2 border-[#FFB230]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            예정된 모임
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "past"
                ? "text-[#FFB230] border-b-2 border-[#FFB230]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("past")}
          >
            지난 모임
          </button>
        </div>

        {/* 세부 필터 */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                리뷰 상태:
              </label>
              <select
                className="rounded-md border-gray-300 shadow-sm px-3 py-1.5 text-sm"
                value={reviewFilter}
                onChange={(e) => setReviewFilter(e.target.value as any)}
              >
                <option value="all">전체</option>
                <option value="writable">작성 가능</option>
                <option value="completed">작성 완료</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                내 역할:
              </label>
              <select
                className="rounded-md border-gray-300 shadow-sm px-3 py-1.5 text-sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
              >
                <option value="all">전체</option>
                <option value="host">모임장</option>
                <option value="member">모임원</option>
              </select>
            </div>
          </div>
          <button
            className="text-sm text-gray-600 hover:text-gray-900"
            onClick={resetFilters}
          >
            필터 초기화
          </button>
        </div>
      </div>

      {/* 중단 - 카드 리스트 영역 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <p>모임 정보를 불러오는 중...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>조건에 맞는 모임이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* 역할 뱃지 */}
              <div className="relative">
                <div
                  className={`absolute top-2 left-2 px-2 py-1 text-xs font-medium rounded
                    ${
                      meeting.role === "HOST"
                        ? "bg-[#FFB230] text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {meeting.role === "HOST" ? "모임장" : "모임원"}
                </div>

                {/* 썸네일 이미지 */}
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {meeting.themeThumbnailUrl ? (
                    <img
                      src={meeting.themeThumbnailUrl}
                      alt={meeting.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400">NO IMAGE</div>
                  )}
                </div>
              </div>

              {/* 모임 정보 */}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {meeting.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(meeting.dateTime)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  장소: {meeting.location}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  인원: {meeting.participantsNeeded} /{" "}
                  {meeting.totalParticipants}명
                </p>

                {/* 리뷰 버튼 */}
                {getReviewButton(meeting)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 하단 - 페이지네이션 영역 */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`mx-1 p-2 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              &lt; 이전
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-[#FFB230] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`mx-1 p-2 rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              다음 &gt;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
