"use client";

import { useState } from "react";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

// 더미 데이터
const meetingData = {
  id: "1",
  title: "호러 테마 같이 도전하실 분!",
  date: "2024-04-10",
  time: "19:00",
  host: {
    id: "host1",
    nickname: "김도망",
    profileImage: "/profile_man.jpg",
  },
  isBeginnerFriendly: true,
  currentMembers: [
    { id: "1", nickname: "김도망", profileImage: "/profile_man.jpg" },
    { id: "2", nickname: "이탈출", profileImage: "/profile_man.jpg" },
    { id: "3", nickname: "박방탈", profileImage: "/profile_man.jpg" },
  ],
  totalMembers: 6,
  requests: [
    {
      id: "req1",
      user: { id: "4", nickname: "최모임", profileImage: "/profile_man.jpg" },
    },
    {
      id: "req2",
      user: { id: "5", nickname: "정참가", profileImage: "/profile_man.jpg" },
    },
  ],
  theme: {
    title: "비밀의 방",
    thumbnail: "/images/mystery-room.jpg",
    genres: ["호러", "추리"],
    noHintEscapeRate: 40,
    userEscapeRate: 65,
    playTime: 60,
  },
  store: {
    name: "미스터리 룸 강남점",
    address: "서울특별시 강남구 역삼동 123-45",
    latitude: 37.123456,
    longitude: 127.123456,
  },
};

export default function MeetingDetailPage() {
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [userRole, setUserRole] = useState<"none" | "member" | "host">("none");

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navigation activePage="meetings" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {/* 첫 번째 영역: 모임 기본 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{meetingData.title}</h1>
              <p className="text-gray-600">
                {meetingData.date} {meetingData.time}
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden relative mr-3">
                <Image
                  src={meetingData.host.profileImage}
                  alt={meetingData.host.nickname}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-gray-900">{meetingData.host.nickname}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">
                초심자
              </span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  meetingData.isBeginnerFriendly
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {meetingData.isBeginnerFriendly ? "가능" : "불가능"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">
                모집 현황
              </span>
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-2">
                  {meetingData.currentMembers.map((member) => (
                    <div
                      key={member.id}
                      className="w-8 h-8 rounded-full overflow-hidden relative border-2 border-white"
                    >
                      <Image
                        src={member.profileImage}
                        alt={member.nickname}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {meetingData.currentMembers.length}/{meetingData.totalMembers}
                  명
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 두 번째 영역: 참가 요청 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
          <button
            onClick={() => setIsRequestsOpen(!isRequestsOpen)}
            className="flex justify-between items-center w-full"
          >
            <h2 className="text-xl font-bold">참가 요청</h2>
            <svg
              className={`w-6 h-6 transform ${
                isRequestsOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isRequestsOpen && (
            <div className="mt-4 space-y-4">
              {meetingData.requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden relative mr-3">
                      <Image
                        src={request.user.profileImage}
                        alt={request.user.nickname}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-gray-900">
                      {request.user.nickname}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-[#FFB130] text-white rounded-lg hover:bg-[#FFB130]/90">
                    승인
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 세 번째 영역: 테마 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold mb-6">테마 정보</h2>
          <div className="flex gap-8">
            <div className="w-48 h-64 relative rounded-lg overflow-hidden">
              <Image
                src={meetingData.theme.thumbnail}
                alt={meetingData.theme.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-4">
                {meetingData.theme.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {meetingData.theme.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    #{genre}
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  노힌트 탈출률: {meetingData.theme.noHintEscapeRate}%
                </p>
                <p className="text-gray-600">
                  유저 탈출률: {meetingData.theme.userEscapeRate}%
                </p>
                <p className="text-gray-600">
                  플레이 시간: {meetingData.theme.playTime}분
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 네 번째 영역: 매장 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold mb-6">매장 정보</h2>
          <div className="mb-4">
            <div className="h-64 bg-gray-200 rounded-lg mb-4">
              {/* 네이버 지도 API 연동 예정 */}
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                지도 영역
              </div>
            </div>
            <h3 className="font-bold mb-2">{meetingData.store.name}</h3>
            <p className="text-gray-600">{meetingData.store.address}</p>
          </div>
        </div>

        {/* 다섯 번째 영역: 하단 버튼 */}
        <div className="flex justify-end gap-3">
          {userRole === "none" && (
            <button className="px-6 py-3 bg-[#FFB130] text-white rounded-lg hover:bg-[#FFB130]/90">
              참가 신청
            </button>
          )}
          {userRole === "member" && (
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              참가 취소
            </button>
          )}
          {userRole === "host" && (
            <>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                모임 취소
              </button>
              <Link
                href={`/meetings/${meetingData.id}/edit`}
                className="px-6 py-3 bg-[#FFB130] text-white rounded-lg hover:bg-[#FFB130]/90"
              >
                모임 정보 수정
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
