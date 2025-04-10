import { useState } from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

interface DiarySearchProps {
  onSearch: (keyword: string) => void;
  onFilterChange: (filters: {
    region: string;
    genre: string;
    dateRange: string;
    isSuccess: string;
    noHint: boolean;
  }) => void;
  activeFilters: {
    region: string;
    genre: string;
    dateRange: string;
    isSuccess: string;
    noHint: boolean;
  };
}

export function DiarySearch({
  onSearch,
  onFilterChange,
  activeFilters,
}: DiarySearchProps) {
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchKeyword);
  };

  return (
    <div className="flex gap-3">
      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="테마명 또는 매장명으로 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </form>
      <button
        onClick={() => onFilterChange(activeFilters)}
        className="px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
      >
        <FunnelIcon className="h-5 w-5 text-gray-400" />
        <span>필터</span>
      </button>
    </div>
  );
}
