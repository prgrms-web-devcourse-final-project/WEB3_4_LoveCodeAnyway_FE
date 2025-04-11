"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

// API 응답 데이터 타입 정의
interface PartyMemberSummaries {
  id?: number;
  profilePictureUrl?: string;
  nickname?: string;
}

interface ThemeTagMapping {
  themeId?: number;
  themeTagId?: number;
}

interface PartyDetailResponse {
  id?: number;
  title?: string;
  scheduledAt?: string;
  content?: string;
  hostId?: number;
  hostNickname?: string;
  hostProfilePictureUrl?: string;
  recruitableCount?: number;
  totalParticipants?: number;
  acceptedPartyMembers?: PartyMemberSummaries[];
  AppliedPartyMembers?: PartyMemberSummaries[];
  rookieAvailable?: boolean;
  themeId?: number;
  themeName?: string;
  themeThumbnailUrl?: string;
  themeTagMappings?: ThemeTagMapping[];
  noHintEscapeRate?: number;
  escapeResult?: number;
  escapeTimeAvg?: number;
  storeName?: string;
  storeAddress?: string;
}

interface SuccessResponsePartyDetailResponse {
  message?: string;
  data?: PartyDetailResponse;
}

export default function PartyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [partyData, setPartyData] = useState<PartyDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [userRole, setUserRole] = useState<"none" | "member" | "host">("none");

  // 기본 베이스 URL 설정
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://api.ddobang.site";

  // 모임 ID 가져오기
  const partyId = params?.id;

  // 모임 상세 정보 가져오기
  useEffect(() => {
    const fetchPartyDetail = async () => {
      if (!partyId) return;

      setLoading(true);
      try {
        const response = await axios.get<SuccessResponsePartyDetailResponse>(
          `${baseUrl}/api/v1/parties/${partyId}`
        );

        if (response.data.data) {
          setPartyData(response.data.data);

          // 사용자 역할 설정 로직 (실제로는 로그인 사용자 정보와 비교해야 함)
          // 임시로 "none"으로 설정
          setUserRole("none");
        } else {
          setError("모임 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("모임 상세 정보 로드 중 오류:", err);
        setError("모임 정보를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPartyDetail();
  }, [partyId, baseUrl]);

  // 로딩 중 표시
  if (loading) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Navigation activePage="parties" />
        <div className="max-w-7xl mx-auto px-6 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </main>
    );
  }

  // 오류 표시
  if (error || !partyData) {
    return (
      <main className="bg-gray-50 min-h-screen">
        <Navigation activePage="parties" />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h1 className="text-xl font-bold text-red-500 mb-4">
              {error || "모임 정보를 찾을 수 없습니다."}
            </h1>
            <button
              onClick={() => router.push("/parties")}
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              모임 목록으로 돌아가기
            </button>
          </div>
        </div>
      </main>
    );
  }

  // scheduledAt을 날짜와 시간으로 분리
  const formattedDate = partyData.scheduledAt
    ? new Date(partyData.scheduledAt)
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, "-")
        .replace(/\.$/, "")
    : "";

  const formattedTime = partyData.scheduledAt
    ? new Date(partyData.scheduledAt).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navigation activePage="parties" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        {/* 첫 번째 영역: 모임 기본 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{partyData.title}</h1>
              <p className="text-gray-600">
                {formattedDate} {formattedTime}
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden relative mr-3 bg-gray-200">
                {partyData.hostProfilePictureUrl ? (
                  <Image
                    src={partyData.hostProfilePictureUrl}
                    alt={partyData.hostNickname || "모임장"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-400">🧑</span>
                  </div>
                )}
              </div>
              <span className="text-gray-900">
                {partyData.hostNickname || "모임장"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">
                초심자
              </span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  partyData.rookieAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {partyData.rookieAvailable ? "가능" : "불가능"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">
                모집 현황
              </span>
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-2">
                  {partyData.acceptedPartyMembers?.slice(0, 3).map((member) => (
                    <div
                      key={member.id}
                      className="w-8 h-8 rounded-full overflow-hidden relative border-2 border-white bg-gray-200"
                    >
                      {member.profilePictureUrl ? (
                        <Image
                          src={member.profilePictureUrl}
                          alt={member.nickname || "참가자"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <span className="text-gray-400 text-xs">🧑</span>
                        </div>
                      )}
                    </div>
                  ))}
                  {(partyData.acceptedPartyMembers?.length || 0) > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-700">
                      +{(partyData.acceptedPartyMembers?.length || 0) - 3}
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  {partyData.acceptedPartyMembers?.length || 0}/
                  {partyData.totalParticipants || 0}명
                </span>
              </div>
            </div>
          </div>

          {/* 모임 내용 */}
          {partyData.content && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-md font-semibold mb-2">모임 소개</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {partyData.content}
              </p>
            </div>
          )}
        </div>

        {/* 두 번째 영역: 참가 요청 - 모임장인 경우에만 표시 */}
        {userRole === "host" &&
          partyData.AppliedPartyMembers &&
          partyData.AppliedPartyMembers.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
              <button
                onClick={() => setIsRequestsOpen(!isRequestsOpen)}
                className="flex justify-between items-center w-full"
              >
                <h2 className="text-xl font-bold">
                  참가 요청 ({partyData.AppliedPartyMembers.length})
                </h2>
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
                  {partyData.AppliedPartyMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden relative mr-3 bg-gray-200">
                          {member.profilePictureUrl ? (
                            <Image
                              src={member.profilePictureUrl}
                              alt={member.nickname || "신청자"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <span className="text-gray-400">🧑</span>
                            </div>
                          )}
                        </div>
                        <span className="text-gray-900">
                          {member.nickname || "신청자"}
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
          )}

        {/* 세 번째 영역: 테마 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold mb-6">테마 정보</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-48 h-64 relative rounded-lg overflow-hidden bg-gray-200">
              {partyData.themeThumbnailUrl ? (
                <Image
                  src={partyData.themeThumbnailUrl}
                  alt={partyData.themeName || "테마 이미지"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400">🖼️ 이미지 없음</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-4">
                {partyData.themeName || "테마 정보 없음"}
              </h3>
              <div className="space-y-2 mt-4">
                {partyData.noHintEscapeRate !== undefined && (
                  <p className="text-gray-600">
                    노힌트 탈출률: {partyData.noHintEscapeRate}%
                  </p>
                )}
                {partyData.escapeResult !== undefined && (
                  <p className="text-gray-600">
                    유저 탈출률: {partyData.escapeResult}%
                  </p>
                )}
                {partyData.escapeTimeAvg !== undefined && (
                  <p className="text-gray-600">
                    평균 탈출 시간: {partyData.escapeTimeAvg}분
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 네 번째 영역: 매장 정보 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold mb-6">매장 정보</h2>
          <div className="mb-4">
            <div className="h-64 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              {partyData.storeAddress ? (
                <div className="text-center p-4">
                  <p className="text-gray-600 mb-2">
                    주소: {partyData.storeAddress}
                  </p>
                  <p className="text-gray-500 text-sm">지도 로딩 중...</p>
                </div>
              ) : (
                <p className="text-gray-500">매장 위치 정보가 없습니다</p>
              )}
            </div>
            <h3 className="font-bold mb-2">
              {partyData.storeName || "매장 정보 없음"}
            </h3>
            {partyData.storeAddress && (
              <p className="text-gray-600">{partyData.storeAddress}</p>
            )}
          </div>
        </div>

        {/* 다섯 번째 영역: 하단 버튼 */}
        <div className="flex justify-end gap-3">
          {userRole === "none" && (
            <button
              className="px-6 py-3 bg-[#FFB130] text-white rounded-lg hover:bg-[#FFB130]/90"
              onClick={() =>
                alert("참가 신청 기능은 아직 구현되지 않았습니다.")
              }
            >
              참가 신청
            </button>
          )}
          {userRole === "member" && (
            <button
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              onClick={() =>
                alert("참가 취소 기능은 아직 구현되지 않았습니다.")
              }
            >
              참가 취소
            </button>
          )}
          {userRole === "host" && (
            <>
              <button
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                onClick={() => alert("수정 기능은 아직 구현되지 않았습니다.")}
              >
                수정
              </button>
              <button
                className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                onClick={() => alert("삭제 기능은 아직 구현되지 않았습니다.")}
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
