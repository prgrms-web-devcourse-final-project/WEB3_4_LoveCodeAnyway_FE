import client from "@/lib/backend/client";
import type { components } from "@/lib/backend/apiV1/schema";

/**
 * 탈출일지 다건조회 API
 * @param filterRequest 필터 조건
 * @param page 페이지 번호
 * @param pageSize 페이지 크기
 * @returns 탈출일지 목록 응답
 */
export const getAllDiaries = async (
  filterRequest: components["schemas"]["DiaryFilterRequest"],
  page?: number,
  pageSize?: number
) => {
  const response = await client.POST("/api/v1/diaries/list", {
    params: {
      query: {
        page,
        pageSize,
      },
    },
    body: {
      json: filterRequest,
    },
  });
  return response.data;
};

/**
 * 탈출일지 월별 다건조회 API
 * @param year 연도
 * @param month 월
 * @returns 해당 월의 탈출일지 목록
 */
export const getDiariesByMonth = async (year?: number, month?: number) => {
  const response = await client.GET("/api/v1/diaries", {
    params: {
      query: {
        year,
        month,
      },
    },
  });
  return response.data;
};

/**
 * 탈출일지 단건조회 API
 * @param id 탈출일지 ID
 * @returns 탈출일지 상세 정보
 */
export const getDiaryDetail = async (id: number) => {
  const response = await client.GET("/api/v1/diaries/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 탈출일지 등록 API
 * @param diary 탈출일지 등록 요청 데이터
 * @returns 등록된 탈출일지 정보
 */
export const createDiary = async (
  diary: components["schemas"]["DiaryRequestDto"]
) => {
  const response = await client.POST("/api/v1/diaries", {
    body: {
      json: diary,
    },
  });
  return response.data;
};

/**
 * 탈출일지 수정 API
 * @param id 탈출일지 ID
 * @param diary 탈출일지 수정 요청 데이터
 * @returns 수정된 탈출일지 정보
 */
export const modifyDiary = async (
  id: number,
  diary: components["schemas"]["DiaryRequestDto"]
) => {
  const response = await client.PUT("/api/v1/diaries/{id}", {
    params: {
      path: {
        id,
      },
    },
    body: {
      json: diary,
    },
  });
  return response.data;
};

/**
 * 탈출일지 삭제 API
 * @param id 탈출일지 ID
 */
export const deleteDiary = async (id: number) => {
  const response = await client.DELETE("/api/v1/diaries/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 탈출일지에서 테마 등록 API
 * @param theme 테마 등록 요청 데이터
 * @returns 등록된 테마 정보
 */
export const saveThemeForDiary = async (
  theme: components["schemas"]["ThemeForMemberRequest"]
) => {
  const response = await client.POST("/api/v1/diaries/theme", {
    body: {
      json: theme,
    },
  });
  return response.data;
};
