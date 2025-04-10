"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Image from "next/image";
import { DiaryDetail } from "@/types/Diary";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

// 더미 데이터
const dummyDiaryDetail: DiaryDetail = {
  id: "1",
  themeName: "미스터리 하우스",
  storeName: "이스케이프 월드",
  themeImage: "/images/theme.jpg",
  escapeImages: ["/images/escape1.jpg", "/images/escape2.jpg"],
  isSuccess: true,
  playDate: "2024-01-15",
  escapeTime: "45:23",
  hintCount: 2,
  participants: "김철수, 이영희, 박지민",
  ratings: {
    interior: 4,
    composition: 4,
    story: 5,
    production: 4,
    satisfaction: 4,
    deviceRatio: 75,
    difficulty: 4,
    horror: 3,
    activity: 4,
  },
  comment:
    "정말 재미있는 방탈출이었습니다. 소품들도 분위기에 적절한 난이도로 구성되어 있어서 즐겁게 플레이했습니다. 특히 마지막 퍼즐은 팀원들과 협력이 잘 되어서 클리어할 수 있었습니다. 다음에도 이 매장의 다른 테마도 도전해보고 싶네요!",
};

export default function DiaryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const diary = dummyDiaryDetail; // 실제로는 API로 데이터를 가져와야 함

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "yyyy년 MM월 dd일", { locale: ko });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  const renderDonutChart = (value: number, maxValue: number, label: string) => {
    const percentage = (value / maxValue) * 100;
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-20">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#eee"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#FFB130"
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
            {value}/{maxValue}
          </div>
        </div>
        <span className="mt-2 text-sm text-gray-600">{label}</span>
      </div>
    );
  };

  return (
    <main className="bg-gray-50 min-h-screen pb-12">
      <Navigation activePage="my-escape" />

      {/* Section 1: 테마 정보 */}
      <div className="relative h-[400px] bg-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-48 h-48 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-6 py-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{diary.themeName}</h1>
            <p className="text-xl">{diary.storeName}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 space-y-12 mt-12">
        {/* Section 2: 탈출 사진 */}
        {diary.escapeImages && diary.escapeImages.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">탈출 사진</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {diary.escapeImages.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square cursor-pointer hover:opacity-90 bg-gray-100 flex items-center justify-center"
                  onClick={() => setSelectedImage(image)}
                >
                  <svg
                    className="w-16 h-16 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 3: 테마 평가 */}
        <section>
          <h2 className="text-2xl font-bold mb-6">테마 평가</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">인테리어</span>
                {renderStars(diary.ratings.interior)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">문제 구성</span>
                {renderStars(diary.ratings.composition)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">스토리</span>
                {renderStars(diary.ratings.story)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">연출</span>
                {renderStars(diary.ratings.production)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">만족도</span>
                {renderStars(diary.ratings.satisfaction)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">장치 비중</span>
                <div className="w-32 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-[#FFB130] h-2.5 rounded-full"
                    style={{ width: `${diary.ratings.deviceRatio}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between space-x-4">
              {renderDonutChart(diary.ratings.difficulty, 5, "난이도")}
              {renderDonutChart(diary.ratings.horror, 5, "공포도")}
              {renderDonutChart(diary.ratings.activity, 5, "활동성")}
            </div>
          </div>
        </section>

        {/* Section 4: 탈출 기록 */}
        <section className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">탈출 기록</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-lg text-gray-600 mb-2">진행 날짜</div>
              <div className="text-xl font-semibold">
                {formatDate(diary.playDate)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg text-gray-600 mb-2">탈출 결과</div>
              <div
                className={`text-xl font-semibold ${
                  diary.isSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {diary.isSuccess ? "탈출 성공" : "탈출 실패"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg text-gray-600 mb-2">탈출 시간</div>
              <div className="text-xl font-semibold">{diary.escapeTime}</div>
            </div>
            {diary.participants && (
              <div className="md:col-span-3">
                <div className="text-lg text-gray-600 mb-2">함께한 사람</div>
                <div className="text-xl">{diary.participants}</div>
              </div>
            )}
          </div>
        </section>

        {/* Section 5: 소감 */}
        {diary.comment && (
          <section>
            <h2 className="text-2xl font-bold mb-6">소감</h2>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <p className="text-gray-700 whitespace-pre-line">
                {diary.comment}
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-96 h-96 flex items-center justify-center">
            <svg
              className="w-48 h-48 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      )}
    </main>
  );
}
