import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 태그 카테고리별 목록 (실제로는 DB에서 조회)
    const tags = {
      personality: [
        { id: 1, name: "활발한" },
        { id: 2, name: "차분한" },
        { id: 3, name: "낙천적인" },
        { id: 4, name: "신중한" },
        { id: 5, name: "창의적인" },
      ],
      playstyle: [
        { id: 6, name: "분석형" },
        { id: 7, name: "직관형" },
        { id: 8, name: "리더형" },
        { id: 9, name: "서포터형" },
        { id: 10, name: "협동적인" },
      ],
      preference: [
        { id: 11, name: "공포물" },
        { id: 12, name: "추리물" },
        { id: 13, name: "모험물" },
        { id: 14, name: "SF물" },
        { id: 15, name: "판타지" },
      ],
      experience: [
        { id: 16, name: "초보자" },
        { id: 17, name: "중급자" },
        { id: 18, name: "상급자" },
        { id: 19, name: "전문가" },
        { id: 20, name: "성지순례자" },
      ],
    };

    return NextResponse.json({
      success: true,
      message: "태그 목록 조회 성공",
      data: { tags },
    });
  } catch (error) {
    console.error("태그 목록 조회 중 오류 발생:", error);
    return NextResponse.json(
      { success: false, message: "태그 목록 조회 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
