"use client";

import { EscapeRoom } from "@/types/EscapeRoom";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";

// 인기/최신 테마 카드 컴포넌트
export function ThemeCard({ room }: { room: EscapeRoom }) {
  const [imageError, setImageError] = useState(false);

  // 기본 이미지 URL
  const fallbackImageUrl = "/images/mystery-room.jpg";
  
  // 인증서 오류 도메인 확인
  const CERTIFICATE_ERROR_DOMAINS = [
    'xn--vh3bn2thtas7l8te.com',
    'www.xn--vh3bn2thtas7l8te.com'
  ];
  
  // 이미지 URL 처리 - 인증서 오류 도메인일 경우 프록시 사용
  const imageUrl = useMemo(() => {
    if (!room.image) return fallbackImageUrl;
    
    // 인증서 오류 도메인인지 확인
    const hasErrorDomain = CERTIFICATE_ERROR_DOMAINS.some(domain => 
      room.image?.includes(domain)
    );
    
    if (hasErrorDomain) {
      try {
        // 원본 URL에서 경로만 추출
        const urlObj = new URL(room.image);
        return `/img-proxy${urlObj.pathname}`;
      } catch (e) {
        console.error('URL 파싱 오류:', e);
        return room.image;
      }
    }
    
    return room.image;
  }, [room.image]);

  return (
    <Link href={`/themes/${room.id}`}>
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden cursor-pointer hover:shadow-sm transition-shadow">
        {/* 이미지 섹션 */}
        <div className="relative aspect-[4/3] bg-gray-700 overflow-hidden">
          {!imageError ? (
            <img
              src={imageUrl}
              alt={room.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={fallbackImageUrl}
                alt={room.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-bold text-lg mb-3 truncate text-white">{room.title}</h3>
          <p className="text-gray-400 text-sm mb-3 truncate">
            {room.category || "미스터리 룸 강남점"}
          </p>
          <div className="flex items-center mb-4">
            <div className="flex items-center text-gray-300 text-sm mr-4">
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
            <div className="flex items-center text-gray-300 text-sm">
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
                  bgColorClass = "bg-gray-700";
                  textColorClass = "text-gray-300";
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
              <span className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-sm">
                +{(room.tags || []).length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
