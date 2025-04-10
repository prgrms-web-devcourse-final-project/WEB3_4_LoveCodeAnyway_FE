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
      <div className="flex-1 flex justify-center items-center text-muted-foreground">
        로딩중...
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
