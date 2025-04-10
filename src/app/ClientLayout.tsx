"use client";

import * as React from "react";
import { useEffect } from "react";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { LoginMemberContext, useLoginMember } from "@/stores/auth/loginMember";

export function ClientLayout({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  const {
    loginMember,
    setLoginMember,
    isLoginMemberPending,
    setNoLoginMember,
    removeLoginMember,
    isLogin,
    isAdmin,
  } = useLoginMember();

  const loginMemberContextValue = {
    loginMember,
    setLoginMember,
    isLoginMemberPending,
    setNoLoginMember,
    removeLoginMember,
    isLogin,
    isAdmin,
  };

  useEffect(() => {
    // JWT 쿠키 기반으로 사용자 정보 가져오기
    const fetchMember = async () => {
      try {
        const response = await fetch("/api/v1/members/me");
        if (!response.ok) {
          setNoLoginMember();
          return;
        }

        const data = await response.json();
        if (data && data.data) {
          setLoginMember(data.data);
        } else {
          setNoLoginMember();
        }
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
        setNoLoginMember();
      }
    };

    fetchMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoginMemberPending) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-80 z-50">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-[#FFB230] animate-spin"></div>
          <div className="mt-4 text-center text-[#FFB230] font-medium">
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
      <LoginMemberContext.Provider value={loginMemberContextValue}>
        {children}
      </LoginMemberContext.Provider>
    </NextThemesProvider>
  );
}
