"use client";

import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { DiaryDetail } from "@/types/Diary";
import { useEffect, useState, use } from "react";
import axios from "axios";
import { Diary } from "@/types/Diary";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/common/Spinner";

// API 응답을 DiaryDetail 타입으로 변환하는 함수
const convertApiToDiaryDetail = (apiData: any): DiaryDetail => {
  return {
    id: apiData.id?.toString() || "",
    themeName: apiData.themeName || "",
    storeName: apiData.storeName || "",
    isSuccess: apiData.escapeResult || false,
    playDate: apiData.escapeDate || "",
    escapeTime: apiData.elapsedTime?.toString() || "",
    hintCount: apiData.hintCount || 0,
    themeImage: apiData.imageUrl || "",
    escapeImages: apiData.escapeImages || [],
    participants: apiData.participants || "",
    ratings: {
      interior: apiData.interior || 0,
      composition: apiData.question || 0,
      story: apiData.story || 0,
      production: apiData.production || 0,
      satisfaction: apiData.satisfaction || 0,
      deviceRatio: apiData.deviceRatio || 0,
      difficulty: apiData.difficulty || 0,
      horror: apiData.fear || 0,
      activity: apiData.activity || 0,
    },
    comment: apiData.review || "",
  };
};

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        setIsLoading(true);
        
        // API 호출 대신 가데이터 사용
        const mockDiaryData = {
          id: unwrappedParams.id,
          themeName: "미스터리 박스: 비밀의 방",
          storeName: "이스케이프 홍대점",
          escapeResult: true,
          escapeDate: "2024-04-15",
          elapsedTime: 3540, // 59분
          hintCount: 2,
          imageUrl: "https://www.roomlescape.com/file/theme_info/1723787821_10bd760472.gif",
          escapeImages: [
            "https://www.roomlescape.com/file/theme_info/1723787821_10bd760472.gif",
            "https://www.roomlescape.com/file/theme_info/1723787821_10bd760472.gif",
            "https://www.roomlescape.com/file/theme_info/1723787821_10bd760472.gif"
          ],
          participants: "홍길동, 김철수, 이영희",
          interior: 4,
          question: 5,
          story: 4,
          production: 5,
          satisfaction: 5,
          deviceRatio: 3,
          difficulty: 4,
          fear: 2,
          activity: 3,
          review: "정말 재미있는 탈출 게임이었습니다. 스토리도 탄탄하고 문제도 적당히 어려워서 좋았어요. 특히 마지막 문제는 정말 창의적이었습니다. 친구들과 함께 가서 더 재미있게 즐겼습니다. 다음에도 이 매장의 다른 테마에 도전해보고 싶네요!"
        };
        
        // 가데이터 DiaryDetail 타입으로 변환
        const diaryData = convertApiToDiaryDetail(mockDiaryData);
        
        // 시간 형식 변환 (초 -> 분:초)
        const minutes = Math.floor(mockDiaryData.elapsedTime / 60);
        const seconds = mockDiaryData.elapsedTime % 60;
        diaryData.escapeTime = `${minutes}분 ${seconds}초`;
        
        setDiary(diaryData);
        setError(null);
        
        // 로딩 시뮬레이션
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error details:", err);
        setError("탈출일지를 불러오는데 실패했습니다.");
        setIsLoading(false);
      }
    };

    fetchDiary();
  }, [unwrappedParams.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navigation activePage="my-diary" />
        <div className="max-w-3xl mx-auto px-4 py-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </main>
    );
  }

  if (error || !diary) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navigation activePage="my-diary" />
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || "탈출일지를 찾을 수 없습니다."}
          </div>
          <Link
            href="/my/diary"
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation activePage="my-diary" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 헤더 - 버튼 영역 */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href="/my/diary"
            className="text-[#FFB130] hover:text-[#F0A120] transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            목록으로
          </Link>
          <div className="flex gap-2">
            <Link
              href={`/my/diary/edit/${diary.id}`}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              수정하기
            </Link>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              삭제하기
            </button>
          </div>
        </div>
        
        {/* 테마 이미지 섹션 */}
        <div className="bg-white rounded-lg overflow-hidden mb-6 shadow-sm">
          <div className="aspect-[16/9] relative overflow-hidden">
            {diary.themeImage ? (
              <img
                src={diary.themeImage}
                alt={diary.themeName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* 다이어리 내용 */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          {/* 헤더 */}
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{diary.themeName}</h1>
              <p className="text-gray-500">{diary.storeName}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm ${
                diary.isSuccess
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              } rounded-full font-medium`}
            >
              {diary.isSuccess ? "성공" : "실패"}
            </span>
          </div>

          {/* 기본 정보 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">플레이 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">플레이 날짜</p>
                <p className="font-medium">{diary.playDate}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">탈출 시간</p>
                <p className="font-medium">{diary.escapeTime}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">힌트 사용</p>
                <p className="font-medium">{diary.hintCount}회</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">참여자</p>
                <p className="font-medium">{diary.participants}</p>
              </div>
            </div>
          </div>

          {/* 평가 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">평가</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">인테리어</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < diary.ratings.interior
                          ? "text-[#FFB130]"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">구성</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < diary.ratings.composition
                          ? "text-[#FFB130]"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">스토리</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < diary.ratings.story
                          ? "text-[#FFB130]"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">연출</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < diary.ratings.production
                          ? "text-[#FFB130]"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">만족도</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < diary.ratings.satisfaction
                          ? "text-[#FFB130]"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">장치 비율</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < diary.ratings.deviceRatio
                          ? "text-[#FFB130]"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">난이도</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < diary.ratings.difficulty
                          ? "text-[#FFB130]"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">공포도</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < diary.ratings.horror
                          ? "text-[#FFB130]"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-500 mb-1">활동성</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < diary.ratings.activity
                          ? "text-[#FFB130]"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 리뷰 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">리뷰</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{diary.comment}</p>
            </div>
          </div>

          {/* 이미지 */}
          {diary.escapeImages && diary.escapeImages.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">탈출 사진</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {diary.escapeImages.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={image} 
                      alt={`탈출 사진 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
