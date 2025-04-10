"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewDiaryPage() {
  const router = useRouter();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isNewThemeModalOpen, setIsNewThemeModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<{
    id: string;
    name: string;
    storeName: string;
  } | null>(null);
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState("");
  const [hintCount, setHintCount] = useState<number | null>(null);
  const [deviceRatio, setDeviceRatio] = useState(50);
  const [noDevice, setNoDevice] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [timeType, setTimeType] = useState<"진행 시간" | "잔여 시간">(
    "진행 시간"
  );
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");
  const [escapeImages, setEscapeImages] = useState<string[]>([]);
  const [newEscapeImage, setNewEscapeImage] = useState("");

  // 평가 항목 상태들
  const [ratings, setRatings] = useState({
    interior: 0,
    composition: 0,
    story: 0,
    production: 0,
    satisfaction: 0,
    difficulty: 0,
    horror: 0,
    activity: 0,
  });

  // 테마 검색 모달 열기
  const openThemeModal = () => {
    setIsThemeModalOpen(true);
  };

  // 새 테마 등록 모달 열기
  const openNewThemeModal = () => {
    setIsNewThemeModalOpen(true);
    setIsThemeModalOpen(false);
  };

  // 평가 항목 변경 핸들러
  const handleRatingChange = (
    category: keyof typeof ratings,
    value: number
  ) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // 이미지 URL 추가
  const addEscapeImage = () => {
    if (newEscapeImage.trim()) {
      setEscapeImages((prev) => [...prev, newEscapeImage]);
      setNewEscapeImage("");
    }
  };

  // 이미지 URL 삭제
  const removeEscapeImage = (index: number) => {
    setEscapeImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: API로 데이터 전송
    alert("탈출일지가 성공적으로 등록되었습니다.");
    router.push("/my/diary");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation activePage="my-diary" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-center">탈출일지 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 섹션 1: 테마 선택 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">테마 선택</h2>

            {selectedTheme ? (
              <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{selectedTheme.name}</p>
                  <p className="text-gray-500 text-sm">
                    {selectedTheme.storeName}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-sm text-blue-600"
                  onClick={() => setSelectedTheme(null)}
                >
                  변경
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="테마 또는 매장명으로 검색"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  readOnly
                  onClick={openThemeModal}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-black text-white rounded-lg"
                  onClick={openThemeModal}
                >
                  테마 검색
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg"
                  onClick={openNewThemeModal}
                >
                  새 테마 등록
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              * 테마 선택은 필수입니다.
            </p>
          </section>

          {/* 섹션 2: 탈출 사진 및 기본 정보 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">기본 정보</h2>

            <div className="space-y-4">
              {/* 탈출 사진 */}
              <div>
                <h3 className="text-md font-medium mb-2">탈출 사진</h3>
                <div className="border-dashed border-2 border-gray-300 p-6 rounded-lg text-center mb-4">
                  <div className="flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
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
                  <p className="text-sm text-gray-500 mb-2">
                    탈출 사진을 드래그하거나 클릭하여 업로드하세요
                  </p>
                </div>

                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newEscapeImage}
                    onChange={(e) => setNewEscapeImage(e.target.value)}
                    placeholder="이미지 URL 입력"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={addEscapeImage}
                    className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
                  >
                    추가
                  </button>
                </div>

                {escapeImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {escapeImages.map((url, index) => (
                      <div key={index} className="relative">
                        <div className="bg-gray-100 h-24 rounded-lg flex items-center justify-center overflow-hidden">
                          <span className="text-xs text-gray-500 break-all px-2">
                            {url}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEscapeImage(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 진행 날짜 */}
              <div>
                <h3 className="text-md font-medium mb-2">진행 날짜</h3>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 함께한 사람 */}
              <div>
                <h3 className="text-md font-medium mb-2">함께한 사람</h3>
                <input
                  type="text"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="예) 홍길동, 김철수, 이영희"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* 섹션 3: 테마 평가 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">테마 평가</h2>

            <div className="grid grid-cols-2 gap-6">
              {/* 인테리어 */}
              <div>
                <h3 className="text-md font-medium mb-2">인테리어</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange("interior", star)}
                      className={`w-6 h-6 ${
                        star <= ratings.interior
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* 문제 구성 */}
              <div>
                <h3 className="text-md font-medium mb-2">문제 구성</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange("composition", star)}
                      className={`w-6 h-6 ${
                        star <= ratings.composition
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* 스토리 */}
              <div>
                <h3 className="text-md font-medium mb-2">스토리</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange("story", star)}
                      className={`w-6 h-6 ${
                        star <= ratings.story
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* 연출 */}
              <div>
                <h3 className="text-md font-medium mb-2">연출</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange("production", star)}
                      className={`w-6 h-6 ${
                        star <= ratings.production
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* 만족도 */}
              <div>
                <h3 className="text-md font-medium mb-2">만족도</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange("satisfaction", star)}
                      className={`w-6 h-6 ${
                        star <= ratings.satisfaction
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* 장치 비중 */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-md font-medium">장치 비중</h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={noDevice}
                      onChange={(e) => setNoDevice(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">장치X</span>
                  </label>
                </div>
                <div className="mb-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={deviceRatio}
                    onChange={(e) => setDeviceRatio(parseInt(e.target.value))}
                    disabled={noDevice}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs">
                  <span>자물쇠</span>
                  <span>{deviceRatio}%</span>
                  <span>전자장치</span>
                </div>
              </div>

              {/* 난이도 */}
              <div>
                <h3 className="text-md font-medium mb-2">난이도</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange("difficulty", star)}
                      className={`w-6 h-6 ${
                        star <= ratings.difficulty
                          ? "text-blue-500"
                          : "text-gray-300"
                      }`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* 공포도 */}
              <div>
                <h3 className="text-md font-medium mb-2">공포도</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange("horror", star)}
                      className={`w-6 h-6 ${
                        star <= ratings.horror
                          ? "text-purple-500"
                          : "text-gray-300"
                      }`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* 활동성 */}
              <div>
                <h3 className="text-md font-medium mb-2">활동성</h3>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange("activity", star)}
                      className={`w-6 h-6 ${
                        star <= ratings.activity
                          ? "text-green-500"
                          : "text-gray-300"
                      }`}
                    >
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 4: 탈출 정보 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">탈출 정보</h2>

            <div className="grid grid-cols-2 gap-6">
              {/* 힌트 사용 횟수 */}
              <div>
                <h3 className="text-md font-medium mb-2">힌트 사용 횟수</h3>
                <input
                  type="number"
                  min="0"
                  value={hintCount === null ? "" : hintCount}
                  onChange={(e) =>
                    setHintCount(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  placeholder="횟수 입력"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* 탈출 여부 */}
              <div>
                <h3 className="text-md font-medium mb-2">탈출 여부</h3>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="escapeSuccess"
                      checked={isSuccess === true}
                      onChange={() => setIsSuccess(true)}
                      className="mr-2"
                    />
                    <span>성공</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="escapeSuccess"
                      checked={isSuccess === false}
                      onChange={() => setIsSuccess(false)}
                      className="mr-2"
                    />
                    <span>실패</span>
                  </label>
                </div>
              </div>

              {/* 시간 */}
              <div className="col-span-2">
                <h3 className="text-md font-medium mb-2">시간</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex mb-2">
                      <label className="flex items-center mr-4">
                        <input
                          type="radio"
                          name="timeType"
                          checked={timeType === "진행 시간"}
                          onChange={() => setTimeType("진행 시간")}
                          className="mr-2"
                        />
                        <span>진행 시간</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="timeType"
                          checked={timeType === "잔여 시간"}
                          onChange={() => setTimeType("잔여 시간")}
                          className="mr-2"
                        />
                        <span>잔여 시간</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="00:00"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 섹션 5: 소감 */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">소감</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="테마에 대한 소감을 자유롭게 작성해주세요."
              className="w-full h-40 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </section>

          {/* 등록 버튼 */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-8 py-3 bg-black text-white font-medium rounded-lg"
            >
              일지 등록
            </button>
          </div>
        </form>
      </div>

      {/* 테마 검색 모달 */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">테마 검색</h3>
              <button
                type="button"
                onClick={() => setIsThemeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="테마 또는 매장명으로 검색"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="max-h-80 overflow-y-auto mb-4">
              <div className="space-y-2">
                {/* 여기에 검색 결과가 표시됩니다 */}
                <div
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedTheme({
                      id: "1",
                      name: "미스터리 하우스",
                      storeName: "이스케이프 월드",
                    });
                    setIsThemeModalOpen(false);
                  }}
                >
                  <p className="font-medium">미스터리 하우스</p>
                  <p className="text-sm text-gray-500">이스케이프 월드</p>
                </div>
                <div
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedTheme({
                      id: "2",
                      name: "공포의 저택",
                      storeName: "호러 이스케이프",
                    });
                    setIsThemeModalOpen(false);
                  }}
                >
                  <p className="font-medium">공포의 저택</p>
                  <p className="text-sm text-gray-500">호러 이스케이프</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={openNewThemeModal}
                className="px-4 py-2 text-blue-600"
              >
                등록할 테마가 없나요?
              </button>
              <button
                type="button"
                onClick={() => setIsThemeModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 새 테마 등록 모달 */}
      {isNewThemeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">새 테마 등록</h3>
              <button
                type="button"
                onClick={() => setIsNewThemeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  테마명 *
                </label>
                <input
                  type="text"
                  placeholder="테마명을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  매장명 *
                </label>
                <input
                  type="text"
                  placeholder="매장명을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  테마 사진 URL
                </label>
                <input
                  type="text"
                  placeholder="테마 사진 URL을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">장르</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">장르 선택</option>
                  <option value="공포">공포</option>
                  <option value="추리">추리</option>
                  <option value="액션">액션</option>
                  <option value="판타지">판타지</option>
                  <option value="SF">SF</option>
                  <option value="기타">기타</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewThemeModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  // TODO: API로 새 테마 등록
                  setSelectedTheme({
                    id: "new-theme",
                    name: "새로운 테마",
                    storeName: "새로운 매장",
                  });
                  setIsNewThemeModalOpen(false);
                }}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
