"use client";

import { EscapeRoom } from "@/types/EscapeRoom";

interface MeetingCardProps {
  room: EscapeRoom;
  onClick?: (room: EscapeRoom) => void;
}

// 모임 카드 컴포넌트
export function MeetingCard({ room, onClick }: MeetingCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(room);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:shadow-sm transition-shadow"
      onClick={handleClick}
    >
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
        <p className="text-gray-600 text-sm mb-3">{room.category}</p>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-gray-700 text-sm">
            <img src="/calendar.svg" alt="날짜" className="w-4 h-4 mr-1.5" />
            <span>{room.date}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <img src="/members.svg" alt="인원" className="w-4 h-4 mr-1.5" />
            <span>{room.participants}</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <svg
              className="w-4 h-4 mr-1.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>{room.location}</span>
          </div>
        </div>

        {room.host && (
          <div className="flex items-center">
            {room.host.image.startsWith("/images/") ? (
              <div className="w-6 h-6 mr-2 rounded-full overflow-hidden">
                <img
                  src="/profile_man.jpg"
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <img
                src={room.host.image}
                alt={room.host.name}
                className="w-6 h-6 rounded-full mr-2 object-cover"
              />
            )}
            <span className="text-sm text-gray-700">{room.host.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
