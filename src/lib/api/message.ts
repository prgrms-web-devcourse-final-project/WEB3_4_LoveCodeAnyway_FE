import client from "@/lib/backend/client";
import type { components } from "@/lib/backend/apiV1/schema";

/**
 * 메시지 전송 API
 * @param message 메시지 전송 요청 데이터
 * @returns 전송된 메시지 정보
 */
export const sendMessage = async (
  message: components["schemas"]["MessageRequestDto"]
) => {
  const response = await client.POST("/messages", {
    body: {
      json: message,
    },
  });
  return response.data;
};

/**
 * 메시지 상세 조회 API
 * @param id 메시지 ID
 * @returns 메시지 상세 정보
 */
export const getMessage = async (id: number) => {
  const response = await client.GET("/messages/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 메시지 삭제 API
 * @param id 메시지 ID
 */
export const deleteMessage = async (id: number) => {
  const response = await client.DELETE("/messages/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 보낸 메시지 목록 조회 API
 * @param cursor 커서
 * @param size 페이지 크기
 * @returns 보낸 메시지 목록
 */
export const getSentMessages = async (cursor?: string, size?: number) => {
  const response = await client.GET("/messages/sent", {
    params: {
      query: {
        cursor,
        size,
      },
    },
  });
  return response.data;
};

/**
 * 받은 메시지 목록 조회 API
 * @param cursor 커서
 * @param size 페이지 크기
 * @returns 받은 메시지 목록
 */
export const getReceivedMessages = async (cursor?: string, size?: number) => {
  const response = await client.GET("/messages/received", {
    params: {
      query: {
        cursor,
        size,
      },
    },
  });
  return response.data;
};

/**
 * 메시지 읽음 처리 API
 * @param id 메시지 ID
 * @returns 읽음 처리된 메시지 정보
 */
export const updateReadStatus = async (id: number) => {
  const response = await client.PATCH("/messages/{id}/read", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};
