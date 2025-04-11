"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useContext, useEffect } from "react";
import { LoginMemberContext } from "@/stores/auth/loginMember";
import client from "@/lib/backend/client";
import { useRouter } from "next/navigation";
import { GetAlarmsResponse, Alarm } from "@/lib/backend/apiV1/schema";

export function Navigation({ activePage }: { activePage?: string }) {
  const router = useRouter();
  const { isLogin, loginMember, logout } = useContext(LoginMemberContext);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Alarm[]>([]);
  const [mounted, setMounted] = useState(false);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isLogin) {
      fetchNotifications();
      subscribeToNotifications();
    }
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isLogin]);

  const fetchNotifications = async () => {
    try {
      const response = await client.GET("/alarms");
      if (response.data?.data) {
        setNotifications(response.data.data.items || []);
      }
    } catch (error) {
      console.error("알림 목록 조회 실패:", error);
    }
  };

  const subscribeToNotifications = () => {
    const sse = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/alarms/subscribe`,
      {
        withCredentials: true,
      }
    );

    sse.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
    };

    sse.onerror = () => {
      sse.close();
    };

    setEventSource(sse);
  };

  const markAsRead = async (id: number) => {
    try {
      await client.PATCH(`/alarms/${id}/read`);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, readStatus: true }
            : notification
        )
      );
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await client.PATCH("/alarms/read-all");
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, readStatus: true }))
      );
    } catch (error) {
      console.error("전체 알림 읽음 처리 실패:", error);
    }
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isNotificationOpen) setIsNotificationOpen(false);
  };

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await client.DELETE("/api/v1/members/logout");
      logout();
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-black z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-12">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="도망"
                width={78}
                height={33}
                priority
              />
            </Link>
            <div className="flex space-x-6">
              <Link
                href="/themes"
                className={`${
                  activePage === "themes"
                    ? "text-[#FFD896]"
                    : "text-gray-300 hover:text-[#FFD896]"
                } text-sm font-medium`}
              >
                방탈출 테마
              </Link>
              <Link
                href="/parties"
                className={`${
                  activePage === "parties"
                    ? "text-[#FFD896]"
                    : "text-gray-300 hover:text-[#FFD896]"
                } text-sm font-medium`}
              >
                모임 탐색
              </Link>
              {isLogin && (
                <Link
                  href="/my/diary"
                  className={`${
                    activePage === "my-diary"
                      ? "text-[#FFD896]"
                      : "text-gray-300 hover:text-[#FFD896]"
                  } text-sm font-medium`}
                >
                  나의 탈출일지
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isLogin ? (
              <>
                <div className="relative">
                  <button
                    onClick={toggleNotification}
                    className="text-gray-300 hover:text-[#FFD896]"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {notifications.some((n) => !n.readStatus) && (
                      <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-[#FFF8EC] rounded-lg shadow-lg py-2 z-50">
                      <div className="flex items-center px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-[#FFB230] text-xl font-bold">
                            알림
                          </span>
                        </div>
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500">
                            알림이 없습니다.
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 border-b border-gray-100 ${
                                !notification.readStatus ? "bg-[#FFFCF7]" : ""
                              }`}
                            >
                              <div className="flex items-start">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        notification.alarmType === "SYSTEM"
                                          ? "bg-orange-100 text-orange-600"
                                          : notification.alarmType === "MESSAGE"
                                          ? "bg-blue-100 text-blue-600"
                                          : "bg-green-100 text-green-600"
                                      }`}
                                    >
                                      {notification.alarmType === "SYSTEM"
                                        ? "시스템"
                                        : notification.alarmType === "MESSAGE"
                                        ? "메시지"
                                        : notification.alarmType === "SUBSCRIBE"
                                        ? "구독"
                                        : "기타"}
                                    </span>
                                    <span className="ml-auto text-xs text-gray-400">
                                      {new Date(
                                        notification.createdAt
                                      ).toLocaleDateString("ko-KR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  <h4 className="font-medium mt-1">
                                    {notification.title}
                                  </h4>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {notification.content}
                                  </p>

                                  {!notification.readStatus && (
                                    <div className="flex justify-end mt-1">
                                      <button
                                        onClick={() =>
                                          markAsRead(notification.id)
                                        }
                                        className="text-[#FFB230] text-xs flex items-center"
                                      >
                                        <svg
                                          className="w-4 h-4 mr-1"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                        읽음
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="px-4 py-2 border-t border-gray-100">
                        <button
                          onClick={markAllAsRead}
                          className="flex items-center text-[#FFB230] text-sm font-medium"
                        >
                          <svg
                            className="w-5 h-5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          전체 읽음
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={toggleProfileMenu}
                    className="flex items-center space-x-2 hover:opacity-80"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden relative bg-gray-700 flex items-center justify-center">
                      {loginMember && (
                        <img
                          src={
                            loginMember.pofilePictureUrl ||
                            "/images/default-profile.png"
                          }
                          alt={loginMember.nickname || "프로필"}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-gray-300 text-sm">
                      {loginMember?.nickname || "사용자"}
                    </span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#FFE7B9] rounded-lg shadow-lg py-1 z-50">
                      <Link
                        href="/my"
                        className="block px-4 py-3 text-base font-medium text-gray-800 hover:bg-[#FFD896]"
                      >
                        마이페이지
                      </Link>
                      <Link
                        href="/my/diary"
                        className="block px-4 py-3 text-base font-medium text-gray-800 hover:bg-[#FFD896]"
                      >
                        탈출일지
                      </Link>
                      <Link
                        href="/my/history"
                        className="block px-4 py-3 text-base font-medium text-gray-800 hover:bg-[#FFD896]"
                      >
                        모임 히스토리
                      </Link>
                      <Link
                        href="/my/inquiry"
                        className="block px-4 py-3 text-base font-medium text-gray-800 hover:bg-[#FFD896]"
                      >
                        1:1 문의
                      </Link>
                      <div className="border-t border-[#FFD896]">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-3 text-base font-medium text-gray-800 hover:bg-[#FFD896]"
                        >
                          로그아웃
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-[#FFB230] text-white rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
