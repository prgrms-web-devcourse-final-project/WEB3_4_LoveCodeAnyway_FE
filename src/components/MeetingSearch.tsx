import { useState } from "react";

interface MeetingSearchProps {
  onSearch: (keyword: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
}

export function MeetingSearch({
  onSearch,
  onFilterChange,
}: MeetingSearchProps) {
  const [keyword, setKeyword] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="w-full mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            className="w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="모임명 또는 장소로 검색"
            value={keyword}
            onChange={handleSearch}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 flex items-center"
            onClick={() => onFilterChange("region", "")}
          >
            지역 선택
            <svg
              className="w-4 h-4 ml-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 flex items-center"
            onClick={() => onFilterChange("date", "")}
          >
            날짜 선택
            <svg
              className="w-4 h-4 ml-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
          <button
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 flex items-center"
            onClick={() => onFilterChange("members", "")}
          >
            인원 선택
            <svg
              className="w-4 h-4 ml-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
