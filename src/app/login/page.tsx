"use client";

import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">로그인</h1>
          <p className="mt-2 text-sm text-gray-600">
            서비스를 이용하시려면 로그인이 필요해요.
          </p>
        </div>

        <div className="space-y-2">
          <button className="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] px-4 py-3 rounded-lg">
            <Image src="/kakao.svg" alt="카카오 로고" width={20} height={20} />
            카카오 1초 안에 시작하기
          </button>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors"
          >
            메인 페이지로 돌아가기
          </Link>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          로그인 시{" "}
          <a href="#" className="text-gray-700 hover:underline">
            이용약관
          </a>
          과{" "}
          <a href="#" className="text-gray-700 hover:underline">
            개인정보보호정책
          </a>
          에 동의하게 됩니다.
        </div>
      </div>
    </div>
  );
}
