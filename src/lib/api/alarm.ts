import client from "@/lib/backend/client";
import type { components } from "@/lib/backend/apiV1/schema";

/**
 * 알림 목록 조회 API
 * @param pageable 페이징 정보
 * @returns 알림 목록 응답
 */
export const getAlarms = async (
  pageable: components["schemas"]["Pageable"]
) => {
  const response = await client.GET("/alarms", {
    params: {
      query: {
        pageable,
      },
    },
  });
  return response.data;
};

/**
 * 알림 상세 조회 API
 * @param id 알림 ID
 * @returns 알림 상세 정보 응답
 */
export const getAlarm = async (id: number) => {
  const response = await client.GET("/alarms/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 알림 생성 API (관리자시스템용)
 * @param alarm 알림 생성 요청 데이터
 * @returns 생성된 알림 정보
 */
export const createAlarm = async (
  alarm: components["schemas"]["AlarmCreateRequest"]
) => {
  const response = await client.POST("/alarms", {
    body: {
      json: alarm,
    },
  });
  return response.data;
};

/**
 * 알림 삭제 API
 * @param id 알림 ID
 */
export const deleteAlarm = async (id: number) => {
  const response = await client.DELETE("/alarms/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 알림 읽음 처리 API
 * @param id 알림 ID
 * @returns 읽음 처리된 알림 정보
 */
export const markAsRead = async (id: number) => {
  const response = await client.PATCH("/alarms/{id}/read", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 모든 알림 읽음 처리 API
 * @returns 읽음 처리된 알림 개수
 */
export const markAllAsRead = async () => {
  const response = await client.PATCH("/alarms/read-all", {});
  return response.data;
};

/**
 * 알림 SSE 구독 API
 * @returns SSE 연결 (Server-Sent Events)
 */
export const subscribeAlarm = async () => {
  const response = await client.GET("/alarms/subscribe", {});
  return response.data;
};

/**
 * 알림 개수 조회 API
 * @returns 전체 및 읽지 않은 알림 개수
 */
export const getAlarmCounts = async () => {
  const response = await client.GET("/alarms/count", {});
  return response.data;
};
