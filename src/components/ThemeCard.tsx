import { EscapeRoom } from "@/types/EscapeRoom";
import Link from "next/link";

// 인기/최신 테마 카드 컴포넌트
export function ThemeCard({ room }: { room: EscapeRoom }) {
  return (
    <Link href={`/themes/${room.id}`}>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
        {/* 이미지 섹션 */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {room.image && !room.image.startsWith("/images/") ? (
            <img
              src={room.image}
              alt={room.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-bold text-lg mb-3">{room.title}</h3>
          <p className="text-gray-600 text-sm mb-3">
            {room.subInfo || "미스터리 룸 강남점"}
          </p>
          <div className="flex items-center mb-4">
            <div className="flex items-center text-gray-700 text-sm mr-4">
              <img src="/time.svg" alt="시간" className="w-4 h-4 mr-1.5" />
              <span>
                {room.subInfo?.includes("분") ? room.subInfo : "60분"}
              </span>
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <img src="/members.svg" alt="인원" className="w-4 h-4 mr-1.5" />
              <span>{room.participants || "2-4인"}</span>
            </div>
          </div>
          <div className="flex items-start space-x-2 mb-3">
            {(room.tags || ["공포", "추리"]).map((tag, index) => {
              // 태그별 배경색과 텍스트 색상 지정
              let bgColorClass = "";
              let textColorClass = "";

              switch (tag) {
                case "공포":
                  bgColorClass = "bg-blue-100";
                  textColorClass = "text-blue-700";
                  break;
                case "추리":
                  bgColorClass = "bg-green-100";
                  textColorClass = "text-green-700";
                  break;
                case "SF":
                  bgColorClass = "bg-purple-100";
                  textColorClass = "text-purple-700";
                  break;
                case "액션":
                  bgColorClass = "bg-yellow-100";
                  textColorClass = "text-yellow-700";
                  break;
                case "미스터리":
                  bgColorClass = "bg-indigo-100";
                  textColorClass = "text-indigo-700";
                  break;
                default:
                  bgColorClass = "bg-gray-100";
                  textColorClass = "text-gray-700";
              }

              return (
                <span
                  key={index}
                  className={`px-3 py-1 ${bgColorClass} ${textColorClass} text-xs rounded-sm`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}
