"use client";

import { useState } from "react";
import Image from "next/image";

interface ThemeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (theme: string) => void;
}

export function ThemeSearchModal({
  isOpen,
  onClose,
  onSelect,
}: ThemeSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");

  // 더미 테마 데이터
  const themes = [
    { id: 1, name: "호러 테마" },
    { id: 2, name: "미스터리 테마" },
    { id: 3, name: "액션 테마" },
    { id: 4, name: "판타지 테마" },
  ];

  const filteredThemes = themes.filter((theme) =>
    theme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    onSelect(theme);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">테마 검색</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="relative mb-4">
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
            placeholder="테마명으로 검색"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
          />
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredThemes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => handleThemeSelect(theme.name)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
