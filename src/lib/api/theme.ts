import client from "@/lib/backend/client";
import type { components } from "@/lib/backend/apiV1/schema";

/**
 * 필터 기반 테마 다건 조회 API
 * @param filterRequest 필터 조건
 * @param page 페이지 번호
 * @param size 페이지 크기
 * @returns 테마 목록 응답
 */
export const getThemesWithFilter = async (
  filterRequest: components["schemas"]["ThemeFilterRequest"],
  page?: number,
  size?: number
) => {
  const response = await client.POST("/api/v1/themes", {
    params: {
      query: {
        page,
        size,
      },
    },
    body: {
      json: filterRequest,
    },
  });
  return response.data;
};

/**
 * 테마 상세 조회 API
 * @param id 테마 ID
 * @returns 테마 상세 정보 응답
 */
export const getThemeDetail = async (id: number) => {
  const response = await client.GET("/api/v1/themes/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 태그 목록 조회 API
 * @returns 태그 목록 응답
 */
export const getAllThemeTags = async () => {
  const response = await client.GET("/api/v1/themes/tags", {});
  return response.data;
};

/**
 * 모임 등록 전용 테마 검색 API
 * @param keyword 검색 키워드
 * @returns 테마 목록 응답
 */
export const getThemesForPartySearch = async (keyword: string) => {
  const response = await client.GET("/api/v1/themes/search-for-party", {
    params: {
      query: {
        keyword,
      },
    },
  });
  return response.data;
};

/**
 * 방탈출 일지 작성 전용 테마 검색 API
 * @param keyword 검색 키워드
 * @returns 테마 목록 응답
 */
export const getThemesForDiarySearch = async (keyword: string) => {
  const response = await client.GET("/api/v1/themes/search-for-diary", {
    params: {
      query: {
        keyword,
      },
    },
  });
  return response.data;
};

/**
 * 태그별 인기 테마 Top 10 조회 API
 * @param tagName 태그 이름
 * @returns 인기 테마 목록 응답
 */
export const getPopularThemes = async (tagName: string) => {
  const response = await client.GET("/api/v1/themes/popular", {
    params: {
      query: {
        tagName,
      },
    },
  });
  return response.data;
};

/**
 * 태그별 최신 테마 Top 10 조회 API
 * @param tagName 태그 이름
 * @returns 최신 테마 목록 응답
 */
export const getNewestThemes = async (tagName: string) => {
  const response = await client.GET("/api/v1/themes/newest", {
    params: {
      query: {
        tagName,
      },
    },
  });
  return response.data;
};
