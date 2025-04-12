"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { useRouter } from "next/navigation";
import axios from "axios";

// API 기본 URL
const API_BASE_URL = "http://localhost:8080";

// 일지 타입 정의
type Diary = {
  id: number;
  themeId: number;
  themeName: string;
  storeName: string;
  escapeDate: string;
  escapeResult: boolean;
  ratingAvg: number;
};

export default function DiaryPage() {
  const router = useRouter();
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // 일지 목록 조회
  useEffect(() => {
    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/diaries/list`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: true,
          }
        );

        // API 응답 구조 확인 (배열 또는 페이지네이션 객체)
        let diaryData: Diary[] = [];
        if (Array.isArray(response.data.data)) {
          diaryData = response.data.data;
        } else if (
          response.data.data &&
          Array.isArray(response.data.data.content)
        ) {
          diaryData = response.data.data.content;
        }

        setDiaries(diaryData);
      } catch (error) {
        console.error("일지 목록을 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  // 일지 삭제 핸들러
  const handleDeleteDiary = async (id: number) => {
    if (!confirm("정말로 이 일지를 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/v1/diaries/${id}`, {
        withCredentials: true,
      });

      // 삭제 후 목록 업데이트
      setDiaries((prev) => prev.filter((diary) => diary.id !== id));
      alert("일지가 삭제되었습니다.");
    } catch (error) {
      console.error("일지 삭제에 실패했습니다.", error);
      alert("일지 삭제에 실패했습니다.");
    }
  };

  // 별점 렌더링 헬퍼 함수
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <span
        key={index}
        className={`text-lg ${
          index < Math.round(rating) ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  // 날짜 포맷 헬퍼 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // 스켈레톤 로딩 UI 렌더링 함수
  const renderSkeletonItems = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="bg-white rounded-lg p-6 shadow-sm mb-4"
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/4">
              <div className="h-40 md:h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="w-full md:w-3/4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation activePage="my-diary" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">내 탈출일지</h1>
          <Link
            href="/my/diary/new"
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            일지 작성
          </Link>
        </div>

        {initialLoading ? (
          <div>{renderSkeletonItems()}</div>
        ) : diaries.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <p className="text-gray-500 mb-4">
              아직 작성한 탈출일지가 없습니다.
            </p>
            <Link
              href="/my/diary/new"
              className="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              첫 탈출일지 작성하기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {diaries.map((diary) => (
              <div
                key={diary.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow transition cursor-pointer"
                onClick={() => router.push(`/my/diary/${diary.id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg">{diary.themeName}</h2>
                    <p className="text-gray-500 text-sm">{diary.storeName}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/my/diary/edit/${diary.id}`);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      수정
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteDiary(diary.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    {renderStars(diary.ratingAvg)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {formatDate(diary.escapeDate)}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        diary.escapeResult
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {diary.escapeResult ? "성공" : "실패"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 로딩 인디케이터 */}
        {loading && !initialLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </main>
  );
}
