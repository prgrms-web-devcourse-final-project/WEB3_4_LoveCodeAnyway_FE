"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface PartySearchProps {
  showCreateButton?: boolean;
  onSearch?: (keyword: string) => void;
  onFilterApply?: (filters: any) => void;
}

export function PartySearch({
  showCreateButton = false,
  onSearch,
  onFilterApply,
}: PartySearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleFilterApply = (filters: any) => {
    if (onFilterApply) {
      onFilterApply(filters);
    }
    setIsFilterModalOpen(false);
  };

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center gap-3">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute left-4 top-[14px] pointer-events-none">
              <Image
                src="/placeholder_search.svg"
                alt="검색"
                width={16}
                height={16}
                className="text-gray-400"
              />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="모임명으로 검색"
              className="w-full pl-9 pr-4 py-2.5 border border-black rounded-lg focus:outline-none focus:border-black placeholder:text-gray-400"
            />
          </form>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 flex items-center gap-1.5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M13 13L18 18"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            검색필터
          </button>
          {showCreateButton && (
            <Link
              href="/parties/new"
              className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800"
            >
              모임 등록
            </Link>
          )}
        </div>
      </div>

      {/* 필터 모달 - 추후 구현 */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">검색 필터</h2>
            <div className="flex justify-end">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="px-4 py-2 text-gray-500"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  // Apply filter logic here
                  setIsFilterModalOpen(false);
                  if (onFilterApply) {
                    onFilterApply({});
                  }
                }}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
