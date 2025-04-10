"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Image from "next/image";
import Link from "next/link";

const tags = ["#전체", "#공포", "#추리", "#액션", "#판타지", "#SF"];

export default function HomePage() {
  const [activeTag, setActiveTag] = useState("#전체");

  return (
    <main className="min-h-screen bg-white">
      <Navigation activePage="home" />

      {/* Section 1: 메인 배너 */}
      <section className="w-full h-[400px] relative bg-black">
        <Image
          src="/images/grand-opening.jpg"
          alt="Grand Opening"
          fill
          className="object-cover"
          priority
        />
      </section>

      {/* Section 2: 소셜링 */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <h2 className="text-lg font-medium">실시간 모집</h2>
        </div>
        <h3 className="text-2xl font-bold text-center mb-8">
          함께 방탈출할 메이트를 찾고 계신가요?
          <br />
          또방과 함께 방탈출 크루를 만들어보세요
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <Link
              href={`/meetings/${item}`}
              key={item}
              className="bg-gray-50 rounded-lg p-4 flex gap-4 hover:bg-gray-100 transition-colors"
            >
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                <Image
                  src={`/images/meeting-${item}.jpg`}
                  alt="Meeting thumbnail"
                  width={96}
                  height={96}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">홍대입구역</span>
                  <span className="text-xs text-red-500 px-2 py-0.5 bg-red-50 rounded-full">
                    D-1
                  </span>
                </div>
                <h4 className="font-medium mb-1 line-clamp-2">
                  {item === 1 && "공포 테마 같이 도전하실 분!"}
                  {item === 2 && "추리 테마 도전자 모집"}
                  {item === 3 && "초보자도 환영! SF 테마 가실 분"}
                  {item === 4 && "판타지 테마 크루 구합니다"}
                </h4>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <span>난이도 4.5</span>
                  <span>•</span>
                  <span>2/4명</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 3: 랭킹 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">RANKING</h2>
          <div className="flex justify-center gap-4 mb-8">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeTag === tag
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((rank) => (
              <Link
                href={`/themes/${rank}`}
                key={rank}
                className="relative group"
              >
                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={`/images/theme-${rank}.jpg`}
                    alt={`Rank ${rank}`}
                    width={400}
                    height={533}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    {rank}위
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium mb-1">
                    {rank === 1 && "비밀의 방 [미스터리 룸 잠입전]"}
                    {rank === 2 && "타임머신 [시간여행 어드벤처]"}
                    {rank === 3 && "탐정사무소 [명탐정 신드롬]"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {rank === 1 && "이스케이프 홍대점"}
                    {rank === 2 && "비트포비아 강남점"}
                    {rank === 3 && "마스터키 종로점"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: 신규 테마 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">NEW THEMES</h2>
          <div className="flex justify-center gap-4 mb-8">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeTag === tag
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((rank) => (
              <Link
                href={`/themes/${rank}`}
                key={rank}
                className="relative group"
              >
                <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={`/images/new-theme-${rank}.jpg`}
                    alt={`New theme ${rank}`}
                    width={400}
                    height={533}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    NEW
                  </span>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium mb-1">
                    {rank === 1 && "저주받은 저택 [호러룸 건탈출]"}
                    {rank === 2 && "우주정거장 [SF 어드벤처]"}
                    {rank === 3 && "마법학교 [판타지 탈출]"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {rank === 1 && "셜록홈즈 홍대점"}
                    {rank === 2 && "룸익스케이프 강남점"}
                    {rank === 3 && "코드네임 신촌점"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
