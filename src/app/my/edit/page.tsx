"use client";

import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { LoginMemberContext } from "@/stores/auth/loginMember";
import { useRouter } from "next/navigation";

// 관심 태그 목록
const AVAILABLE_TAGS = [
  "장치충",
  "조용한 편",
  "스토리重視",
  "방린이",
  "방탈출 고수",
  "리더 선호",
  "퍼즐러",
  "공포 선호",
  "공포 비선호",
  "대화 많은 편",
  "관찰력 좋음",
  "추리 좋아함",
  "액션파",
  "감성파",
];

export default function ProfileEditPage() {
  const router = useRouter();
  const { loginMember } = useContext(LoginMemberContext);

  // 프로필 데이터 상태
  const [profile, setProfile] = useState({
    nickname: "",
    introduction: "",
    gender: "NOT_SPECIFIED",
    tags: [] as string[],
    profilePictureUrl: "",
  });

  // 파일 업로드 관련 상태
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 상태 관리
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nicknameDuplicate, setNicknameDuplicate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 페이지 로드 시 사용자 정보 가져오기
  useEffect(() => {
    if (!loginMember?.id) {
      router.push("/login");
      return;
    }

    // 현재 사용자 정보 설정
    setProfile({
      nickname: loginMember.nickname || "",
      introduction: loginMember.introduction || "",
      gender: loginMember.gender || "NOT_SPECIFIED",
      tags: loginMember.tags || [],
      profilePictureUrl: loginMember.profilePictureUrl || "",
    });

    if (loginMember.profilePictureUrl) {
      setImagePreview(loginMember.profilePictureUrl);
    }

    setIsLoading(false);
  }, [loginMember, router]);

  // 이미지 업로드 핸들러
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);

      // 파일 미리보기 생성
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setImagePreview(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 제거 핸들러
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setProfile({ ...profile, profilePictureUrl: "" });
  };

  // 닉네임 중복 확인
  const checkNicknameDuplicate = async () => {
    if (!profile.nickname) {
      setError("닉네임을 입력해주세요");
      return;
    }

    if (profile.nickname === loginMember?.nickname) {
      setNicknameDuplicate(false);
      return;
    }

    try {
      setIsLoading(true);
      // 여기서는 실제 API 호출 대신 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 중복 검사 로직 (가상)
      const isDuplicate = Math.random() > 0.8;
      setNicknameDuplicate(isDuplicate);

      if (isDuplicate) {
        setError("이미 사용 중인 닉네임입니다");
      } else {
        setSuccess("사용 가능한 닉네임입니다");
        setTimeout(() => setSuccess(null), 2000);
      }
    } catch (err) {
      setError("닉네임 중복 확인 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile.nickname) {
      setError("닉네임을 입력해주세요");
      return;
    }

    if (nicknameDuplicate) {
      setError("중복된 닉네임으로 변경할 수 없습니다");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // 여기서는 실제 API 호출 대신 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 성공 메시지 표시
      alert("프로필이 성공적으로 업데이트되었습니다");
      router.push("/my");
    } catch (err) {
      setError("프로필 업데이트 중 오류가 발생했습니다");
      setIsSubmitting(false);
    }
  };

  // 태그 토글 핸들러
  const toggleTag = (tag: string) => {
    if (profile.tags.includes(tag)) {
      setProfile({
        ...profile,
        tags: profile.tags.filter((t) => t !== tag),
      });
    } else if (profile.tags.length < 5) {
      setProfile({
        ...profile,
        tags: [...profile.tags, tag],
      });
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">프로필 수정</h1>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FFB230]"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* 성공 메시지 */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* 프로필 이미지 */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                {imagePreview ? (
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <Image
                      src={imagePreview}
                      alt="프로필 미리보기"
                      fill
                      sizes="128px"
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 bg-black bg-opacity-50 rounded-full p-1 text-white"
                      aria-label="이미지 제거"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <label className="px-4 py-2 bg-[#FFB230] text-white rounded-md cursor-pointer hover:bg-[#FFA000] transition-colors">
                이미지 업로드
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* 닉네임 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                닉네임 <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={profile.nickname}
                  onChange={(e) => {
                    setProfile({ ...profile, nickname: e.target.value });
                    setError(null);
                    setSuccess(null);
                  }}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFB230] focus:border-transparent"
                  placeholder="닉네임을 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={checkNicknameDuplicate}
                  disabled={
                    isLoading ||
                    !profile.nickname ||
                    profile.nickname === loginMember?.nickname
                  }
                  className={`px-4 py-2 rounded-md ${
                    isLoading ||
                    !profile.nickname ||
                    profile.nickname === loginMember?.nickname
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  중복확인
                </button>
              </div>
            </div>

            {/* 성별 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                성별
              </label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    checked={profile.gender === "MALE"}
                    onChange={() => setProfile({ ...profile, gender: "MALE" })}
                    className="h-4 w-4 text-[#FFB230] focus:ring-[#FFB230]"
                  />
                  <span className="ml-2">남성</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    checked={profile.gender === "FEMALE"}
                    onChange={() =>
                      setProfile({ ...profile, gender: "FEMALE" })
                    }
                    className="h-4 w-4 text-[#FFB230] focus:ring-[#FFB230]"
                  />
                  <span className="ml-2">여성</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="NOT_SPECIFIED"
                    checked={profile.gender === "NOT_SPECIFIED"}
                    onChange={() =>
                      setProfile({ ...profile, gender: "NOT_SPECIFIED" })
                    }
                    className="h-4 w-4 text-[#FFB230] focus:ring-[#FFB230]"
                  />
                  <span className="ml-2">선택 안함</span>
                </label>
              </div>
            </div>

            {/* 자기소개 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                자기소개
              </label>
              <textarea
                value={profile.introduction}
                onChange={(e) =>
                  setProfile({ ...profile, introduction: e.target.value })
                }
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFB230] focus:border-transparent"
                placeholder="자신을 소개해 주세요"
              />
              <p className="text-sm text-gray-500 text-right">
                {profile.introduction.length}/200
              </p>
            </div>

            {/* 관심 태그 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                나를 표현하는 태그{" "}
                <span className="text-gray-500">(최대 5개)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      profile.tags.includes(tag)
                        ? "bg-[#FFB230] text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                    disabled={
                      profile.tags.length >= 5 && !profile.tags.includes(tag)
                    }
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                선택한 태그: {profile.tags.length}/5
              </p>
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="mr-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting || nicknameDuplicate}
                className={`px-6 py-2 rounded-md ${
                  isSubmitting || nicknameDuplicate
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#FFB230] text-white hover:bg-[#FFA000]"
                }`}
              >
                {isSubmitting ? "저장 중..." : "변경사항 저장"}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
