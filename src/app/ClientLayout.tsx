"use client";

import { useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LoginMemberContext, useLoginMember } from "@/stores/auth/loginMember";
import client from "@/lib/backend/client";
import { Navigation } from "@/components/Navigation";
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
      <LoginMemberContext value={loginMemberContextValue}>
        <main>{children}</main>
      </LoginMemberContext>
    </NextThemesProvider>
  );
}
