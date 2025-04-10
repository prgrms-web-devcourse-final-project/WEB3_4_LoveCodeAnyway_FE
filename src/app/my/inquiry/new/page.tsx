"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";

const inquiryTypes = [
  "사이트 이용 문의",
  "버그 신고",
  "기능 개선 제안",
  "기타",
];

export default function NewInquiryPage() {
  const [inquiryType, setInquiryType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API 호출
    console.log({ inquiryType, title, content });
  };

  return (
    <main className="min-h-screen bg-white">
      <Navigation activePage="my" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">문의하기</h1>
        <p className="text-gray-600 mb-8">
          아래 양식을 작성하여 문의사항을 등록해주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 문의 유형 */}
          <div className="space-y-2">
            <label htmlFor="inquiryType" className="block text-sm font-medium">
              문의 유형
            </label>
            <select
              id="inquiryType"
              value={inquiryType}
              onChange={(e) => setInquiryType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">선택해주세요</option>
              {inquiryTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <label htmlFor="content" className="block text-sm font-medium">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="문의 내용을 상세히 작성해주세요"
              required
            />
          </div>

          {/* 첨부파일 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">첨부파일</label>
            <div className="border border-dashed border-gray-300 rounded-lg p-8">
              <div className="flex flex-col items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="text-sm text-gray-600 mb-1">파일 업로드</p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    // TODO: 파일 업로드 처리
                    console.log(e.target.files);
                  }}
                />
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/my/inquiry"
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              취소
            </Link>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-black rounded-lg hover:bg-gray-800"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
