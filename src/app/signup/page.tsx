"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 태그 타입 정의
interface Tag {
  id: number;
  name: string;
}

interface TagsByCategory {
  personality: Tag[];
  playstyle: Tag[];
  preference: Tag[];
  experience: Tag[];
}

export default function SignupPage() {
  const router = useRouter();

  // 프로필 상태 관리
  const [profileImg, setProfileImg] = useState<string>(
    "/images/default-profile.svg"
  );
  const [nickname, setNickname] = useState<string>("");
  const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
  const [introduction, setIntroduction] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  // 유효성 검사 상태
  const [isNicknameValid, setIsNicknameValid] = useState<boolean>(false);
  const [nicknameMessage, setNicknameMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 태그 목록 상태
  const [tags, setTags] = useState<TagsByCategory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 태그 가져오기
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch("/api/v1/tags");
        const data = await response.json();

        if (data.success) {
          setTags(data.data.tags);
        } else {
          setError("태그 로딩 실패: " + data.message);
        }
      } catch (err) {
        setError("태그 로딩 중 오류 발생");
        console.error("태그 로딩 중 오류:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

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
        `/api/v1/members/nick-name?nickname=${encodeURIComponent(nickname)}`
      );
      const data = await response.json();

      if (data.success) {
        if (data.data.isAvailable) {
          setNicknameMessage("사용 가능한 닉네임입니다");
          setIsNicknameValid(true);
        } else {
          setNicknameMessage("이미 사용 중인 닉네임입니다");
          setIsNicknameValid(false);
        }
      } else {
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

    if (selectedTags.length === 0) {
      alert("최소 1개 이상의 태그를 선택해주세요");
      return;
    }

    // API 요청 데이터
    const signupData = {
      nickname,
      gender,
      introduction,
      tagIds: selectedTags,
      profileImg:
        profileImg !== "/images/default-profile.svg" ? profileImg : null,
    };

    // 제출 중 플래그 설정
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
      });

      const data = await response.json();

      if (data.success) {
        // 회원가입 성공 시 홈페이지로 리다이렉트
        router.push("/");
      } else {
        alert(data.message || "회원가입 중 오류가 발생했습니다");
      }
    } catch (err) {
      alert("회원가입 중 오류가 발생했습니다");
      console.error("회원가입 중 오류:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 태그 카테고리별 렌더링 함수
  const renderTagCategory = (categoryName: string, categoryTags: Tag[]) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{categoryName}</h3>
      <div className="flex flex-wrap gap-2">
        {categoryTags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => handleTagToggle(tag.id)}
            className={`py-1 px-3 rounded-full text-sm ${
              selectedTags.includes(tag.id)
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700"
            } transition-colors`}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        로딩 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-center mb-6">프로필 설정</h1>
      <p className="text-center text-gray-600 mb-10">
        방탈출 모임에서 사용할 프로필을 설정해주세요
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 프로필 이미지 영역 */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-32 h-32 mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              <Image
                src={profileImg}
                alt="프로필 이미지"
                width={128}
                height={128}
                className="object-cover w-full h-full"
              />
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                width="16"
                height="16"
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
        </div>

        {/* 닉네임 입력 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            닉네임
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              minLength={2}
              maxLength={10}
            />
            <button
              type="button"
              onClick={checkNicknameDuplicate}
              className="px-4 py-2 bg-gray-800 text-white rounded-md"
            >
              중복확인
            </button>
          </div>
          {nicknameMessage && (
            <p
              className={`mt-1 text-sm ${
                isNicknameValid ? "text-green-500" : "text-red-500"
              }`}
            >
              {nicknameMessage}
            </p>
          )}
        </div>

        {/* 성별 선택 */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">성별</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={gender === "MALE"}
                onChange={() => setGender("MALE")}
                className="mr-2"
              />
              남성
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={gender === "FEMALE"}
                onChange={() => setGender("FEMALE")}
                className="mr-2"
              />
              여성
            </label>
          </div>
        </div>

        {/* 자기소개 입력 */}
        <div className="mb-8">
          <label className="block text-gray-700 font-semibold mb-2">
            자기소개{" "}
            <span className="text-gray-500 text-sm">
              (선택사항, 최대 200자)
            </span>
          </label>
          <textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            placeholder="자신을 소개해주세요"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={200}
            rows={4}
          ></textarea>
          <p className="text-right text-gray-500 text-sm mt-1">
            {introduction.length}/200
          </p>
        </div>

        {/* 태그 선택 영역 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">나를 표현하는 태그</h2>
            <span className="text-gray-500 text-sm">
              {selectedTags.length}/5개 선택
            </span>
          </div>

          {tags && (
            <>
              {renderTagCategory("성격", tags.personality)}
              {renderTagCategory("플레이 스타일", tags.playstyle)}
              {renderTagCategory("선호 테마", tags.preference)}
              {renderTagCategory("경험 수준", tags.experience)}
            </>
          )}
        </div>

        {/* 등록 버튼 */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 text-white rounded-md text-lg font-semibold ${
              isSubmitting ? "bg-gray-400" : "bg-primary"
            }`}
          >
            {isSubmitting ? "처리 중..." : "등록 완료"}
          </button>
        </div>
      </form>
    </div>
  );
}
