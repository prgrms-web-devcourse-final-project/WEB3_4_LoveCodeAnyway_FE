"use client";

import { useState, useEffect, useContext } from "react";
import { LoginMemberContext } from "@/stores/auth/loginMember";
import { useRouter } from "next/navigation";
import client from "@/lib/backend/client";
import Image from "next/image";
import { PageLoading } from "@/components/PageLoading";

// 차트 컴포넌트
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";

// 통계 데이터 인터페이스
interface StatData {
  totalEscapeCount: number;
  noHintEscapeCount: number;
  avgHintUsed: number;
  successRate: number;
  genreDistribution: { name: string; value: number }[];
  genreSuccessRate: { genre: string; success: number; fail: number }[];
  radarData: { subject: string; A: number; fullMark: number }[];
  monthlyStats: { month: string; count: number }[];
  firstEscapeDate: string;
  lastEscapeDate: string;
  totalDays: number;
  recentEscapes: {
    count: number;
    avgRating: number;
    avgHint: number;
    successRate: number;
    avgTime: number;
    bestResult: string;
  };
  difficultyByCount: { name: string; value: number }[];
}

// 색상 정의
const COLORS = [
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#9896f1",
  "#f9ca66",
  "#e5e5e5",
];
const GENRE_COLORS = {
  공포: "#ff6b6b",
  추리: "#4ecdc4",
  스릴: "#45b7d1",
  SF: "#9896f1",
  판타지: "#f9ca66",
  기타: "#e5e5e5",
};

export default function StatPage() {
  const router = useRouter();
  const { loginMember, isLogin } = useContext(LoginMemberContext);
  const [loading, setLoading] = useState(true);
  const [statData, setStatData] = useState<StatData | null>(null);

  useEffect(() => {
    if (!isLogin) {
      router.push("/login");
      return;
    }

    // 통계 데이터 가져오기
    const fetchStatData = async () => {
      setLoading(true);
      try {
        // API 호출 대신 가상 데이터 생성 (실제 구현 시 API 연동 필요)
        const dummyData: StatData = {
          totalEscapeCount: 42,
          noHintEscapeCount: 12,
          avgHintUsed: 2.8,
          successRate: 85,
          genreDistribution: [
            { name: "공포", value: 32 },
            { name: "추리", value: 25 },
            { name: "스릴", value: 20 },
            { name: "SF", value: 15 },
            { name: "판타지", value: 8 },
          ],
          genreSuccessRate: [
            { genre: "공포", success: 82, fail: 18 },
            { genre: "추리", success: 88, fail: 12 },
            { genre: "스릴", success: 94, fail: 6 },
            { genre: "SF", success: 90, fail: 10 },
            { genre: "판타지", success: 85, fail: 15 },
          ],
          radarData: [
            { subject: "난이도", A: 80, fullMark: 100 },
            { subject: "연출", A: 98, fullMark: 100 },
            { subject: "스토리", A: 70, fullMark: 100 },
            { subject: "인테리어", A: 85, fullMark: 100 },
            { subject: "문제", A: 90, fullMark: 100 },
          ],
          monthlyStats: [
            { month: "1월", count: 4 },
            { month: "2월", count: 5 },
            { month: "3월", count: 4 },
            { month: "4월", count: 6 },
            { month: "5월", count: 7 },
            { month: "6월", count: 6 },
            { month: "7월", count: 7 },
            { month: "8월", count: 3 },
          ],
          firstEscapeDate: "2022년 3월 20일",
          lastEscapeDate: "2023년 7월",
          totalDays: 3045,
          recentEscapes: {
            count: 8,
            avgRating: 4.2,
            avgHint: 2.3,
            successRate: 87.5,
            avgTime: 58,
            bestResult: "족집게 장인",
          },
          difficultyByCount: [
            { name: "매우쉬움", value: 1.2 },
            { name: "쉬움", value: 2 },
            { name: "보통", value: 3 },
            { name: "어려움", value: 3.8 },
            { name: "매우어려움", value: 4.8 },
          ],
        };

        setStatData(dummyData);
      } catch (error) {
        console.error("통계 데이터 로딩 중 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatData();
  }, [isLogin, router]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <PageLoading isLoading={true} />
      </div>
    );
  }

  if (!statData) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <h1 className="text-2xl font-bold mb-4">
              통계를 불러올 수 없습니다
            </h1>
            <p className="text-gray-500 mb-6">
              탈출일지를 작성하시면 통계가 생성됩니다.
            </p>
            <button
              onClick={() => router.push("/my/diary/new")}
              className="px-6 py-2 bg-[#FFB130] text-white rounded-md"
            >
              탈출일지 작성하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">방탈출 통계 대시보드</h1>
          <p className="text-gray-500 text-sm">
            당신이 방탈출 여행을 한눈에 확인하세요.
          </p>
        </div>

        {/* 상단 카드 - 주요 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-500 text-sm">총 방탈출 횟수</p>
                <h2 className="text-3xl font-bold">
                  {statData.totalEscapeCount}
                </h2>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Image
                  src="/images/count-icon.svg"
                  alt="방 아이콘"
                  width={24}
                  height={24}
                  className="opacity-60"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              탈출 성공률{" "}
              <span className="text-[#4ecdc4] font-semibold">
                {statData.successRate}%
              </span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-500 text-sm">노힌트 클리어</p>
                <h2 className="text-3xl font-bold">
                  {statData.noHintEscapeCount}
                </h2>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Image
                  src="/images/star-icon.svg"
                  alt="별 아이콘"
                  width={24}
                  height={24}
                  className="opacity-60"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              노힌트 성공률{" "}
              <span className="text-[#4ecdc4] font-semibold">28.5%</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-500 text-sm">힌트 평균 사용</p>
                <h2 className="text-3xl font-bold">{statData.avgHintUsed}</h2>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Image
                  src="/images/hint-icon.svg"
                  alt="전구 아이콘"
                  width={24}
                  height={24}
                  className="opacity-60"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">&nbsp;</p>
          </div>
        </div>

        {/* 장르별 진행 비율 & 장르별 성공/실패 비율 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">장르별 진행 비율</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statData.genreDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {statData.genreDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "비율"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">
              장르별 성공/실패 비율
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              참여 비율 상위 5개 장르만 표시합니다.
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statData.genreSuccessRate}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis dataKey="genre" type="category" width={80} />
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                  <Legend />
                  <Bar
                    dataKey="success"
                    name="성공"
                    stackId="a"
                    fill="#4ecdc4"
                  />
                  <Bar dataKey="fail" name="실패" stackId="a" fill="#ff6b6b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 성향 분석 & 월별 방탈출 장소 수와 평균 용맹 지수 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">
              성향 분석 <span className="text-gray-400 text-sm">ⓘ</span>
            </h3>
            <div className="relative h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  data={statData.radarData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="사용자"
                    dataKey="A"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip formatter={(value) => [`${value}`, ""]} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">
              월별 방탈출 장소 수와 평균 용맹 지수
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statData.monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 8]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 통계 카드 행 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <p className="text-gray-500 text-sm mb-1">첫 방탈출</p>
            <p className="text-xl font-semibold">{statData.firstEscapeDate}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <p className="text-gray-500 text-sm mb-1">최근 방탈출</p>
            <p className="text-xl font-semibold text-[#FF8B30]">
              {statData.lastEscapeDate}
            </p>
            <p className="text-xs text-gray-400">활동 중</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <p className="text-gray-500 text-sm mb-1">방탈출을 사랑한 지</p>
            <p className="text-xl font-semibold">{statData.totalDays}일 째</p>
          </div>
        </div>

        {/* 최근 방탈출 활동 */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-6">최근 방탈출 활동</h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="mb-2">
                <Image
                  src="/images/count-icon.svg"
                  alt="참여 테마 수"
                  width={36}
                  height={36}
                  className="mx-auto"
                />
              </div>
              <p className="text-gray-500 text-xs">참여 테마 수</p>
              <p className="text-lg font-semibold">
                {statData.recentEscapes.count}개
              </p>
            </div>

            <div className="text-center">
              <div className="mb-2">
                <Image
                  src="/images/star-icon.svg"
                  alt="평균 만족도"
                  width={36}
                  height={36}
                  className="mx-auto"
                />
              </div>
              <p className="text-gray-500 text-xs">평균 만족도</p>
              <p className="text-lg font-semibold">
                {statData.recentEscapes.avgRating}/5.0
              </p>
            </div>

            <div className="text-center">
              <div className="mb-2">
                <Image
                  src="/images/bulb-icon.svg"
                  alt="평균 힌트 사용"
                  width={36}
                  height={36}
                  className="mx-auto"
                />
              </div>
              <p className="text-gray-500 text-xs">평균 힌트 사용</p>
              <p className="text-lg font-semibold">
                {statData.recentEscapes.avgHint}개
              </p>
            </div>

            <div className="text-center">
              <div className="mb-2">
                <Image
                  src="/images/check-icon.svg"
                  alt="탈출 성공률"
                  width={36}
                  height={36}
                  className="mx-auto"
                />
              </div>
              <p className="text-gray-500 text-xs">탈출 성공률</p>
              <p className="text-lg font-semibold">
                {statData.recentEscapes.successRate}%
              </p>
            </div>

            <div className="text-center">
              <div className="mb-2">
                <Image
                  src="/images/clock-icon.svg"
                  alt="평균 소요 시간"
                  width={36}
                  height={36}
                  className="mx-auto"
                />
              </div>
              <p className="text-gray-500 text-xs">평균 소요 시간</p>
              <p className="text-lg font-semibold">
                {statData.recentEscapes.avgTime}분
              </p>
            </div>

            <div className="text-center">
              <div className="mb-2">
                <Image
                  src="/images/trophy-icon.svg"
                  alt="최고 전적 대비"
                  width={36}
                  height={36}
                  className="mx-auto"
                />
              </div>
              <p className="text-gray-500 text-xs">최고 전적 대비</p>
              <p className="text-lg font-semibold text-[#4ecdc4]">
                {statData.recentEscapes.bestResult}
              </p>
              <p className="text-[10px] text-gray-400">4/5</p>
            </div>
          </div>
        </div>

        {/* 난이도별 방탈출 사용 패턴 & 난이도와 만족도 상관관계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">
              난이도별 힌트 사용 패턴
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={statData.difficultyByCount}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="평균 힌트 사용"
                    stroke="#8884d8"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              난이도가 높을수록 힌트 사용량이 증가하는 경향이 있습니다.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-6">
              난이도와 만족도 상관관계
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statData.difficultyByCount}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Bar dataKey="value" name="평균 만족도" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              난이도와 상관없이 점차 만족도가 높아지는 것으로 보입니다.
            </p>
            <p className="text-xs text-gray-400 mt-1">
              난이도가 높아질수록 플레이 경험이 향상되는 경향이 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
