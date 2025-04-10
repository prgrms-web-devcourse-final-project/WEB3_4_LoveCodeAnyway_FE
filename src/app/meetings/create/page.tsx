"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { ThemeSearchModal } from "@/components/ThemeSearchModal";

export default function CreateMeetingPage() {
  const [formData, setFormData] = useState({
    title: "",
    theme: "",
    date: "",
    time: "",
    requiredMembers: "",
    totalMembers: "",
    isBeginnerFriendly: false,
    description: "",
  });

  const [isThemeSearchModalOpen, setIsThemeSearchModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 모임 등록 로직 구현
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleThemeSelect = (theme: string) => {
    setFormData((prev) => ({
      ...prev,
      theme,
    }));
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <Navigation activePage="meetings" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold mb-6">모임 등록</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 모임 제목 */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                모임 제목
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                placeholder="모임 제목을 입력해주세요"
                required
              />
            </div>

            {/* 모임 테마 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                모임 테마
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.theme}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  placeholder="테마를 선택해주세요"
                />
                <button
                  type="button"
                  onClick={() => setIsThemeSearchModalOpen(true)}
                  className="px-4 py-2 bg-[#FFB130] text-white rounded-lg hover:bg-[#FFB130]/90"
                >
                  테마 검색
                </button>
              </div>
            </div>

            {/* 모임 날짜 */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                모임 날짜
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            {/* 모임 시간 */}
            <div>
              <label
                htmlFor="time"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                모임 시간
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            {/* 필요한 인원 */}
            <div>
              <label
                htmlFor="requiredMembers"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                필요한 인원
              </label>
              <input
                type="number"
                id="requiredMembers"
                name="requiredMembers"
                value={formData.requiredMembers}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            {/* 모임 총 인원 */}
            <div>
              <label
                htmlFor="totalMembers"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                모임 총 인원 (모임장 포함)
              </label>
              <input
                type="number"
                id="totalMembers"
                name="totalMembers"
                value={formData.totalMembers}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                required
              />
            </div>

            {/* 초심자 가능 여부 */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isBeginnerFriendly"
                name="isBeginnerFriendly"
                checked={formData.isBeginnerFriendly}
                onChange={handleInputChange}
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
              <label
                htmlFor="isBeginnerFriendly"
                className="ml-2 block text-sm text-gray-700"
              >
                초심자 가능 여부
              </label>
            </div>

            {/* 모임 소개글 */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                모임 소개글
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                placeholder="모임에 대한 소개글을 작성해주세요"
                required
              />
            </div>

            {/* 버튼 그룹 */}
            <div className="flex gap-3 mt-8">
              <Link
                href="/meetings"
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
              >
                취소
              </Link>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#FFB130] text-white rounded-lg hover:bg-[#FFB130]/90"
              >
                등록하기
              </button>
            </div>
          </form>
        </div>
      </div>

      <ThemeSearchModal
        isOpen={isThemeSearchModalOpen}
        onClose={() => setIsThemeSearchModalOpen(false)}
        onSelect={handleThemeSelect}
      />
    </main>
  );
}
