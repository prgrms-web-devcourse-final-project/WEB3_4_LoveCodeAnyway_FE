import client from "@/lib/backend/client";

/**
 * 파일 업로드 API
 * @param parentId 부모 ID
 * @param target 업로드 대상 유형
 * @param files 파일 목록
 * @returns 업로드 결과
 */
export const uploadFiles = async (
  parentId: number,
  target?: "PROFILE" | "DIARY" | "BOARD" | "NONE",
  files?: string[]
) => {
  const response = await client.POST("/api/v1/uploads/{parentId}", {
    params: {
      path: {
        parentId,
      },
      query: {
        target,
        files,
      },
    },
  });
  return response.data;
};

/**
 * 파일 삭제 API
 * @param id 파일 ID
 * @param target 삭제 대상 유형
 * @returns 삭제 결과
 */
export const deleteFile = async (
  id: number,
  target?: "PROFILE" | "DIARY" | "BOARD" | "NONE"
) => {
  const response = await client.DELETE("/api/v1/uploads/{id}", {
    params: {
      path: {
        id,
      },
      query: {
        target,
      },
    },
  });
  return response.data;
};
