"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Image from "next/image";
import { DiaryDetail } from "@/types/Diary";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";

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

interface PageProps {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

interface InquiryDetail {
  id: string;
  type: string;
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

// TODO: API로 데이터 가져오기
const mockInquiry: InquiryDetail = {
  id: "1",
  type: "홍대 연극 테마 요청",
  content:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non. Quis hendrerit dolor magna eget est lorem ipsum dolor sit",
  createdAt: "2024-02-18 14:30",
  nickname: "USER1",
  attachments: ["Lor.png"],
  status: "답변 완료",
  answer: {
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nisl tincidunt eget nullam non. Quis hendrerit dolor magna eget est lorem ipsum dolor sit",
    createdAt: "2024-02-18 15:30",
    nickname: "관리자",
  },
};

export default async function DiaryDetailPage({
  params,
  searchParams,
}: PageProps) {
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
    <main className="min-h-screen bg-gray-50">
      <Navigation activePage="my" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 문의 내용 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold">{mockInquiry.type}</h1>
              <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                답변 완료
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between text-sm text-gray-600">
                <div>
                  <span className="font-medium">닉네임</span>
                  <span className="ml-2">{mockInquiry.nickname}</span>
                </div>
                <div>
                  <span className="font-medium">작성시간</span>
                  <span className="ml-2">{mockInquiry.createdAt}</span>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium mb-2">내용</h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {mockInquiry.content}
                </p>
              </div>

              {mockInquiry.attachments.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium mb-2">증빙 첨부 파일</h2>
                  <div className="flex gap-2">
                    {mockInquiry.attachments.map((file) => (
                      <div
                        key={file}
                        className="flex items-center gap-1 text-sm text-gray-600"
                      >
                        <svg
                          className="w-4 h-4"
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
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 답변 내용 */}
        {mockInquiry.answer && (
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-8">
              <h2 className="text-xl font-bold mb-6">답변 내용</h2>
              <div className="space-y-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <div>
                    <span className="font-medium">닉네임</span>
                    <span className="ml-2">{mockInquiry.answer.nickname}</span>
                  </div>
                  <div>
                    <span className="font-medium">작성시간</span>
                    <span className="ml-2">{mockInquiry.answer.createdAt}</span>
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-medium mb-2">내용</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {mockInquiry.answer.content}
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
