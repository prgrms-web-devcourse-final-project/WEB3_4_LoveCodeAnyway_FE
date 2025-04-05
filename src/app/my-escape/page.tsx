"use client";

import { Navigation } from "@/components/Navigation";

export default function MyEscapePage() {
  return (
    <main className="bg-gray-50 min-h-screen">
      <Navigation activePage="my-escape" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">나의 탈출일지</h1>
          <p className="text-gray-600">현재 페이지는 준비중입니다.</p>
        </div>
      </div>
    </main>
  );
}
