export const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("API_URL is not defined in environment variables");
}

export const API_ENDPOINTS = {
  // 인증 관련
  LOGIN: `${API_URL}/api/v1/auth/login`,
  SIGNUP: `${API_URL}/api/v1/auth/signup`,
  LOGOUT: `${API_URL}/api/v1/auth/logout`,

  // 사용자 관련
  USER_PROFILE: `${API_URL}/api/v1/users/profile`,
  USER_MESSAGES: `${API_URL}/api/v1/users/messages`,

  // 테마 관련
  THEMES: `${API_URL}/api/v1/themes`,
  THEME_DETAIL: (id: string) => `${API_URL}/api/v1/themes/${id}`,

  // 모임 관련
  MEETINGS: `${API_URL}/api/v1/meetings`,
  MEETING_DETAIL: (id: string) => `${API_URL}/api/v1/meetings/${id}`,

  // 태그 관련
  TAGS: `${API_URL}/api/v1/tags`,
} as const;
