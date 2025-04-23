"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { XMarkIcon } from "@heroicons/react/24/outline";

// API 기본 URL
const API_BASE_URL = "http://localhost:8080";

// 테마 타입 정의
type Theme = {
  id: string;
  name: string;
  storeName: string;
};

// 평가 항목 타입 정의
type RatingCategory =
  | "interior"
  | "composition"
  | "story"
  | "production"
  | "satisfaction"
  | "difficulty"
  | "horror"
  | "activity";

// 메인 컴포넌트
export default function NewDiaryPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==================== 상태 관리 ====================

  // 테마 관련 상태
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isNewThemeModalOpen, setIsNewThemeModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);

  // 새 테마 등록 관련 상태
  const [newThemeName, setNewThemeName] = useState("");
  const [newThemeStoreName, setNewThemeStoreName] = useState("");
  const [newThemeAddress, setNewThemeAddress] = useState("");
  const [isCreatingTheme, setIsCreatingTheme] = useState(false);

  // 기본 정보 관련 상태
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState("");

  // 이미지 관련 상태
  const [escapeImages, setEscapeImages] = useState<string[]>([]);
  const [newEscapeImage, setNewEscapeImage] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // 평가 관련 상태
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

  // 장치 관련 상태
  const [deviceRatio, setDeviceRatio] = useState(50);
  const [noDevice, setNoDevice] = useState(false);

  // 탈출 정보 관련 상태
  const [hintCount, setHintCount] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [timeType, setTimeType] = useState<"진행 시간" | "잔여 시간">(
    "진행 시간"
  );
  const [time, setTime] = useState("");

  // 소감 관련 상태
  const [comment, setComment] = useState("");

  // ==================== API 호출 함수 ====================

  // 테마 검색 API 호출
  const searchThemes = async (keyword: string) => {
    if (!keyword.trim()) return;

    try {
      setIsLoadingThemes(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/themes/search?keyword=${encodeURIComponent(
          keyword
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      setThemes(
        response.data.data.map((theme: any) => ({
          id: theme.id.toString(),
          name: theme.name,
          storeName: theme.storeName,
        }))
      );
    } catch (error) {
      console.error("Error searching themes:", error);
      alert("테마 검색에 실패했습니다.");
    } finally {
      setIsLoadingThemes(false);
    }
  };

  // 새 테마 등록 API 호출
  const createNewTheme = async () => {
    if (!newThemeName.trim()) {
      alert("테마 이름을 입력해주세요.");
      return;
    }

    if (!newThemeStoreName.trim()) {
      alert("매장 이름을 입력해주세요.");
      return;
    }

    try {
      setIsCreatingTheme(true);
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/themes`,
        {
          name: newThemeName,
          storeName: newThemeStoreName,
          address: newThemeAddress,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const newTheme = response.data.data;
        setSelectedTheme({
          id: newTheme.id.toString(),
          name: newTheme.name,
          storeName: newTheme.storeName,
        });
        setIsNewThemeModalOpen(false);

        // 입력 필드 초기화
        setNewThemeName("");
        setNewThemeStoreName("");
        setNewThemeAddress("");

        alert("테마가 성공적으로 등록되었습니다.");
      }
    } catch (error) {
      console.error("Error creating theme:", error);
      alert("테마 등록에 실패했습니다.");
    } finally {
      setIsCreatingTheme(false);
    }
  };

  // 이미지 업로드 API 호출
  const uploadImages = async () => {
    if (uploadedFiles.length === 0) return [];

    try {
      setIsUploadingImage(true);
      const formData = new FormData();

      uploadedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/images/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        return response.data.data; // 업로드된 이미지 URL 배열 반환
      }
      return [];
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("이미지 업로드에 실패했습니다.");
      return [];
    } finally {
      setIsUploadingImage(false);
    }
  };

  // 탈출일지 등록 API 호출
  const submitDiary = async (imageUrls: string[]) => {
    try {
      const requestData = {
        themeId: parseInt(selectedTheme!.id),
        escapeDate: date,
        participants: participants,
        difficulty: ratings.difficulty,
        fear: ratings.horror,
        activity: ratings.activity,
        satisfaction: ratings.satisfaction,
        production: ratings.production,
        story: ratings.story,
        question: ratings.composition,
        interior: ratings.interior,
        deviceRatio: noDevice ? 0 : deviceRatio,
        hintCount: hintCount || 0,
        escapeResult: isSuccess,
        timeType: timeType === "진행 시간" ? "ELAPSED" : "REMAINING",
        elapsedTime: time,
        review: comment,
        escapeImages: imageUrls,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/diaries`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        alert("탈출일지가 성공적으로 등록되었습니다.");
        router.push("/my/diary");
      }
    } catch (error) {
      console.error("Error creating diary:", error);
      alert("탈출일지 등록에 실패했습니다. 다시 시도해주세요.");
      throw error;
    }
  };

  // ==================== 이벤트 핸들러 ====================

  // 테마 모달 관련 핸들러
  const openThemeModal = () => {
    setIsThemeModalOpen(true);
    setSearchKeyword("");
    setThemes([]);
  };

  const openNewThemeModal = () => {
    setIsNewThemeModalOpen(true);
    setIsThemeModalOpen(false);
  };

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setIsThemeModalOpen(false);
  };

  // 평가 항목 변경 핸들러
  const handleRatingChange = (category: RatingCategory, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // 이미지 관련 핸들러
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const addEscapeImage = () => {
    if (newEscapeImage.trim()) {
      setEscapeImages((prev) => [...prev, newEscapeImage]);
      setNewEscapeImage("");
    }
  };

  const removeEscapeImage = (index: number) => {
    setEscapeImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 입력값 검증
    if (!selectedTheme) {
      alert("테마를 선택해주세요.");
      return;
    }

    if (!date) {
      alert("진행 날짜를 입력해주세요.");
      return;
    }

    if (!time) {
      alert("시간을 입력해주세요.");
      return;
    }

    try {
      // 이미지 업로드 처리
      let uploadedImageUrls: string[] = [];
      if (uploadedFiles.length > 0) {
        uploadedImageUrls = await uploadImages();
      }

      // 모든 이미지 URL 합치기 (업로드된 것 + 수동 입력된 것)
      const allImageUrls = [...uploadedImageUrls, ...escapeImages];

      // 탈출일지 등록
      await submitDiary(allImageUrls);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  // ==================== 렌더링 ====================
  return (
    <main className="min-h-screen bg-gray-50">
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
                <div
                  className="border-dashed border-2 border-gray-300 p-6 rounded-lg text-center mb-4 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
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

                {/* 선택된 파일 목록 표시 */}
                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={`file-${index}`} className="relative">
                        <div className="bg-gray-100 h-24 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeUploadedFile(index)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

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
                      <div key={`url-${index}`} className="relative">
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
              {/* 평가 항목들 */}
              {[
                { id: "interior", label: "인테리어", color: "yellow" },
                { id: "composition", label: "문제 구성", color: "yellow" },
                { id: "story", label: "스토리", color: "yellow" },
                { id: "production", label: "연출", color: "yellow" },
                { id: "satisfaction", label: "만족도", color: "yellow" },
                { id: "difficulty", label: "난이도", color: "blue" },
                { id: "horror", label: "공포도", color: "purple" },
                { id: "activity", label: "활동성", color: "green" },
              ].map((item) => (
                <div key={item.id}>
                  <h3 className="text-md font-medium mb-2">{item.label}</h3>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          handleRatingChange(item.id as RatingCategory, star)
                        }
                        className={`w-6 h-6 ${
                          star <= ratings[item.id as RatingCategory]
                            ? `text-${item.color}-${
                                item.color === "yellow" ? "400" : "500"
                              }`
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
              ))}

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
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">테마 검색</h2>
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="테마 또는 매장명으로 검색"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => searchThemes(searchKeyword)}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  검색
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {isLoadingThemes ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                </div>
              ) : themes.length > 0 ? (
                <div className="space-y-2">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleThemeSelect(theme)}
                    >
                      <p className="font-medium">{theme.name}</p>
                      <p className="text-sm text-gray-500">{theme.storeName}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 새 테마 등록 모달 */}
      {isNewThemeModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">새 테마 등록</h2>
              <button
                onClick={() => setIsNewThemeModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  테마 이름
                </label>
                <input
                  type="text"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  매장 이름
                </label>
                <input
                  type="text"
                  value={newThemeStoreName}
                  onChange={(e) => setNewThemeStoreName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  매장 주소
                </label>
                <input
                  type="text"
                  value={newThemeAddress}
                  onChange={(e) => setNewThemeAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsNewThemeModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={createNewTheme}
                disabled={isCreatingTheme}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isCreatingTheme ? "등록 중..." : "등록"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
