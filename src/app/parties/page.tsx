"use client";

import { useState, useEffect, useContext } from "react";
import { Navigation } from "@/components/Navigation";
import { PartyCard } from "@/components/PartyCard";
import { ThemeSearch } from "@/components/ThemeSearch";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getParties } from "@/lib/api/party";
import { PageLoading } from "@/components/PageLoading";
import { LoginMemberContext } from "@/stores/auth/loginMember";

// API에서 받는 모임 데이터 타입
interface PartyMainResponse {
  themeId?: number;
  themeName?: string;
  themeThumbnailUrl?: string;
  storeId?: number;
  storeName?: string;
  id?: number;
  partyId?: number;
  title?: string;
  scheduledAt?: string;
  acceptedParticipantCount?: number;
  totalParticipants?: number;
}

// API에서 받는 응답 형태
interface SuccessResponseSliceDtoPartySummaryResponse {
  message?: string;
  data?: {
    content?: PartyMainResponse[];
    hasNext?: boolean;
  };
}

export default function PartiesPage() {
  const router = useRouter();
  const { isLogin } = useContext(LoginMemberContext);
  const [parties, setParties] = useState<PartyMainResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const ITEMS_PER_PAGE = 30; // 한 번에 많은 데이터 로드

  // 초기 데이터 로드
  useEffect(() => {
    loadParties();
  }, []);

  // 더미 데이터 생성 함수
  const generateDummyParties = () => {
    return Array(8).fill(0).map((_, index) => ({
      id: index + 1,
      partyId: index + 1,
      title: `방탈출 모임 ${index + 1}`,
      themeName: ["좀비 연구소", "비밀의 방", "사망 이스케이프", "유령의 저택"][index % 4],
      themeThumbnailUrl: "https://i.postimg.cc/PJNVr12v/theme.jpg",
      storeName: ["이스케이프 홍대점", "솔버 강남점", "마스터키 명동점", "키이스케이프 건대점"][index % 4],
      scheduledAt: new Date(Date.now() + (index % 3) * 2 * 24 * 60 * 60 * 1000).toISOString(),
      acceptedParticipantCount: Math.floor(Math.random() * 3) + 2,
      totalParticipants: 6
    }));
  };

  // 모임 데이터 로드 (무한 스크롤 대신 한 번에 데이터 로드)
  const loadParties = async (reset = false) => {
    if (loading) return;

    setLoading(true);
    try {
      if (reset) {
        setParties([]);
      }

      // API 요청 (regionIds 배열로 수정)
      const response = await getParties(
        {
          keyword: searchKeyword,
          regionIds: filterRegion ? [parseInt(filterRegion)] : undefined,
        },
        undefined,
        ITEMS_PER_PAGE
      );

      if (response) {
        let partyData: PartyMainResponse[] = [];

        // 데이터 타입에 따라 처리
        if (Array.isArray(response)) {
          partyData = response;
        } else if (response.data?.content && Array.isArray(response.data.content)) {
          partyData = response.data.content;
        }

        // API에서 데이터가 없는 경우 더미 데이터 사용
        if (partyData.length === 0) {
          partyData = generateDummyParties();
        }

        setParties(partyData);
        console.log("파티 데이터 로드 완료:", partyData);
      } else {
        // API 응답이 없는 경우 더미 데이터 사용
        const dummyData = generateDummyParties();
        setParties(dummyData);
        console.log("더미 데이터 사용:", dummyData);
      }
    } catch (error) {
      console.error("모임 데이터 로드 중 오류 발생:", error);
      // 오류 시 더미 데이터 사용
      const dummyData = generateDummyParties();
      setParties(dummyData);
      console.log("오류 발생, 더미 데이터 사용:", dummyData);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // 검색 처리
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    loadParties(true); // 검색어가 변경되면 데이터 리셋 후 다시 로드
  };

  // 필터 처리
  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "region") {
      setFilterRegion(value);
      loadParties(true); // 필터가 변경되면 데이터 리셋 후 다시 로드
    }
  };

  // 카드 클릭 처리
  const handleCardClick = (party: PartyMainResponse) => {
    console.log("이동할 모임:", party);
    if (party && (party.id || party.partyId)) {
      // id 또는 partyId 중 존재하는 값 사용
      const partyId = party.id || party.partyId;
      router.push(`/parties/${partyId}`);
    } else {
      console.error("모임의 ID가 없습니다", party);
    }
  };

  // 스켈레톤 카드 렌더링 함수
  const renderSkeletonCards = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer h-[450px] flex flex-col"
        >
          {/* 이미지 섹션 */}
          <div className="relative h-[220px] bg-gray-200 animate-pulse"></div>

          {/* 내용 섹션 */}
          <div className="p-5 flex flex-col h-full">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="mt-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="mt-auto">
              <div className="h-5 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      ));
  };

  const renderPartyCard = (party: PartyMainResponse) => {
    // PartyCard 컴포넌트에 필요한 데이터 구조로 변환
    const cardData = {
      id: (party.id || party.partyId)?.toString() || "",
      image: party.themeThumbnailUrl 
        ? party.themeThumbnailUrl 
        : "https://i.postimg.cc/PJNVr12v/theme.jpg",
      title: party.title || "제목 없음",
      category: "모임",
      date: party.scheduledAt
        ? new Date(party.scheduledAt).toLocaleDateString()
        : "날짜 정보 없음",
      location: party.storeName || "위치 정보 없음",
      participants: `${party.acceptedParticipantCount || 0}/${party.totalParticipants || 0}`,
      tags: party.themeName ? [party.themeName] : ["테마 정보 없음"],
      host: {
        name: "모임장",
        image: "/profile_man.jpg",
      },
    };

    return (
      <div 
        key={`party-${party.id || party.partyId}`} 
        onClick={() => handleCardClick(party)}
        className="cursor-pointer"
      >
        <PartyCard room={cardData} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">모임 목록</h1>
          {isLogin && (
            <Link
              href="/parties/create"
              className="bg-black text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition"
            >
              모임 만들기
            </Link>
          )}
        </div>

        {/* 검색 및 필터 섹션 */}
        <ThemeSearch
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        {initialLoading ? (
          <PageLoading />
        ) : (
          <div className="mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {parties.map((party) => renderPartyCard(party))}
              {loading && renderSkeletonCards()}
            </div>
            {parties.length === 0 && !loading && (
              <div className="w-full my-12">
                <div className="bg-gray-50 border border-gray-300 rounded-xl py-24 px-8 text-center">
                  <p className="text-lg font-medium text-gray-400">
                    등록된 모임이 없습니다
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
