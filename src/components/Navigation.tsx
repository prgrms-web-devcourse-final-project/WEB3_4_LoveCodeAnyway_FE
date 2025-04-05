"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function Navigation({ activePage }: { activePage?: string }) {
  // TODO: 실제 로그인 상태 관리로 대체 필요
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="도망"
                width={78}
                height={33}
                priority
              />
            </Link>
            <div className="flex space-x-6">
              <Link
                href="/themes"
                className={`${
                  activePage === "themes"
                    ? "text-[#FFD896]"
                    : "text-gray-300 hover:text-[#FFD896]"
                } text-sm font-medium`}
              >
                방탈출 테마
              </Link>
              <Link
                href="/meetings"
                className={`${
                  activePage === "meetings"
                    ? "text-[#FFD896]"
                    : "text-gray-300 hover:text-[#FFD896]"
                } text-sm font-medium`}
              >
                모임 탐색
              </Link>
              <Link
                href="/my-escape"
                className={`${
                  activePage === "my-escape"
                    ? "text-[#FFD896]"
                    : "text-gray-300 hover:text-[#FFD896]"
                } text-sm font-medium`}
              >
                나의 탈출일지
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/notifications"
                  className="text-gray-300 hover:text-[#FFD896]"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 hover:opacity-80"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden relative">
                    <Image
                      src="/profile_man.jpg"
                      alt="프로필"
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                  <span className="text-gray-300 text-sm">김도망</span>
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-[#FFB230] text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
