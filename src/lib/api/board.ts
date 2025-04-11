import client from "@/lib/backend/client";
import type { components } from "@/lib/backend/apiV1/schema";

/**
 * 나의 문의 목록 조회 API
 * @param type 문의 유형
 * @param keyword 검색 키워드
 * @param page 페이지 번호
 * @param size 페이지 크기
 * @returns 문의 목록 응답
 */
export const getMyPosts = async (
  type?: "QNA" | "REPORT" | "THEME",
  keyword?: string,
  page?: number,
  size?: number
) => {
  const response = await client.GET("/api/v1/boards", {
    params: {
      query: {
        type,
        keyword,
        page,
        size,
      },
    },
  });
  return response.data;
};

/**
 * 문의 상세 조회 API
 * @param id 문의 ID
 * @returns 문의 상세 정보 응답
 */
export const getPostDetail = async (id: number) => {
  const response = await client.GET("/api/v1/boards/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 문의 등록 API
 * @param post 문의 등록 요청 데이터
 * @returns 등록된 문의 정보
 */
export const createPost = async (
  post: components["schemas"]["PostRequest"]
) => {
  const response = await client.POST("/api/v1/boards", {
    body: {
      json: post,
    },
  });
  return response.data;
};

/**
 * 문의 수정 API
 * @param id 문의 ID
 * @param post 문의 수정 요청 데이터
 * @returns 수정된 문의 정보
 */
export const modifyPost = async (
  id: number,
  post: components["schemas"]["PostRequest"]
) => {
  const response = await client.PUT("/api/v1/boards/{id}", {
    params: {
      path: {
        id,
      },
    },
    body: {
      json: post,
    },
  });
  return response.data;
};

/**
 * 문의 삭제 API
 * @param id 문의 ID
 */
export const deletePost = async (id: number) => {
  const response = await client.DELETE("/api/v1/boards/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};
