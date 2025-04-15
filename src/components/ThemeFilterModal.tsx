import { useState, useEffect } from "react";

interface Tag {
  id: number;
  name: string;
}

interface Region {
  id: number;
  subRegion: string;
}

interface Participant {
  id: string;
  name: string;
}

interface ThemeFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export function ThemeFilterModal({
  isOpen,
  onClose,
  onApply,
}: ThemeFilterModalProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<string>("");
  const [activeRegion, setActiveRegion] = useState("서울");
  const [tags, setTags] = useState<Tag[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRegions, setLoadingRegions] = useState(false);

  const participants: Participant[] = [
    { id: "1", name: "1명" },
    { id: "2", name: "2명" },
    { id: "3", name: "3명" },
    { id: "4", name: "4명" },
    { id: "5", name: "5명" },
    { id: "6", name: "6명" },
    { id: "7", name: "7명" },
    { id: "8", name: "8명 이상" },
  ];

  const majorRegions = [
    { id: "서울", name: "서울" },
    { id: "경기/인천", name: "경기/인천" },
    { id: "충청", name: "충청" },
    { id: "경상", name: "경상" },
    { id: "전라", name: "전라" },
    { id: "강원", name: "강원" },
    { id: "제주", name: "제주" },
  ];

  useEffect(() => {
    if (isOpen) {
      fetchTags();
      fetchRegions();
    }
  }, [isOpen]);

  const fetchRegions = async () => {
    setLoadingRegions(true);
    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : "https://api.ddobang.site"
        }/api/v1/regions?majorRegion=서울`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data && data.data) {
        setRegions(data.data);
      }
    } catch (error) {
      console.error("지역 목록을 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoadingRegions(false);
    }
  };

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : "https://api.ddobang.site"
        }/api/v1/themes/tags`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data && data.data) {
        setTags(data.data);
      }
    } catch (error) {
      console.error("태그 목록을 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const handleGenreToggle = (tagId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(tagId) ? prev.filter((g) => g !== tagId) : [...prev, tagId]
    );
  };

  const handleParticipantToggle = (participant: string) => {
    setSelectedParticipant(
      selectedParticipant === participant ? "" : participant
    );
  };

  const handleRegionClick = async (majorRegion: string) => {
    setActiveRegion(majorRegion);
    setLoadingRegions(true);
    try {
      const response = await fetch(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : "https://api.ddobang.site"
        }/api/v1/regions?majorRegion=${majorRegion}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();

      if (data && data.data) {
        setRegions(data.data);
      }
    } catch (error) {
      console.error("지역 목록을 불러오는 중 오류가 발생했습니다:", error);
    } finally {
      setLoadingRegions(false);
    }
  };

  const handleReset = () => {
    setSelectedRegions([]);
    setSelectedGenres([]);
    setSelectedParticipant("");
    setActiveRegion("서울");
  };

  const handleApply = () => {
    const filters = {
      regionId: selectedRegions
        .map((region) => {
          const regionObj = regions.find((r) => r.subRegion === region);
          return regionObj ? regionObj.id : null;
        })
        .filter((id) => id !== null),
      tagIds: selectedGenres,
      participants: selectedParticipant
        ? parseInt(selectedParticipant)
        : undefined,
    };
    onApply(filters);
    onClose();
  };

  const getSelectedFiltersText = () => {
    const regionText =
      selectedRegions.length > 0 ? `지역: ${selectedRegions.join(", ")}` : "";

    const genreText =
      selectedGenres.length > 0
        ? `장르: ${selectedGenres
            .map((tagId) => {
              const tag = tags.find((t) => t.id === tagId);
              return tag ? tag.name : "";
            })
            .filter(Boolean)
            .join(", ")}`
        : "";

    const participantText = selectedParticipant
      ? `인원: ${selectedParticipant}명`
      : "";

    const texts = [regionText, genreText, participantText].filter(Boolean);
    return texts.join(" | ");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[3px]"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-2xl w-full max-w-[1105px] p-4 md:p-8 mx-4 my-4 shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">검색 필터 - 테마</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col md:flex-row items-center mb-8 gap-2 md:gap-0">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="직접 전 선택한 필터 표시"
              value={getSelectedFiltersText()}
              className="w-full px-4 py-2.5 pl-9 rounded-lg bg-[#F9F9FC] border border-[#E1E2E7] focus:outline-none focus:border-[#E1E2E7] placeholder:text-[#9BA3AF]"
              disabled
            />
            <div className="absolute left-3.5 top-[32%]">
              <img
                src="/placeholder_search.svg"
                alt="검색"
                width={16}
                height={16}
              />
            </div>
          </div>
          <button
            onClick={handleReset}
            className="w-full md:w-auto md:ml-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            선택 초기화
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#E1E2E7] h-[480px] overflow-auto">
              <h3 className="text-lg font-medium mb-4 text-center">지역별</h3>
              <div className="flex h-[calc(100%-40px)]">
                <div className="w-[120px] md:w-[140px] bg-gray-50 rounded-xl p-2 md:p-4 border border-[#E1E2E7]">
                  <button
                    className={`w-full text-left mb-3 text-sm whitespace-nowrap px-2 md:px-3 py-2 rounded-lg transition-colors bg-[#FFB230] text-white`}
                  >
                    서울
                  </button>
                </div>
                <div className="flex-1 pl-2 md:pl-4">
                  <div className="grid grid-cols-1 gap-2">
                    {loadingRegions ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                      </div>
                    ) : (
                      regions.map((region) => (
                        <div
                          key={region.id}
                          className="flex items-center group"
                        >
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              id={region.subRegion}
                              checked={selectedRegions.includes(
                                region.subRegion
                              )}
                              onChange={() =>
                                handleRegionToggle(region.subRegion)
                              }
                              className="peer w-4 h-4 rounded border border-[#858D9D] text-[#FFB230] focus:ring-[#FFB230] focus:ring-2 focus:ring-offset-2 cursor-pointer appearance-none checked:bg-[#FFB230] checked:border-[#FFB230] transition-colors"
                            />
                            <svg
                              className="absolute w-4 h-4 pointer-events-none opacity-0 peer-checked:opacity-100 text-white"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z"
                                fill="currentColor"
                              />
                            </svg>
                            <label
                              htmlFor={region.subRegion}
                              className={`ml-2 text-sm cursor-pointer select-none ${
                                selectedRegions.includes(region.subRegion)
                                  ? "text-[#FFB230] font-medium"
                                  : "text-gray-700 group-hover:text-gray-900"
                              }`}
                            >
                              {region.subRegion}
                            </label>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#E1E2E7] h-[480px] overflow-auto">
              <h3 className="text-lg font-medium mb-4 text-center">장르별</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {loading ? (
                  <div className="col-span-3 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleGenreToggle(0)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(0)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      스릴러
                    </button>
                    <button
                      onClick={() => handleGenreToggle(1)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(1)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      판타지
                    </button>
                    <button
                      onClick={() => handleGenreToggle(2)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(2)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      추리
                    </button>
                    <button
                      onClick={() => handleGenreToggle(3)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(3)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      호러/공포
                    </button>
                    <button
                      onClick={() => handleGenreToggle(4)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(4)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      잠입
                    </button>
                    <button
                      onClick={() => handleGenreToggle(5)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(5)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      코미디
                    </button>
                    <button
                      onClick={() => handleGenreToggle(6)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(6)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      모험/탈험
                    </button>
                    <button
                      onClick={() => handleGenreToggle(7)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(7)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      감성
                    </button>
                    <button
                      onClick={() => handleGenreToggle(8)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(8)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      드라마
                    </button>
                    <button
                      onClick={() => handleGenreToggle(9)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(9)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      범죄
                    </button>
                    <button
                      onClick={() => handleGenreToggle(10)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(10)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      미스터리
                    </button>
                    <button
                      onClick={() => handleGenreToggle(11)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(11)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      SF
                    </button>
                    <button
                      onClick={() => handleGenreToggle(12)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(12)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      19금
                    </button>
                    <button
                      onClick={() => handleGenreToggle(13)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(13)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      액션
                    </button>
                    <button
                      onClick={() => handleGenreToggle(14)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(14)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      역사
                    </button>
                    <button
                      onClick={() => handleGenreToggle(15)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(15)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      로맨스
                    </button>
                    <button
                      onClick={() => handleGenreToggle(16)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(16)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      야외
                    </button>
                    <button
                      onClick={() => handleGenreToggle(17)}
                      className={`text-sm rounded-lg border px-3 py-2 transition-colors ${
                        selectedGenres.includes(17)
                          ? "bg-[#FFB230] text-white border-[#FFB230]"
                          : "border-[#E1E2E7] hover:bg-gray-50"
                      }`}
                    >
                      타임어택
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-[#E1E2E7] h-[480px] overflow-auto">
              <h3 className="text-lg font-medium mb-4 text-center">인원별</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {participants.map((participant) => (
                  <button
                    key={participant.id}
                    onClick={() => handleParticipantToggle(participant.id)}
                    className={`text-sm rounded-lg border px-2 md:px-3 py-2 transition-colors ${
                      selectedParticipant === participant.id
                        ? "bg-[#FFB230] text-white border-[#FFB230]"
                        : "border-[#E1E2E7] hover:bg-gray-50"
                    }`}
                  >
                    {participant.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8 gap-4">
          <button
            onClick={onClose}
            className="px-4 md:px-6 py-3 border border-[#E1E2E7] rounded-lg hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleApply}
            className="px-4 md:px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
