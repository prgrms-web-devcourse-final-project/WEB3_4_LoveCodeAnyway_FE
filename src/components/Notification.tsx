"use client";

import { useState, useEffect, useContext } from "react";
import { useGlobalLoginMember } from "@/stores/auth/loginMember";
import client from "@/lib/backend/client";
import { AlarmResponse, AlarmType } from "@/types/alarm";
import { NotificationContext } from "@/app/ClientLayout";

interface PageDto<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  pageSize: number;
  currentPageNumber: number;
}

interface NotificationProps {
  onNewNotification?: (notification: AlarmResponse) => void;
}

export function Notification({ onNewNotification }: NotificationProps) {
  const { isLogin } = useGlobalLoginMember();
  const { setUnreadCount } = useContext(NotificationContext);
  const [alarms, setAlarms] = useState<AlarmResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const checkUnreadCount = async () => {
    if (!isLogin) return;
    
    try {
      const response = await client.GET("/alarms/count");
      if (response.data?.data) {
        const countData = response.data.data as { unreadCount: number };
        setUnreadCount(countData.unreadCount);
      }
    } catch (error) {
      console.error("알림 개수 조회 실패:", error);
    }
  };

  const handleNewNotification = (notification: AlarmResponse) => {
    setAlarms(prev => [notification, ...prev]);
    if (onNewNotification) {
      onNewNotification(notification);
    }
    if (!notification.readStatus) {
      setUnreadCount(prev => prev + 1);
    }
  };

  useEffect(() => {
    fetchAlarms(page);
    checkUnreadCount();
  }, [page, isLogin]);

  const markAsRead = async (id: number) => {
    try {
      await client.PATCH(`/alarms/${id}/read`, {});
      setAlarms(prev => 
        prev.map(alarm => 
          alarm.id === id ? { ...alarm, readStatus: true } : alarm
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await client.PATCH("/alarms/read-all", {});
      setAlarms(prev => prev.map(alarm => ({ ...alarm, readStatus: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("전체 알림 읽음 처리 실패:", error);
    }
  };

  const fetchAlarms = async (pageNumber: number) => {
    if (!isLogin) return;
    
    try {
      setLoading(true);
      const response = await client.GET("/alarms", {
        params: {
          page: pageNumber,
          size: 10,
        },
      });

      console.log("알림 목록:", response.data);
      
      if (response.data?.data) {
        const pageData = response.data.data as PageDto<AlarmResponse>;
        setAlarms(pageData.items || []);
        setTotalPages(pageData.totalPages || 0);
      }
    } catch (error) {
      console.error("알림 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (!isLogin) {
    return null;
  }

  return (
    <>
      <div className="max-h-96 overflow-y-auto pb-12">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB230]"></div>
          </div>
        ) : (
          <>
            {alarms.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                알림이 없습니다.
              </div>
            ) : (
              alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className={`px-4 py-3 border-b border-gray-100 ${
                    !alarm.readStatus ? "bg-[#FFE4C4]" : ""
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            alarm.alarmType === AlarmType.SYSTEM
                              ? "bg-orange-100 text-orange-600"
                              : alarm.alarmType === AlarmType.MESSAGE
                              ? "bg-blue-100 text-blue-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {alarm.alarmType === AlarmType.SYSTEM
                            ? "시스템"
                            : alarm.alarmType === AlarmType.MESSAGE
                            ? "메시지"
                            : alarm.alarmType === AlarmType.SUBSCRIBE
                            ? "모임"
                            : "기타"}
                        </span>
                        <span className="ml-auto text-xs text-gray-400">
                          {new Date(alarm.createdAt).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <h4 className="font-medium mt-1">{alarm.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{alarm.content}</p>

                      {alarm.readStatus && (
                        <div className="flex justify-end mt-1">
                          <button
                            onClick={() => markAsRead(alarm.id)}
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
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-4 py-2 border-t border-gray-100 bg-[#FFF8EC] rounded-b-lg">
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
    </>
  );
}
