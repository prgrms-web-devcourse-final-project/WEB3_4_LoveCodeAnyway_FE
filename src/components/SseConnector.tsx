"use client";

import { useEffect, useRef, useContext } from 'react';
import { useGlobalLoginMember } from "@/stores/auth/loginMember";
import { AlarmResponse, AlarmType } from "@/types/alarm";
import { NotificationContext } from "@/app/ClientLayout";

interface NotificationProps {
  onNotification?: (notification: AlarmResponse) => void;
}

export const Notification = ({ onNotification }: NotificationProps) => {
  const { loginMember, isLogin } = useGlobalLoginMember();
  const { setUnreadCount } = useContext(NotificationContext);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connectSSE = () => {
    console.log('SSE 연결 시도 - 현재 로그인 상태:', { isLogin, loginMember });
    
    if (!loginMember?.id) {
      console.log('SSE 연결 실패: 로그인된 사용자가 없습니다.');
      return;
    }

    if (eventSourceRef.current) {
      console.log('기존 SSE 연결을 종료합니다.');
      eventSourceRef.current.close();
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const sseUrl = `${apiUrl}/alarms/subscribe`;

    console.log('SSE 연결을 시도합니다...', { sseUrl });
    
    const eventSource = new EventSource(sseUrl, { withCredentials: true });
    eventSourceRef.current = eventSource;

    // 연결 성공 이벤트 리스너
    eventSource.addEventListener('connect', (event) => {
      console.log('SSE 연결 확인 메시지:', event.data);
    });

    // 알림 이벤트 리스너
    eventSource.addEventListener('alarm', (event) => {
      try {
        const notification: AlarmResponse = JSON.parse(event.data);
        console.log('새로운 알림 수신:', notification);
        if (onNotification) {
          onNotification(notification);
        }
      } catch (error) {
        console.error('알림 처리 중 오류 발생:', error);
        console.error('원본 데이터:', event.data);
      }
    });

    // 에러 처리
    eventSource.onerror = (error) => {
      console.error('SSE 연결 오류:', error);
      eventSource.close();
      eventSourceRef.current = null;
      
      console.log('3초 후 SSE 재연결을 시도합니다...');
      setTimeout(connectSSE, 3000);
    };
  };

  const getNotificationIcon = (alarmType: AlarmType) => {
    switch (alarmType) {
      case AlarmType.PARTY_INVITATION:
        return '/icons/party-invitation.png';
      case AlarmType.PARTY_ACCEPTED:
        return '/icons/party-accepted.png';
      case AlarmType.PARTY_REJECTED:
        return '/icons/party-rejected.png';
      case AlarmType.PARTY_CANCELLED:
        return '/icons/party-cancelled.png';
      case AlarmType.PARTY_REMINDER:
        return '/icons/party-reminder.png';
      case AlarmType.MESSAGE:
        return '/icons/message.png';
      case AlarmType.SUBSCRIBE:
        return '/icons/subscribe.png';
      default:
        return '/icons/system.png';
    }
  };

  const handleNotification = (notification: AlarmResponse) => {
    console.log('알림 처리 시작:', notification);
    
    // 브라우저 알림 권한 확인 및 표시
    if (window.Notification.permission === 'granted') {
      console.log('브라우저 알림을 표시합니다.');
      new window.Notification(notification.title, {
        body: notification.content,
        icon: getNotificationIcon(notification.alarmType)
      });
    } else {
      console.log('브라우저 알림 권한이 없습니다.');
    }

    // 읽지 않은 알림 개수 업데이트
    if (!notification.readStatus) {
      setUnreadCount(prev => prev + 1);
    }

    // 상위 컴포넌트로 알림 데이터 전달
    if (onNotification) {
      console.log('상위 컴포넌트에 알림을 전달합니다.');
      onNotification(notification);
    }
  };

  useEffect(() => {
    console.log('Notification 컴포넌트 마운트 - 현재 로그인 상태:', { isLogin, loginMember });
    
    // 브라우저 알림 권한 요청
    if (window.Notification.permission === 'default') {
      console.log('브라우저 알림 권한을 요청합니다.');
      window.Notification.requestPermission();
    }

    // 로그인 상태일 때만 SSE 연결
    if (isLogin && loginMember?.id) {
      console.log('로그인 상태 확인, SSE 연결을 시작합니다.');
      connectSSE();
    } else {
      console.log('로그인되지 않은 상태입니다. SSE 연결을 하지 않습니다.');
    }

    // 컴포넌트 언마운트 시 연결 정리
    return () => {
      console.log('Notification 컴포넌트 언마운트, SSE 연결을 종료합니다.');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [isLogin, loginMember?.id]);

  // 로그인 상태가 변경될 때마다 SSE 연결 상태 확인
  useEffect(() => {
    console.log('로그인 상태 변경 감지:', { isLogin, loginMember });
    if (isLogin && loginMember?.id) {
      connectSSE();
    }
  }, [isLogin, loginMember?.id]);

  // 이 컴포넌트는 UI를 렌더링하지 않음
  return null;
};
