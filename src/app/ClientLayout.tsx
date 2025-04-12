"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LoginMemberContext, useLoginMember } from "@/stores/auth/loginMember";
import client from "@/lib/backend/client";
import Image from "next/image";

export function ClientLayout({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  const {
    loginMember,
    setLoginMember,
    isLoginMemberPending,
    setNoLoginMember,
    isLogin,
    logout,
    logoutAndHome,
  } = useLoginMember();

  const loginMemberContextValue = {
    loginMember,
    setLoginMember,
    isLoginMemberPending,
    setNoLoginMember,
    isLogin,
    logout,
    logoutAndHome,
  };

  useEffect(() => {
    const fetchMember = () => {
      client
        .GET("/api/v1/members/me", {})
        .then((res) => {
          if (res.error) {
            // 로그인되지 않은 상태로 처리
            setNoLoginMember();
            return;
          }
          setLoginMember(res.data);
        })
        .catch((error) => {
          // 에러 발생 시 (302 포함) 로그인되지 않은 상태로 처리
          setNoLoginMember();
        });
    };

    fetchMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoginMemberPending) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-24">
            {/* 바람을 표현하는 선들 */}
            <div className="absolute inset-0 -left-6 flex items-center">
              <div className="space-y-2 animate-pulse">
                <div className="h-0.5 w-4 bg-[#FFD896] rounded-full opacity-70"></div>
                <div className="h-0.5 w-6 bg-[#FFD896] rounded-full opacity-70"></div>
                <div className="h-0.5 w-4 bg-[#FFD896] rounded-full opacity-70"></div>
              </div>
            </div>

            <div className="animate-bounce absolute inset-0">
              <Image src="/favicon.svg" alt="로딩 중" width={80} height={80} />
            </div>
          </div>
          <div className="mt-2 text-center text-[#FFB130] text-lg animate-pulse">
            로딩중
          </div>
        </div>
      </div>
    );
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LoginMemberContext value={loginMemberContextValue}>
        <main>{children}</main>
      </LoginMemberContext>
    </NextThemesProvider>
  );
}
