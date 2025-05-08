"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useGlobalLoginMember } from "@/stores/auth/loginMember";

// 태그 타입 정의
interface Tag {
  id: number;
  name: string;
}

export default function SignupPage() {
  const { loginMember, isLogin } = useGlobalLoginMember();
  const router = useRouter();

  // API 기본 URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://api.ddobang.site";

  // 로그인 상태 확인 및 리다이렉트
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // API를 통해 로그인 상태 확인
        const response = await fetch(`${API_BASE_URL}/api/v1/members/me`, {
          credentials: "include", // 쿠키를 포함한 요청
        });

        // 응답이 성공(200)이면 로그인된 상태
        if (response.ok) {
          console.log("이미 로그인된 상태입니다. 마이페이지로 이동합니다.");
          router.replace("/my/profile");
          return;
        }
      } catch (error) {
        // 에러 발생 시 로그인되지 않은 것으로 간주 (회원가입 페이지 유지)
        console.error("로그인 상태 확인 중 오류 발생:", error);
      }
    };

    checkLoginStatus();
  }, [router, API_BASE_URL]);

  // 프로필 상태 관리
  const [profileImg, setProfileImg] = useState<string>("/default-profile.svg");
  const [nickname, setNickname] = useState<string>("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "BLIND" | "">("");
  const [introduction, setIntroduction] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  // 유효성 검사 상태
  const [isNicknameValid, setIsNicknameValid] = useState<boolean>(false);
  const [nicknameMessage, setNicknameMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 태그 목록 상태 (단일 리스트로 변경)
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 태그 가져오기
  useEffect(() => {
    const fetchTags = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/themes/tags`);

        if (!response.ok) {
          console.error(
            "태그 API 응답 에러:",
            response.status,
            response.statusText
          );
          setError("태그 데이터를 불러오는데 실패했습니다");
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        console.log("태그 데이터 응답:", data);

        // API 응답 구조에 맞게 처리 (모든 태그를 단일 배열로 변환)
        if (data && data.data) {
          // API 응답 구조에 따라 적절히 수정
          // 모든 카테고리의 태그를 하나의 배열로 합치거나,
          // 이미 단일 배열로 제공되는 경우 그대로 사용
          if (Array.isArray(data.data)) {
            setTags(data.data);
          } else if (typeof data.data === "object") {
            // 객체 형태로 카테고리별로 제공되는 경우 하나의 배열로 합치기
            const allTags: Tag[] = [];
            Object.values(data.data).forEach((categoryTags: any) => {
              if (Array.isArray(categoryTags)) {
                allTags.push(...categoryTags);
              }
            });
            setTags(allTags);
          } else {
            setTags([]);
          }
        } else {
          setTags([]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("태그 로딩 중 오류:", err);
        setError("태그 로딩 중 오류가 발생했습니다. 다시 시도해 주세요.");
        setIsLoading(false);
      }
    };

    fetchTags();
  }, [API_BASE_URL]);

  // 프로필 이미지 변경 핸들러
  const handleProfileImgChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 닉네임 중복 확인
  const checkNicknameDuplicate = async () => {
    if (nickname.length < 2 || nickname.length > 10) {
      setNicknameMessage("닉네임은 2~10자로 입력해주세요");
      setIsNicknameValid(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/members/check-nickname?nickname=${encodeURIComponent(
          nickname
        )}`,
        {
          credentials: "include",
        }
      );

      // API 호출 성공 시
      if (response.status === 200) {
        // 상태 코드가 200이면 사용 가능한 닉네임
        setNicknameMessage("사용 가능한 닉네임입니다");
        setIsNicknameValid(true);
      } else if (response.status === 409) {
        // 상태 코드가 409(Conflict)이면 중복된 닉네임
        setNicknameMessage("이미 사용 중인 닉네임입니다");
        setIsNicknameValid(false);
      } else {
        // 그 외 상태 코드는 오류로 처리
        const data = await response.json();
        setNicknameMessage(
          data.message || "닉네임 확인 중 오류가 발생했습니다"
        );
        setIsNicknameValid(false);
      }
    } catch (err) {
      setNicknameMessage("닉네임 확인 중 오류가 발생했습니다");
      setIsNicknameValid(false);
      console.error("닉네임 중복 확인 중 오류:", err);
    }
  };

  // 태그 선택 핸들러
  const handleTagToggle = (tagId: number) => {
    setSelectedTags((prev) => {
      if (prev.includes(tagId)) {
        return prev.filter((id) => id !== tagId);
      } else {
        if (prev.length >= 5) {
          alert("태그는 최대 5개까지 선택 가능합니다");
          return prev;
        }
        return [...prev, tagId];
      }
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 입력값 검증
    if (!nickname || !isNicknameValid) {
      alert("유효한 닉네임을 입력해주세요");
      return;
    }

    if (!gender) {
      alert("성별을 선택해주세요");
      return;
    }

    if (!introduction.trim()) {
      alert("자기소개를 입력해주세요");
      return;
    }

    if (selectedTags.length === 0) {
      alert("최소 1개 이상의 태그를 선택해주세요");
      return;
    }

    // 제출 중 플래그 설정
    setIsSubmitting(true);

    try {
      let profileImageUrl = null;

      // 프로필 이미지가 기본 이미지가 아닌 경우 업로드
      if (profileImg !== "/default-profile.svg") {
        // 이미지 데이터를 Blob으로 변환
        const response = await fetch(profileImg);
        const blob = await response.blob();
        const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

        // FormData 생성 및 파일 추가
        const formData = new FormData();
        formData.append("file", file);

        // 임의의 diaryId 생성 (현재 시간 기준)
        const randomDiaryId = Date.now().toString();

        // 이미지 업로드 API 호출
        const uploadResponse = await fetch(
          `${API_BASE_URL}/api/v1/upload/image/${randomDiaryId}`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        if (!uploadResponse.ok) {
          throw new Error("이미지 업로드에 실패했습니다");
        }

        const uploadData = await uploadResponse.json();
        profileImageUrl = uploadData.data.imageUrl;
      }

      // API 요청 데이터
      const signupData = {
        nickname,
        gender,
        introduction,
        tags: selectedTags,
        profilePictureUrl: profileImageUrl,
      };

      const response = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "회원가입에 실패했습니다");
      }

      const data = await response.json();

      // 회원가입 성공 시 브라우저 기록 삭제 및 홈페이지로 리다이렉트
      window.history.replaceState(null, "", "/");

      // 페이지 리로드를 통해 네비게이션 바의 로그인 상태 갱신
      window.location.href = "/";
      return;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다";
      alert(errorMessage);
      console.error("회원가입 중 오류:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#FFB130] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-700">
          <p className="text-red-500 mb-4 text-center">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-[#FFB130] text-white rounded-md hover:bg-[#E09D20] transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-center mb-2 text-white">
            프로필 설정
          </h1>
          <div className="w-20 h-1 bg-[#FFB130] mx-auto mb-6 rounded-full"></div>
          <p className="text-center text-gray-400 mb-8">
            방탈출 모임에서 사용할 프로필을 설정해주세요
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 프로필 이미지 영역 */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-36 h-36 mb-4">
                <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-700 border-4 border-[#FFB130] shadow-lg">
                  <Image
                    src={profileImg}
                    alt="프로필 이미지"
                    width={144}
                    height={144}
                    className="object-cover w-full h-full"
                  />
                </div>
                <label
                  htmlFor="profile-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#FFB130] rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-[#E09D20] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="white"
                    width="18"
                    height="18"
                  >
                    <path d="M12 4V20M4 12H20" strokeWidth="2" stroke="white" />
                  </svg>
                </label>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImgChange}
                />
              </div>
              <p className="text-sm text-gray-400">
                프로필 사진을 등록해주세요 (선택사항)
              </p>
            </div>

            {/* 닉네임 입력 */}
            <div className="bg-gray-700 p-6 rounded-xl">
              <label className="block text-white font-semibold mb-3 text-lg">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setIsNicknameValid(false);
                  }}
                  placeholder="닉네임을 입력해주세요"
                  className={`flex-1 px-4 py-3 border rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    isNicknameValid
                      ? "border-green-500 focus:ring-green-700"
                      : "border-gray-600 focus:ring-[#FFB130] focus:border-[#FFB130]"
                  }`}
                  minLength={2}
                  maxLength={10}
                  required
                />
                <button
                  type="button"
                  onClick={checkNicknameDuplicate}
                  className="px-5 py-3 bg-[#FFB130] text-white rounded-lg font-medium hover:bg-[#E09D20] transition-colors shadow-md"
                >
                  중복확인
                </button>
              </div>
              {nicknameMessage && (
                <p
                  className={`mt-2 text-sm ${
                    isNicknameValid ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {nicknameMessage}
                </p>
              )}
            </div>

            {/* 성별 선택 */}
            <div className="bg-gray-700 p-6 rounded-xl">
              <label className="block text-white font-semibold mb-3 text-lg">
                성별 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      gender === "MALE"
                        ? "border-[#FFB130] bg-gray-800"
                        : "border-gray-500"
                    }`}
                  >
                    {gender === "MALE" && (
                      <div className="w-3 h-3 rounded-full bg-[#FFB130]"></div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    checked={gender === "MALE"}
                    onChange={() => setGender("MALE")}
                    className="hidden"
                    required
                  />
                  <span
                    className={`group-hover:text-[#FFB130] transition-colors ${
                      gender === "MALE"
                        ? "text-[#FFB130] font-medium"
                        : "text-gray-300"
                    }`}
                  >
                    남성
                  </span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      gender === "FEMALE"
                        ? "border-[#FFB130] bg-gray-800"
                        : "border-gray-500"
                    }`}
                  >
                    {gender === "FEMALE" && (
                      <div className="w-3 h-3 rounded-full bg-[#FFB130]"></div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    checked={gender === "FEMALE"}
                    onChange={() => setGender("FEMALE")}
                    className="hidden"
                  />
                  <span
                    className={`group-hover:text-[#FFB130] transition-colors ${
                      gender === "FEMALE"
                        ? "text-[#FFB130] font-medium"
                        : "text-gray-300"
                    }`}
                  >
                    여성
                  </span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                      gender === "BLIND"
                        ? "border-[#FFB130] bg-gray-800"
                        : "border-gray-500"
                    }`}
                  >
                    {gender === "BLIND" && (
                      <div className="w-3 h-3 rounded-full bg-[#FFB130]"></div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="gender"
                    value="BLIND"
                    checked={gender === "BLIND"}
                    onChange={() => setGender("BLIND")}
                    className="hidden"
                  />
                  <span
                    className={`group-hover:text-[#FFB130] transition-colors ${
                      gender === "BLIND"
                        ? "text-[#FFB130] font-medium"
                        : "text-gray-300"
                    }`}
                  >
                    공개안함
                  </span>
                </label>
              </div>
            </div>

            {/* 자기소개 입력 */}
            <div className="bg-gray-700 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-white font-semibold text-lg">
                  자기소개 <span className="text-red-500">*</span>
                </label>
                <span className="text-sm text-gray-400 font-medium">
                  {introduction.length}/200
                </span>
              </div>
              <textarea
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                placeholder="자기소개를 입력하세요"
                className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-gray-300 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB130] focus:border-[#FFB130] transition-all"
                maxLength={200}
                rows={4}
                required
              ></textarea>
              <p className="text-xs text-gray-400 mt-2">
                방탈출 모임에서 자신을 소개할 수 있는 내용을 작성해보세요
              </p>
            </div>

            {/* 태그 선택 영역 */}
            <div className="bg-gray-700 p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">
                  나를 표현하는 태그
                </h2>
                <span
                  className={`text-sm font-medium ${
                    selectedTags.length >= 5 ? "text-red-400" : "text-[#FFB130]"
                  }`}
                >
                  {selectedTags.length}/5개 선택
                </span>
              </div>

              {/* 태그 목록을 단일 리스트로 렌더링 */}
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTags.includes(tag.id)
                        ? "bg-[#FFB130] text-white shadow-md"
                        : "bg-gray-600 text-gray-300 hover:bg-gray-500"
                    }`}
                  >
                    #{tag.name}
                  </button>
                ))}
              </div>

              {tags.length === 0 && !isLoading && (
                <p className="text-center text-gray-400 py-4">
                  태그 정보가 없습니다
                </p>
              )}

              <p className="text-xs text-gray-400 mt-2">
                나의 성격, 취향, 플레이 스타일 등을 표현할 수 있는 태그를
                선택해주세요 (최대 5개)
              </p>
            </div>

            {/* 등록 버튼 */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-white rounded-xl text-lg font-bold transition-all ${
                  isSubmitting
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#FFB130] hover:bg-[#E09D20] shadow-lg hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    처리 중...
                  </div>
                ) : (
                  "프로필 등록 완료"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
