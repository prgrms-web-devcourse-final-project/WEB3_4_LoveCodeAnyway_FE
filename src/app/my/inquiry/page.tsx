"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.NODE_ENV === "development"
  ? "http://localhost:8080"
  : "https://api.ddobang.site";

// 타입 정의
type Inquiry = {
  id: number;
  type: string;
  title: string;
  nickname: string;
  createdAt: string;
  status: string;
};

export default function InquiryPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inquiryType, setInquiryType] = useState("전체");
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // 문의 목록 조회
  const fetchInquiries = async () => {
    try {
      setIsLoading(true);

      // API 호출 코드 주석 처리
      /*
      const response = await axios.get(`${API_BASE_URL}/api/v1/boards`, {
        params: {
          page: currentPage,
          type: inquiryType === "전체" ? undefined : inquiryType,
          keyword: searchKeyword || undefined,
        },
        withCredentials: true,
      });

      setInquiries(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
      */

      // 가데이터로 대체
      const mockInquiries: Inquiry[] = [
        {
          id: 1,
          type: "사이트 이용 문의",
          title: "회원가입 관련 문의드립니다",
          nickname: "사용자1",
          createdAt: "2023-06-15",
          status: "답변완료",
        },
        {
          id: 2,
          type: "유지 보수",
          title: "페이지 로딩이 느려요",
          nickname: "사용자2",
          createdAt: "2023-06-14",
          status: "대기중",
        },
        {
          id: 3,
          type: "테마등록요청",
          title: "새로운 테마 등록 요청드립니다",
          nickname: "사용자3",
          createdAt: "2023-06-12",
          status: "답변완료",
        },
        {
          id: 4,
          type: "사이트 이용 문의",
          title: "비밀번호 변경 방법이 궁금합니다",
          nickname: "사용자4",
          createdAt: "2023-06-10",
          status: "대기중",
        },
        {
          id: 5,
          type: "유지 보수",
          title: "모바일에서 접속 시 오류가 발생합니다",
          nickname: "사용자5",
          createdAt: "2023-06-08",
          status: "답변완료",
        },
      ];

      // 검색 및 필터링 적용
      let filteredInquiries = mockInquiries;

      // 문의 유형 필터링
      if (inquiryType !== "전체") {
        filteredInquiries = filteredInquiries.filter(
          (inquiry) => inquiry.type === inquiryType
        );
      }

      // 검색어 필터링
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        filteredInquiries = filteredInquiries.filter(
          (inquiry) =>
            inquiry.title.toLowerCase().includes(keyword) ||
            inquiry.nickname.toLowerCase().includes(keyword)
        );
      }

      setInquiries(filteredInquiries);
      setTotalPages(Math.ceil(filteredInquiries.length / 5)); // 페이지당 5개 항목 기준
    } catch (error) {
      console.error("문의 목록 로딩 에러:", error);
      setError("문의 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 조건이나 페이지가 변경될 때 목록 다시 조회
  useEffect(() => {
    fetchInquiries();
  }, [currentPage, inquiryType, searchKeyword]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">1:1 문의</h1>
          <p className="text-gray-600">
            문의사항을 남겨주세요. 최대한 빠르게 답변드리도록 하겠습니다.
          </p>
        </div>

        {/* 검색 및 문의하기 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <select
              className="px-4 py-2 border rounded-lg mr-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
            >
              <option>전체</option>
              <option>사이트 이용 문의</option>
              <option>유지 보수</option>
              <option>테마등록요청</option>
            </select>
            <div className="relative">
              <input
                type="text"
                placeholder="검색어를 입력하세요"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setCurrentPage(1);
                    fetchInquiries();
                  }
                }}
                className="pl-4 pr-10 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <button
                onClick={() => {
                  setCurrentPage(1);
                  fetchInquiries();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <Link
            href="/my/inquiry/new"
            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 flex items-center"
          >
            새 문의하기
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        </div>

        {/* 문의 목록 */}
        <div className="w-full">
          <div className="grid bg-black grid-cols-12 text-sm text-white border-y py-4 px-4">
            <div className="col-span-1 text-center">번호</div>
            <div className="col-span-2">분류</div>
            <div className="col-span-4">제목</div>
            <div className="col-span-2 text-center">작성자</div>
            <div className="col-span-2 text-center">작성일</div>
            <div className="col-span-1 text-center">상태</div>
          </div>

          {inquiries.length > 0 ? (
            inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => router.push(`/my/inquiry/${inquiry.id}`)}
                className="grid grid-cols-12 text-sm border-b py-4 px-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="col-span-1 text-center">{inquiry.id}</div>
                <div className="col-span-2">{inquiry.type}</div>
                <div className="col-span-4">{inquiry.title}</div>
                <div className="col-span-2 text-center">{inquiry.nickname}</div>
                <div className="col-span-2 text-center">
                  {inquiry.createdAt}
                </div>
                <div className="col-span-1 text-center">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs
                      ${
                        inquiry.status === "답변완료"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {inquiry.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              문의 내역이 없습니다.
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded
                  ${
                    page === currentPage
                      ? "bg-black text-white"
                      : "border hover:bg-gray-50"
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
