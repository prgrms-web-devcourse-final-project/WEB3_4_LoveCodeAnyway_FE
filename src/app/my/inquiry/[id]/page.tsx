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
        
        // API 호출 코드 주석 처리
        /*
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/inquiries/${params.id}`,
          {
            withCredentials: true,
          }
        );
        setInquiry(response.data.data);
        */

        // 가데이터로 대체
        const mockInquiryDetails: Record<string, InquiryDetail> = {
          "1": {
            id: "1",
            type: "사이트 이용 문의",
            title: "회원가입 관련 문의드립니다",
            content: "회원가입 화면에서 정보를 모두 입력했는데도 가입 버튼이 활성화되지 않습니다. 어떻게 해야 하나요?",
            createdAt: "2023-06-15 14:30:00",
            nickname: "사용자1",
            attachments: [],
            status: "답변 완료",
            answer: {
              content: "안녕하세요, 고객님. 회원가입 화면에서 모든 필수 항목을 입력했는지 확인해주세요. 특히 이용약관과 개인정보 처리방침 동의 여부를 체크하지 않으면 가입 버튼이 활성화되지 않습니다. 다시 한번 시도해보시고, 문제가 지속되면 추가적인 스크린샷이나 정보와 함께 문의해주시면 더 자세히 도와드리겠습니다.",
              createdAt: "2023-06-15 16:45:00",
              nickname: "관리자"
            }
          },
          "2": {
            id: "2",
            type: "유지 보수",
            title: "페이지 로딩이 느려요",
            content: "최근 사이트 접속 시 페이지 로딩이 매우 느려졌습니다. 특히 메인 페이지와 마이페이지에서 로딩 시간이 오래 걸립니다. 브라우저는 크롬 최신 버전 사용 중이고, 인터넷 연결에는 문제가 없습니다.",
            createdAt: "2023-06-14 09:12:00",
            nickname: "사용자2",
            attachments: [],
            status: "답변 대기"
          },
          "3": {
            id: "3",
            type: "테마등록요청",
            title: "새로운 테마 등록 요청드립니다",
            content: "서울 강남구에 새로 오픈한 '미스터리룸' 테마를 등록 요청드립니다. 웹사이트 주소는 www.mysteryroom.com 입니다. 4개의 테마가 있고 모두 난이도와 장르가 다릅니다.",
            createdAt: "2023-06-12 15:22:00",
            nickname: "사용자3",
            attachments: ["/images/sample1.jpg", "/images/sample2.jpg"],
            status: "답변 완료",
            answer: {
              content: "안녕하세요, 등록 요청 감사합니다. 해당 테마룸 정보를 확인하여 빠른 시일 내에 등록 완료하겠습니다. 등록이 완료되면 별도로 알림 드리겠습니다.",
              createdAt: "2023-06-13 10:30:00",
              nickname: "관리자"
            }
          },
          "4": {
            id: "4",
            type: "사이트 이용 문의",
            title: "비밀번호 변경 방법이 궁금합니다",
            content: "로그인 후 비밀번호를 변경하는 방법을 알려주세요. 마이페이지에서 찾아봤는데 관련 메뉴를 찾을 수 없었습니다.",
            createdAt: "2023-06-10 11:05:00",
            nickname: "사용자4",
            attachments: [],
            status: "답변 대기"
          },
          "5": {
            id: "5",
            type: "유지 보수",
            title: "모바일에서 접속 시 오류가 발생합니다",
            content: "모바일로 접속하면 테마 목록 페이지에서 계속 에러가 발생합니다. 화면이 깨지고 스크롤이 되지 않습니다. 아이폰 13, iOS 16.5 환경입니다.",
            createdAt: "2023-06-08 17:40:00",
            nickname: "사용자5",
            attachments: ["/images/error_screenshot.jpg"],
            status: "답변 완료",
            answer: {
              content: "안녕하세요, 문의주신 모바일 환경 오류 관련하여 확인해보았습니다. 현재 해당 이슈를 인지하고 있으며, 긴급 패치를 준비 중입니다. 6월 10일까지 해결될 예정이니 잠시만 기다려 주시면 감사하겠습니다.",
              createdAt: "2023-06-09 09:15:00",
              nickname: "관리자"
            }
          }
        };

        // 요청된 ID에 해당하는 가데이터 가져오기
        const foundInquiry = mockInquiryDetails[params.id];
        if (foundInquiry) {
          setInquiry(foundInquiry);
        } else {
          setError("해당 문의를 찾을 수 없습니다.");
        }
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
