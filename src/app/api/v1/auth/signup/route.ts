import { NextRequest, NextResponse } from "next/server";

interface SignupRequestBody {
  nickname: string;
  gender: "MALE" | "FEMALE";
  introduction?: string;
  tags?: number[];
  profileImage?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    // 요청 본문 파싱
    const body: SignupRequestBody = await request.json();
    const { nickname, gender, introduction, tags, profileImage } = body;

    // 필수 필드 검증
    if (!nickname) {
      return NextResponse.json(
        { success: false, message: "닉네임은 필수 항목입니다" },
        { status: 400 }
      );
    }

    if (!gender) {
      return NextResponse.json(
        { success: false, message: "성별은 필수 항목입니다" },
        { status: 400 }
      );
    }

    // 여기서는 실제 회원가입 로직 대신 성공 응답을 반환합니다
    // 실제 서비스에서는 DB에 유저 정보를 저장하는 로직이 필요합니다

    // JWT 토큰 생성 (실제 구현시에는 적절한 라이브러리를 사용해야 합니다)
    const accessToken = "sample_access_token_" + Date.now();
    const refreshToken = "sample_refresh_token_" + Date.now();

    // 응답 객체 생성
    const response = NextResponse.json({
      success: true,
      message: "회원가입이 완료되었습니다",
      data: {
        member: {
          nickname,
          gender,
          introduction: introduction || "",
          tags: tags || [],
          profileImage: profileImage || null,
        },
      },
    });

    // 쿠키에 토큰 저장
    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set({
      name: "accessToken",
      value: accessToken,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // 1시간
      secure: isProduction,
      sameSite: "strict",
    });

    response.cookies.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7일
      secure: isProduction,
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("회원가입 처리 중 오류 발생:", error);
    return NextResponse.json(
      { success: false, message: "회원가입 처리 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
