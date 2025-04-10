"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 임시 문의 데이터
const inquiries = [
  {
    id: 3,
    type: "사이트 이용 문의",
    title: "포인트 적립이 안되는 것 같아요",
    nickname: "USER1",
    createdAt: "2024-02-20",
    status: "답변완료",
  },
  {
    id: 2,
    type: "유지 보수",
    title: "부적절한 단어 게시글 신고",
    nickname: "USER1",
    createdAt: "2024-02-19",
    status: "처리중",
  },
  {
    id: 1,
    type: "테마등록요청",
    title: "홍대 연극 테마 요청",
    nickname: "USER1",
    createdAt: "2024-02-18",
    status: "처리중",
  },
];

export default function InquiryPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white">
      <Navigation activePage="my" />

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
              defaultValue="전체"
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
                className="pl-4 pr-10 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
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
          <div className="grid grid-cols-12 text-sm text-gray-600 border-y py-4 px-4">
            <div className="col-span-1 text-center">번호</div>
            <div className="col-span-2">분류</div>
            <div className="col-span-4">제목</div>
            <div className="col-span-2 text-center">작성자</div>
            <div className="col-span-2 text-center">작성일</div>
            <div className="col-span-1 text-center">상태</div>
          </div>

          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              onClick={() => router.push(`/my/inquiry/${inquiry.id}`)}
              className="grid grid-cols-12 text-sm border-b py-4 px-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="col-span-1 text-center">{inquiry.id}</div>
              <div className="col-span-2">{inquiry.type}</div>
              <div className="col-span-4">{inquiry.title}</div>
              <div className="col-span-2 text-center">{inquiry.nickname}</div>
              <div className="col-span-2 text-center">{inquiry.createdAt}</div>
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
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8 gap-1">
          <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50">
            &lt;
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`w-8 h-8 flex items-center justify-center rounded
                ${
                  page === 2 ? "bg-black text-white" : "border hover:bg-gray-50"
                }`}
            >
              {page}
            </button>
          ))}
          <button className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-50">
            &gt;
          </button>
        </div>
      </div>
    </main>
  );
}
