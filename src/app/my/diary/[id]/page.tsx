import { Navigation } from "@/components/Navigation";
import Link from "next/link";
import { DiaryDetail } from "@/types/Diary";
import { Metadata } from "next";

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

export default function Page({ params }: any) {
  // TODO: API로 데이터 가져오기
  const diary = dummyDiaryDetail;

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
