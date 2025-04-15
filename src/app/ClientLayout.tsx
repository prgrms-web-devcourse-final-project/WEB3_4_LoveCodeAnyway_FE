"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LoginMemberContext, useLoginMember } from "@/stores/auth/loginMember";
import client from "@/lib/backend/client";
import { PageLoading } from "@/components/PageLoading";

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
    return <PageLoading isLoading={true} />;
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
