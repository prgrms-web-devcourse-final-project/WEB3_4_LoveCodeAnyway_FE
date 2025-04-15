import client from "@/lib/backend/client";
import type { components } from "@/lib/backend/apiV1/schema";

/**
 * 모임 목록 조회 API (무한 스크롤)
 * @param searchCondition 검색 조건
 * @param lastId 마지막 모임 ID
 * @param size 페이지 크기
 * @returns 모임 목록 응답
 */
export const getParties = async (
  searchCondition: components["schemas"]["PartySearchCondition"],
  lastId?: number,
  size?: number
) => {
  const response = await client.POST("/api/v1/parties/search", {
    params: {
      query: {
        lastId,
        size,
      },
    },
    body: {
      json: searchCondition,
    },
  });
  return response.data;
};

/**
 * 모임 상세 조회 API
 * @param id 모임 ID
 * @returns 모임 상세 정보 응답
 */
export const getPartyDetail = async (id: number) => {
  const response = await client.GET("/api/v1/parties/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 모임 등록 API
 * @param party 모임 등록 요청 데이터
 * @returns 등록된 모임 정보
 */
export const createParty = async (
  party: components["schemas"]["PartyRequest"]
) => {
  const response = await client.POST("/api/v1/parties", {
    body: {
      json: party,
    },
  });
  return response.data;
};

/**
 * 모임 수정 API
 * @param id 모임 ID
 * @param party 모임 수정 요청 데이터
 * @returns 수정된 모임 정보
 */
export const modifyParty = async (
  id: number,
  party: components["schemas"]["PartyRequest"]
) => {
  const response = await client.PUT("/api/v1/parties/{id}", {
    params: {
      path: {
        id,
      },
    },
    body: {
      json: party,
    },
  });
  return response.data;
};

/**
 * 모임 삭제 API
 * @param id 모임 ID
 */
export const deleteParty = async (id: number) => {
  const response = await client.DELETE("/api/v1/parties/{id}", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 모임 참가 신청 API
 * @param id 모임 ID
 */
export const applyParty = async (id: number) => {
  const response = await client.POST("/api/v1/parties/{id}/apply", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 모임 신청 승인 API
 * @param id 모임 ID
 * @param memberId 멤버 ID
 */
export const acceptPartyMember = async (id: number, memberId: number) => {
  const response = await client.POST("/api/v1/parties/{id}/accept/{memberId}", {
    params: {
      path: {
        id,
        memberId,
      },
    },
  });
  return response.data;
};

/**
 * 모임 참가 신청 취소 API
 * @param id 모임 ID
 */
export const cancelAppliedParty = async (id: number) => {
  const response = await client.DELETE("/api/v1/parties/{id}/cancel", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 메인 페이지용 모집 중 모임 12개 조회 API
 */
export const getMainParties = async () => {
  const response = await client.GET("/api/v1/parties/main-parties", {});
  return response.data;
};

/**
 * 참여한 모임 목록 조회 API
 * @param id 멤버 ID
 * @param page 페이지 번호
 * @param size 페이지 크기
 */
export const getJoinedParties = async (
  id: number,
  page?: number,
  size?: number
) => {
  const response = await client.GET("/api/v1/parties/joins/{id}", {
    params: {
      path: {
        id,
      },
      query: {
        page,
        size,
      },
    },
  });
  return response.data;
};

/**
 * 모임 실행 완료 API
 * @param id 모임 ID
 */
export const executeParty = async (id: number) => {
  const response = await client.PATCH("/api/v1/parties/{id}/executed", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};

/**
 * 모임 미실행 완료 API
 * @param id 모임 ID
 */
export const unexecuteParty = async (id: number) => {
  const response = await client.PATCH("/api/v1/parties/{id}/unexecuted", {
    params: {
      path: {
        id,
      },
    },
  });
  return response.data;
};
