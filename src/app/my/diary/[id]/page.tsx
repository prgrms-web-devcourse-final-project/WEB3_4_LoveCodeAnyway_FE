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

export default function Page({ params }: any) {
  // TODO: API로 데이터 가져오기
  const diary = dummyDiaryDetail;

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation activePage="my-diary" />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 테마 이미지 섹션 */}
        <div className="bg-gray-800 h-60 rounded-lg overflow-hidden flex items-center justify-center mb-6">
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <svg
              className="w-16 h-16 text-gray-500"
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
        </div>

        {/* 다이어리 내용 */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          {/* 헤더 */}
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">{diary.themeName}</h1>
              <p className="text-gray-500">{diary.storeName}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm ${
                diary.isSuccess
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              } rounded-full`}
            >
              {diary.isSuccess ? "성공" : "실패"}
            </span>
          </div>

          {/* 기본 정보 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">플레이 정보</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">플레이 날짜</p>
                <p>{diary.playDate}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">탈출 시간</p>
                <p>{diary.escapeTime}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">힌트 사용</p>
                <p>{diary.hintCount}회</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">참여자</p>
                <p>{diary.participants}</p>
              </div>
            </div>
          </div>

          {/* 평가 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">평가</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">인테리어</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < diary.ratings.interior
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">구성</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < diary.ratings.composition
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">스토리</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < diary.ratings.story
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">연출</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < diary.ratings.production
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">만족도</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < diary.ratings.satisfaction
                          ? "text-yellow-400"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 장치 비율, 난이도, 공포도, 활동성 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">특징</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">장치 비율</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${diary.ratings.deviceRatio}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span>자물쇠</span>
                  <span>{diary.ratings.deviceRatio}%</span>
                  <span>전자장치</span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">난이도</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < diary.ratings.difficulty
                          ? "text-blue-500"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">공포도</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < diary.ratings.horror
                          ? "text-purple-500"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-500 mb-1">활동성</p>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < diary.ratings.activity
                          ? "text-green-500"
                          : "text-gray-200"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 코멘트 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">코멘트</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{diary.comment}</p>
          </div>

          {/* 탈출 사진 */}
          <div>
            <h2 className="text-lg font-semibold mb-3">탈출 사진</h2>
            <div className="grid grid-cols-2 gap-4">
              {diary.escapeImages?.map((image, index) => (
                <div
                  key={index}
                  className="bg-gray-100 h-32 rounded-lg flex items-center justify-center"
                >
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
              ))}
            </div>
          </div>
        </div>

        {/* 목록으로 버튼 */}
        <Link
          href="/my/diary"
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
