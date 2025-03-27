"use client";

import Link from "next/link";
import Image from "next/image";

export function Navigation({ activePage }: { activePage?: string }) {
  const handleActivityClick = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("준비 중입니다.");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Image
                  className="h-8 w-auto"
                  src="/logo.svg"
                  alt="도망"
                  width={32}
                  height={32}
                />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/themes"
                className={`${
                  activePage === "themes"
                    ? "border-b-2 border-yellow-500 text-gray-900"
                    : "border-transparent border-b-2 text-gray-500 hover:text-gray-700 hover:border-yellow-500"
                } inline-flex items-center px-1 pt-1 text-sm font-medium`}
              >
                방탈출 테마
              </Link>
              <Link
                href="/meetings"
                className={`${
                  activePage === "meetings"
                    ? "border-b-2 border-yellow-500 text-gray-900"
                    : "border-transparent border-b-2 text-gray-500 hover:text-gray-700 hover:border-yellow-500"
                } inline-flex items-center px-1 pt-1 text-sm font-medium`}
              >
                모임 탐색
              </Link>
              <a
                href="#"
                onClick={handleActivityClick}
                className={`${
                  activePage === "activity"
                    ? "border-b-2 border-yellow-500 text-gray-900"
                    : "border-transparent border-b-2 text-gray-500 hover:text-gray-700 hover:border-yellow-500"
                } inline-flex items-center px-1 pt-1 text-sm font-medium`}
              >
                나의 활동일지
              </a>
            </div>
          </div>
          <div className="flex items-center">
            <Link href="/login">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                로그인
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
