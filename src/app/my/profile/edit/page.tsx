'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useGlobalLoginMember } from '@/stores/auth/loginMember'
import { useRouter } from 'next/navigation'
import client from '@/lib/backend/client'

interface TagType {
    id: number
    name: string
}

export default function ProfileEditPage() {
    const router = useRouter()
    const { loginMember, setLoginMember } = useGlobalLoginMember()

    // 프로필 데이터 상태
    const [profile, setProfile] = useState({
        nickname: '',
        introduction: '',
        gender: 'NOT_SPECIFIED',
        tags: [] as string[],
        profilePictureUrl: '',
    })

    // 프로필 태그 ID 상태
    const [tagIds, setTagIds] = useState<number[]>([])
    // const [customTagInput, setCustomTagInput] = useState("");

    // 파일 업로드 관련 상태
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)

    // 상태 관리
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [nicknameDuplicate, setNicknameDuplicate] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [allTags, setAllTags] = useState<TagType[]>([])

    // 사용자 태그 조회
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const response = await client.GET('/api/v1/members/me/tags', {
                    credentials: 'include',
                })

                if (response.data?.data) {
                    const tagsData = response.data.data
                    // 타입 안전하게 변환
                    const processedTags: TagType[] = tagsData.map((tag: any) => ({
                        id: tag.id || 0, // undefined인 경우 기본값 제공
                        name: tag.name || '',
                    }))
                    setAllTags(processedTags)
                }
            } catch (err) {
                console.error('태그 로딩 중 오류:', err)
            }
        }

        fetchTags()
    }, [])

    // 페이지 로드 시 사용자 정보 가져오기
    useEffect(() => {
        if (!loginMember?.id) {
            router.push('/login')
            return
        }

        // 현재 사용자 정보 설정
        setProfile({
            nickname: loginMember.nickname || '',
            introduction: loginMember.introduction || '',
            gender: loginMember.gender || 'NOT_SPECIFIED',
            tags: loginMember.tags || [],
            profilePictureUrl: loginMember.profilePictureUrl || '',
        })

        // 태그 정보 가져오기
        const fetchUserTags = async () => {
            try {
                const response = await client.GET('/api/v1/members/me/tags', {
                    credentials: 'include',
                })

                if (response.data?.data) {
                    const userTags = response.data.data
                    setTagIds(userTags.map((tag: any) => tag.id))
                }
            } catch (err) {
                console.error('사용자 태그 로딩 중 오류:', err)
            }
        }

        fetchUserTags()

        if (loginMember.profilePictureUrl) {
            setImagePreview(loginMember.profilePictureUrl)
        }

        setIsLoading(false)
    }, [loginMember, router])

    // 이미지 업로드 핸들러
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)

            // 파일 미리보기 생성
            const reader = new FileReader()
            reader.onload = (event) => {
                if (event.target && typeof event.target.result === 'string') {
                    setImagePreview(event.target.result)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    // 이미지 제거 핸들러
    const handleRemoveImage = () => {
        setImagePreview(null)
        setImageFile(null)
        setProfile({ ...profile, profilePictureUrl: '' })
    }

    // 닉네임 중복 확인
    const checkNicknameDuplicate = async () => {
        if (!profile.nickname) {
            setError('닉네임을 입력해주세요')
            return
        }

        if (profile.nickname === loginMember?.nickname) {
            setNicknameDuplicate(false)
            setSuccess('현재 사용 중인 닉네임입니다')
            setTimeout(() => setSuccess(null), 2000)
            return
        }

        try {
            setIsLoading(true)
            const response = await client.GET('/api/v1/members/check-nickname', {
                params: {
                    query: { nickname: profile.nickname },
                    header: undefined,
                    path: undefined,
                    cookie: undefined,
                },
                credentials: 'include',
            })

            const isAvailable = response.data?.data

            setNicknameDuplicate(!isAvailable)

            if (!isAvailable) {
                setError('이미 사용 중인 닉네임입니다')
            } else {
                setSuccess('사용 가능한 닉네임입니다')
                setTimeout(() => setSuccess(null), 2000)
            }
        } catch (err) {
            setError('닉네임 중복 확인 중 오류가 발생했습니다')
        } finally {
            setIsLoading(false)
        }
    }

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!profile.nickname) {
            setError('닉네임을 입력해주세요')
            return
        }

        if (nicknameDuplicate) {
            setError('중복된 닉네임으로 변경할 수 없습니다')
            return
        }

        try {
            setIsSubmitting(true)
            setError(null)

            let profileImageUrl = profile.profilePictureUrl

            // 이미지가 변경된 경우 업로드
            if (imageFile) {
                // FormData 생성 및 파일 추가
                const formData = new FormData()
                formData.append('file', imageFile)
                formData.append('target', 'PROFILE')

                // 이미지 업로드 API 호출
                try {
                    const uploadResponse = await client.POST('/api/v1/upload/image/0', {
                        withCredentials: true,
                        body: formData,
                    })

                    if (uploadResponse.data) {
                        // 이미지 업로드 성공 후 프로필 정보를 다시 가져옴
                        const updatedProfileResponse = await client.GET('/api/v1/members/me', {
                            withCredentials: true,
                        })

                        if (updatedProfileResponse.data?.data?.profilePictureUrl) {
                            profileImageUrl = updatedProfileResponse.data.data.profilePictureUrl
                        }
                    }
                } catch (uploadErr) {
                    console.error('이미지 업로드 중 오류:', uploadErr)
                    setError('이미지 업로드 중 오류가 발생했습니다')
                    setIsSubmitting(false)
                    return
                }
            }

            // 프로필 업데이트
            const response = await client.PATCH('/api/v1/members/me', {
                withCredentials: true,
                body: {
                    nickname: profile.nickname,
                    introduction: profile.introduction,
                    profileImageUrl: profileImageUrl,
                },
            })

            // 태그 업데이트 - 백엔드 API에 맞게 수정
            await client.PATCH('/api/v1/members/me/tags', {
                withCredentials: true,
                body: { tagIds },
            })

            // 업데이트된 프로필 정보 가져오기
            const updatedProfileResponse = await client.GET('/api/v1/members/me', {
                withCredentials: true,
            })

            if (updatedProfileResponse.data?.data) {
                // 전역 상태 업데이트
                setLoginMember({
                    ...updatedProfileResponse.data.data,
                    id: loginMember.id,
                })
            }

            // 성공 메시지 표시
            alert('프로필이 성공적으로 업데이트되었습니다')
            router.push('/my/profile')
        } catch (err) {
            setError('프로필 업데이트 중 오류가 발생했습니다')
            setIsSubmitting(false)
        }
    }

    // 태그 토글 핸들러
    const toggleTag = (tag: TagType) => {
        if (tagIds.includes(tag.id)) {
            setTagIds(tagIds.filter((id) => id !== tag.id))
        } else if (tagIds.length < 5) {
            setTagIds([...tagIds, tag.id])
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-[#FFB130] border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">로딩 중...</p>
                </div>
            </div>
        )
    }

    if (error && !success) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-900">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-700">
                    <p className="text-red-500 mb-4 text-center">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="w-full py-3 bg-[#FFB130] text-white rounded-md hover:bg-[#E09D20] transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 py-10">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-700">
                    <h1 className="text-3xl font-bold text-center mb-2 text-white">프로필 수정</h1>
                    <div className="w-20 h-1 bg-[#FFB130] mx-auto mb-6 rounded-full"></div>
                    <p className="text-center text-gray-400 mb-8">방탈출 모임에서 사용할 프로필을 수정해주세요</p>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* 에러 메시지 */}
                        {error && (
                            <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* 성공 메시지 */}
                        {success && (
                            <div className="bg-green-900/30 border border-green-800 text-green-300 px-4 py-3 rounded-lg">
                                {success}
                            </div>
                        )}

                        {/* 프로필 이미지 영역 */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-36 h-36 mb-4">
                                <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-700 border-4 border-[#FFB130] shadow-lg">
                                    {imagePreview ? (
                                        <Image
                                            src={imagePreview}
                                            alt="프로필 이미지"
                                            width={144}
                                            height={144}
                                            className="object-cover w-full h-full"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-16 w-16 text-gray-500"
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
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-0 right-0 bg-red-500 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-white"
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
                                )}
                            </div>
                            <p className="text-sm text-gray-400">프로필 사진을 등록해주세요 (선택사항)</p>
                        </div>

                        {/* 닉네임 입력 */}
                        <div className="bg-gray-700 p-6 rounded-xl">
                            <label className="block text-white font-semibold mb-3 text-lg">
                                닉네임 <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={profile.nickname}
                                    onChange={(e) => {
                                        setProfile({ ...profile, nickname: e.target.value })
                                        setError(null)
                                        setSuccess(null)
                                        setNicknameDuplicate(false)
                                    }}
                                    placeholder="닉네임을 입력해주세요"
                                    className="flex-1 px-4 py-3 border rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFB130] focus:border-[#FFB130] transition-all border-gray-600"
                                    minLength={2}
                                    maxLength={10}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={checkNicknameDuplicate}
                                    disabled={isLoading || !profile.nickname}
                                    className={`px-5 py-3 rounded-lg font-medium shadow-md ${
                                        isLoading || !profile.nickname
                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                            : 'bg-[#FFB130] text-white hover:bg-[#E09D20] transition-colors'
                                    }`}
                                >
                                    중복확인
                                </button>
                            </div>
                            {profile.nickname && (
                                <p className="mt-2 text-sm text-gray-400">닉네임은 2~10자로 입력해주세요</p>
                            )}
                        </div>

                        {/* 성별 선택 */}
                        <div className="bg-gray-700 p-6 rounded-xl">
                            <label className="block text-white font-semibold mb-3 text-lg">성별</label>
                            <div className="flex gap-6">
                                <label className="flex items-center cursor-pointer group">
                                    <div
                                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                            profile.gender === 'MALE'
                                                ? 'border-[#FFB130] bg-gray-800'
                                                : 'border-gray-500'
                                        }`}
                                    >
                                        {profile.gender === 'MALE' && (
                                            <div className="w-3 h-3 rounded-full bg-[#FFB130]"></div>
                                        )}
                                    </div>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="MALE"
                                        checked={profile.gender === 'MALE'}
                                        onChange={() => setProfile({ ...profile, gender: 'MALE' })}
                                        className="hidden"
                                    />
                                    <span
                                        className={`group-hover:text-[#FFB130] transition-colors ${
                                            profile.gender === 'MALE' ? 'text-[#FFB130] font-medium' : 'text-gray-300'
                                        }`}
                                    >
                                        남성
                                    </span>
                                </label>
                                <label className="flex items-center cursor-pointer group">
                                    <div
                                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                            profile.gender === 'FEMALE'
                                                ? 'border-[#FFB130] bg-gray-800'
                                                : 'border-gray-500'
                                        }`}
                                    >
                                        {profile.gender === 'FEMALE' && (
                                            <div className="w-3 h-3 rounded-full bg-[#FFB130]"></div>
                                        )}
                                    </div>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="FEMALE"
                                        checked={profile.gender === 'FEMALE'}
                                        onChange={() => setProfile({ ...profile, gender: 'FEMALE' })}
                                        className="hidden"
                                    />
                                    <span
                                        className={`group-hover:text-[#FFB130] transition-colors ${
                                            profile.gender === 'FEMALE' ? 'text-[#FFB130] font-medium' : 'text-gray-300'
                                        }`}
                                    >
                                        여성
                                    </span>
                                </label>
                                <label className="flex items-center cursor-pointer group">
                                    <div
                                        className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                            profile.gender === 'BLIND' || profile.gender === 'NOT_SPECIFIED'
                                                ? 'border-[#FFB130] bg-gray-800'
                                                : 'border-gray-500'
                                        }`}
                                    >
                                        {(profile.gender === 'BLIND' || profile.gender === 'NOT_SPECIFIED') && (
                                            <div className="w-3 h-3 rounded-full bg-[#FFB130]"></div>
                                        )}
                                    </div>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="NOT_SPECIFIED"
                                        checked={profile.gender === 'BLIND' || profile.gender === 'NOT_SPECIFIED'}
                                        onChange={() => setProfile({ ...profile, gender: 'NOT_SPECIFIED' })}
                                        className="hidden"
                                    />
                                    <span
                                        className={`group-hover:text-[#FFB130] transition-colors ${
                                            profile.gender === 'BLIND' || profile.gender === 'NOT_SPECIFIED'
                                                ? 'text-[#FFB130] font-medium'
                                                : 'text-gray-300'
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
                                <label className="block text-white font-semibold text-lg">자기소개</label>
                                <span className="text-sm text-gray-400 font-medium">
                                    {profile.introduction.length}/200
                                </span>
                            </div>
                            <textarea
                                value={profile.introduction}
                                onChange={(e) => setProfile({ ...profile, introduction: e.target.value })}
                                placeholder="자기소개를 입력하세요"
                                className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-gray-300 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB130] focus:border-[#FFB130] transition-all"
                                maxLength={200}
                                rows={4}
                            ></textarea>
                            <p className="text-xs text-gray-400 mt-2">
                                방탈출 모임에서 자신을 소개할 수 있는 내용을 작성해보세요
                            </p>
                        </div>

                        {/* 태그 선택 영역 */}
                        <div className="bg-gray-700 p-6 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">나를 표현하는 태그</h2>
                                <span
                                    className={`text-sm font-medium ${
                                        tagIds.length >= 5 ? 'text-red-400' : 'text-[#FFB130]'
                                    }`}
                                >
                                    {tagIds.length}/5개 선택
                                </span>
                            </div>

                            {/* 커스텀 태그 입력 */}
                            {/* <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    placeholder="새로운 태그 입력 (예: #도전)"
                    className="flex-1 px-4 py-2 border rounded-lg bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFB130] focus:border-[#FFB130] transition-all border-gray-600"
                    maxLength={10}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customTagInput.trim() && tagIds.length < 5) {
                        const newTag = customTagInput.trim().replace(/^#/, '');
                        if (!allTags.some(tag => tag.name === newTag)) {
                          const newTagObj = {
                            id: Date.now(), // 임시 ID
                            name: newTag
                          };
                          setAllTags([...allTags, newTagObj]);
                          setTagIds([...tagIds, newTagObj.id]);
                        }
                        setCustomTagInput("");
                      }
                    }}
                    disabled={!customTagInput.trim() || tagIds.length >= 5}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      !customTagInput.trim() || tagIds.length >= 5
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-[#FFB130] text-white hover:bg-[#E09D20] transition-colors"
                    }`}
                  >
                    추가
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  #을 제외하고 태그를 입력해주세요 (최대 10자)
                </p>
              </div> */}

                            {/* 태그 목록 */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {allTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                                            tagIds.includes(tag.id)
                                                ? 'bg-[#FFB130] text-white shadow-md'
                                                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                        }`}
                                        disabled={tagIds.length >= 5 && !tagIds.includes(tag.id)}
                                    >
                                        #{tag.name}
                                    </button>
                                ))}
                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                                나의 성격, 취향, 플레이 스타일 등을 표현할 수 있는 태그를 선택해주세요 (최대 5개)
                            </p>
                        </div>

                        {/* 제출 버튼 */}
                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.push('/my/profile')}
                                className="w-1/2 py-4 bg-gray-600 text-white rounded-xl transition-all hover:bg-gray-500"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-1/2 py-4 text-white rounded-xl text-lg font-bold transition-all ${
                                    isSubmitting
                                        ? 'bg-gray-600 cursor-not-allowed'
                                        : 'bg-[#FFB130] hover:bg-[#E09D20] shadow-lg hover:shadow-xl'
                                }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        처리 중...
                                    </div>
                                ) : (
                                    '변경사항 저장'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
