"use client";

import { EscapeRoom } from "@/types/EscapeRoom";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// 인기/최신 테마 카드 컴포넌트
export function ThemeCard({ room }: { room: EscapeRoom }) {
  const [imageError, setImageError] = useState(false);

  // 기본 이미지 URL
  const fallbackImageUrl = "/images/mystery-room.jpg";

  return (
    <Link href={`/themes/${room.id}`}>
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
        {/* 이미지 섹션 */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {room.image && !imageError ? (
            <Image
              src={room.image}
              alt={room.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
              unoptimized={!room.image.startsWith("/")} // 외부 이미지는 최적화하지 않음
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={fallbackImageUrl}
                alt={room.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-bold text-lg mb-3 truncate">{room.title}</h3>
          <p className="text-gray-600 text-sm mb-3 truncate">
            {room.category || "미스터리 룸 강남점"}
          </p>
          <div className="flex items-center mb-4">
            <div className="flex items-center text-gray-700 text-sm mr-4">
              <Image
                src="/time.svg"
                alt="시간"
                width={16}
                height={16}
                className="mr-1.5"
              />
              <span>
                {room.subInfo?.includes("분") ? room.subInfo : "60분"}
              </span>
            </div>
            <div className="flex items-center text-gray-700 text-sm">
              <Image
                src="/members.svg"
                alt="인원"
                width={16}
                height={16}
                className="mr-1.5"
              />
              <span>{room.participants || "2-4인"}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-3 h-[24px] overflow-hidden">
            {(room.tags || ["공포", "추리"]).slice(0, 3).map((tag, index) => {
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
                  className={`px-3 py-1 ${bgColorClass} ${textColorClass} text-xs rounded-sm truncate max-w-[120px]`}
                >
                  {tag}
                </span>
              );
            })}
            {(room.tags || []).length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-sm">
                +{(room.tags || []).length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
