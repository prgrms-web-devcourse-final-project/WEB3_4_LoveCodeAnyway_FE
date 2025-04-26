"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { LoginMemberContext, useLoginMember } from "@/stores/auth/loginMember";
import client from "@/lib/backend/client";
import { PageLoading } from "@/components/PageLoading";
import { Navigation } from "@/components/layout/Navigation";
import { Notification } from "@/components/SseConnector";
import { AlarmResponse } from "@/types/alarm";
import { useRouter } from "next/navigation";

export function ClientLayout({
  children,
}: React.ComponentProps<typeof NextThemesProvider>) {
  const router = useRouter();
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

  const fetchMember = async () => {
    try {
      console.log('사용자 정보를 가져오는 중...');
      const res = await client.GET("/api/v1/members/me", {});
      
      if (res.error) {
        console.log('사용자 정보 가져오기 실패:', res.error);
        setNoLoginMember();
        return;
      }

      if (res.data && res.data.data) {
        console.log('사용자 정보 가져오기 성공:', res.data.data);
        setLoginMember({
          id: res.data.data.id,
          nickname: res.data.data.nickname,
          gender: res.data.data.gender,
          introduction: res.data.data.introduction,
          profilePictureUrl: res.data.data.profilePictureUrl,
          mannerScore: res.data.data.mannerScore,
        });
      } else {
        console.log('사용자 정보가 없습니다.');
        setNoLoginMember();
      }
    } catch (error) {
      console.error('사용자 정보 가져오기 중 오류 발생:', error);
      setNoLoginMember();
    }
  };

  const handleNotification = (notification: AlarmResponse) => {
    console.log('알림 수신:', notification);
    // 알림 클릭 시 관련 페이지로 이동
    if (notification.alarmType.startsWith('PARTY')) {
      router.push(`/parties/${notification.relId}`);
    }
  };

  useEffect(() => {
    console.log('ClientLayout 마운트, 사용자 정보를 가져옵니다.');
    fetchMember();
  }, []);

  if (isLoginMemberPending) {
    console.log('사용자 정보 로딩 중...');
    return <PageLoading isLoading={true} />;
  }

  console.log('현재 로그인 상태:', { isLogin, loginMember });

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LoginMemberContext value={loginMemberContextValue}>
        <Notification onNotification={handleNotification} />
        <Navigation />
        <main>{children}</main>
      </LoginMemberContext>
    </NextThemesProvider>
  );
}
