"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.NODE_ENV === "development"
  ? "http://localhost:8080"
  : "https://api.ddobang.site";

interface InquiryDetail {
  id: string;
  type: string;
  title: string;
  content: string;
  createdAt: string;
  nickname: string;
  attachments: string[];
  status: "답변 완료" | "답변 대기";
  answer?: {
    content: string;
    createdAt: string;
    nickname: string;
  };
}

export default function Page({ params }: { params: { id: string } }) {
  const [inquiry, setInquiry] = useState<InquiryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInquiryDetail = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/inquiries/${params.id}`,
          {
            withCredentials: true,
          }
        );
        setInquiry(response.data.data);
      } catch (error) {
        console.error("문의 상세 조회 에러:", error);
        setError("문의 내용을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInquiryDetail();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">문의를 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation activePage="my" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 문의 내용 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-sm text-gray-600 mb-2 block">
                  {inquiry.type}
                </span>
                <h1 className="text-2xl font-bold">{inquiry.title}</h1>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  inquiry.status === "답변 완료"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {inquiry.status}
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between text-sm text-gray-600">
                <div>
                  <span className="font-medium">닉네임</span>
                  <span className="ml-2">{inquiry.nickname}</span>
                </div>
                <div>
                  <span className="font-medium">작성시간</span>
                  <span className="ml-2">{inquiry.createdAt}</span>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium mb-2">내용</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {inquiry.content}
                </p>
              </div>

              {inquiry.attachments.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium mb-2">첨부 파일</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {inquiry.attachments.map((fileUrl, index) => (
                      <a
                        key={index}
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="aspect-square relative rounded-lg overflow-hidden border">
                          <Image
                            src={fileUrl}
                            alt={`첨부 파일 ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 답변 내용 */}
        {inquiry.answer && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-8">
              <h2 className="text-xl font-bold mb-6">답변 내용</h2>
              <div className="space-y-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <div>
                    <span className="font-medium">닉네임</span>
                    <span className="ml-2">{inquiry.answer.nickname}</span>
                  </div>
                  <div>
                    <span className="font-medium">작성시간</span>
                    <span className="ml-2">{inquiry.answer.createdAt}</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-medium mb-2">내용</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {inquiry.answer.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 목록으로 버튼 */}
        <Link
          href="/my/inquiry"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          목록으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
