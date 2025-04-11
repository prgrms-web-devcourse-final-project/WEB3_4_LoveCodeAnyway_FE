import client from "@/lib/backend/client";

/**
 * 서브 지역 목록 조회 API
 * @param majorRegion 메인 지역 이름
 * @returns 서브 지역 목록 응답
 */
export const getSubRegionsByMajorRegion = async (majorRegion: string) => {
  const response = await client.GET("/api/v1/regions", {
    params: {
      query: {
        majorRegion,
      },
    },
  });
  return response.data;
};
