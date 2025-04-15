"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

interface ThemeSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (theme: string, themeId: number) => void;
}

interface ThemeForPartyResponse {
  id?: number;
  name: string;
  storeId?: number;
  storeName?: string;
  themeTagMappingResponses?: {
    themeId?: number;
    themeTagId?: number;
    tagName?: string;
  }[];
}

interface SuccessResponseListThemeForPartyResponse {
  message?: string;
  data?: ThemeForPartyResponse[];
}

export function ThemeSearchModal({
  isOpen,
  onClose,
  onSelect,
}: ThemeSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [themes, setThemes] = useState<ThemeForPartyResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 기본 베이스 URL 설정
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://api.ddobang.site";

  useEffect(() => {
    if (!isOpen) return;

    // 모달이 열릴 때 테마 목록 초기화
    const fetchThemes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response =
          await axios.get<SuccessResponseListThemeForPartyResponse>(
            `${baseUrl}/api/v1/themes/search-for-party`,
            {
              params: {
                keyword: searchTerm,
              },
            }
          );

        if (response.data.data && response.data.data.length > 0) {
          // 중복된 ID가 있는지 확인하고 고유한 theme 목록만 설정
          const uniqueThemes = response.data.data.filter(
            (theme, index, self) =>
              index === self.findIndex((t) => t.id === theme.id)
          );
          setThemes(uniqueThemes);
        } else {
          setThemes([]);
        }
      } catch (err) {
        console.error("테마 검색 중 오류:", err);
        setError("테마 목록을 불러오는데 실패했습니다.");
        setThemes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, [isOpen, searchTerm, baseUrl]);

  // 테마 객체에서 ID를 추출하는 함수
  const getThemeId = (theme: any): number | undefined => {
    // 테마 ID를 조회하려는 가능한 필드 이름 목록
    const possibleIdFields = [
      "id",
      "themeId",
      "theme_id",
      "ID",
      "Id",
      "themeCode",
      "code",
    ];

    // 가능한 모든 필드 검사
    for (const field of possibleIdFields) {
      if (theme[field] !== undefined) {
        const id = Number(theme[field]);
        if (!isNaN(id) && id > 0) {
          return id;
        }
      }
    }

    return undefined;
  };

  const handleThemeSelect = (theme: ThemeForPartyResponse) => {
    // 테마 ID 추출
    const themeId = getThemeId(theme);

    // 테마 ID가 존재하고 유효한지 확인
    if (themeId === undefined) {
      setError("유효하지 않은 테마입니다. 다른 테마를 선택해주세요.");
      return;
    }

    // 테마 ID가 유효한 경우에만 선택 처리
    onSelect(theme.name, themeId);
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

        {loading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-black"></div>
          </div>
        )}

        {error && <div className="text-red-500 text-center my-4">{error}</div>}

        {!loading && themes.length === 0 && (
          <div className="text-gray-500 text-center my-4">
            검색 결과가 없습니다
          </div>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {themes.map((theme, index) => {
            const themeId = getThemeId(theme);
            const themeName = theme.name || "이름 없음";
            const storeInfo = theme.storeName || "";

            return (
              <button
                key={`theme-${index}`}
                onClick={() => handleThemeSelect(theme)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="font-medium">{themeName}</div>
                {storeInfo && (
                  <div className="text-sm text-gray-600">{storeInfo}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
