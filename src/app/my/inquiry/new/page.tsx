"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.NODE_ENV === "development"
  ? "http://localhost:8080"
  : "https://api.ddobang.site";

const inquiryTypes = [
  "사이트 이용 문의",
  "버그 신고",
  "기능 개선 제안",
  "기타",
];

export default function NewInquiryPage() {
  const router = useRouter();
  const [inquiryType, setInquiryType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter((file) => {
        const isValidType = ["image/jpeg", "image/png", "image/gif"].includes(
          file.type
        );
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
        return isValidType && isValidSize;
      });

      if (validFiles.length !== selectedFiles.length) {
        alert(
          "일부 파일이 업로드되지 않았습니다. (10MB 이하의 JPG, PNG, GIF 파일만 가능)"
        );
      }

      setFiles(validFiles);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inquiryType || !title || !content) {
      setError("모든 필수 항목을 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 파일이 있는 경우 먼저 업로드
      let fileUrls: string[] = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });

        const uploadResponse = await axios.post(
          `${API_BASE_URL}/api/v1/files/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        fileUrls = uploadResponse.data.data;
      }

      // 문의 등록
      await axios.post(
        `${API_BASE_URL}/api/v1/inquiries`,
        {
          type: inquiryType,
          title,
          content,
          fileUrls,
        },
        {
          withCredentials: true,
        }
      );

      router.push("/my/inquiry");
    } catch (error) {
      console.error("문의 등록 에러:", error);
      setError("문의 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navigation activePage="my" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">문의하기</h1>
        <p className="text-gray-600 mb-8">
          아래 양식을 작성하여 문의사항을 등록해주세요.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

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
                  onChange={handleFileChange}
                />
              </div>
            </div>
            {files.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">선택된 파일:</p>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              disabled={isSubmitting}
              className={`px-6 py-2 text-white bg-black rounded-lg hover:bg-gray-800 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "등록 중..." : "등록하기"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
