import client from "@/lib/backend/client";

/**
 * 내 정보 조회 API
 * @returns 내 정보 응답
 */
export const getMyInfo = async () => {
  const response = await client.GET("/api/v1/members/me", {});
  return response.data;
};

/**
 * 로그아웃 API
 */
export const logout = async () => {
  const response = await client.DELETE("/api/v1/members/logout", {});
  return response.data;
};
