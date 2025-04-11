import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // URL에서 닉네임 파라미터 추출
    const searchParams = request.nextUrl.searchParams;
    const nickname = searchParams.get("nickname");

    if (!nickname) {
      return NextResponse.json(
        { success: false, message: "닉네임 파라미터가 누락되었습니다" },
        { status: 400 }
      );
    }

    // 예시: 이미 사용 중인 닉네임 목록 (실제로는 DB에서 조회)
    const reservedNicknames = ["admin", "test", "user", "system", "기존사용자"];

    // 닉네임 길이 검증 (2~10자)
    if (nickname.length < 2 || nickname.length > 10) {
      return NextResponse.json({
        success: false,
        message: "닉네임은 2~10자 사이여야 합니다",
        data: { available: false },
      });
    }

    // 닉네임 중복 확인
    const isAvailable = !reservedNicknames.includes(nickname);

    return NextResponse.json({
      success: true,
      message: isAvailable
        ? "사용 가능한 닉네임입니다"
        : "이미 사용 중인 닉네임입니다",
      data: { available: isAvailable },
    });
  } catch (error) {
    console.error("닉네임 중복 확인 중 오류 발생:", error);
    return NextResponse.json(
      { success: false, message: "닉네임 중복 확인 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
