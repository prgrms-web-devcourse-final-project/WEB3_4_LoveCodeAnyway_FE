import { useState } from "react";

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
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const regions = [
    { id: "서울", name: "서울" },
    { id: "경기/인천", name: "경기/인천" },
    { id: "충청", name: "충청" },
    { id: "경상", name: "경상" },
    { id: "전라", name: "전라" },
    { id: "강원", name: "강원" },
    { id: "제주", name: "제주" },
  ];

  const subRegions = [
    { id: "서울 전체", name: "서울 전체" },
    { id: "홍대", name: "홍대" },
    { id: "강남", name: "강남" },
    { id: "건대", name: "건대" },
    { id: "대학로", name: "대학로" },
    { id: "신촌", name: "신촌" },
    { id: "잠실", name: "잠실" },
    { id: "신림", name: "신림" },
    { id: "노원", name: "노원" },
    { id: "신사", name: "신사" },
  ];

  const genres = [
    { id: "스릴러", name: "스릴러" },
    { id: "판타지", name: "판타지" },
    { id: "추리", name: "추리" },
    { id: "호러/공포", name: "호러/공포" },
    { id: "감임", name: "감임" },
    { id: "코미디", name: "코미디" },
    { id: "모험/힐링", name: "모험/힐링" },
    { id: "미스터리", name: "미스터리" },
    { id: "SF", name: "SF" },
    { id: "액션", name: "액션" },
    { id: "역사", name: "역사" },
    { id: "타임어택", name: "타임어택" },
  ];

  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region]
    );
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleApply = () => {
    onApply({
      regions: selectedRegions,
      genres: selectedGenres,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center pt-20 z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[3px]"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-2xl w-[1105px] p-8 mx-4 shadow-lg relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">검색 필터 - 모임</h2>
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

        <div className="flex items-center mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="직접 전 선택한 필터 표시"
              className="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
            />
            <div className="absolute left-3 top-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                  stroke="#98A2B3"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 14L11 11"
                  stroke="#98A2B3"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <button className="ml-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
            선택 초기화
          </button>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-4 text-center">지역별</h3>
              <div className="flex">
                <div className="w-1/3 bg-gray-50 rounded-xl p-4">
                  {regions.map((region) => (
                    <button
                      key={region.id}
                      onClick={() => handleRegionToggle(region.id)}
                      className={`w-full text-left px-4 py-2 mb-1 rounded-lg ${
                        selectedRegions.includes(region.id)
                          ? "bg-gray-600/10 text-gray-900"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {region.name}
                    </button>
                  ))}
                </div>
                <div className="w-2/3 pl-4">
                  <div className="grid grid-cols-1 gap-2">
                    {subRegions.map((region) => (
                      <div key={region.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={region.id}
                          checked={selectedRegions.includes(region.id)}
                          onChange={() => handleRegionToggle(region.id)}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <label htmlFor={region.id} className="ml-2 text-sm">
                          {region.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-4 text-center">장르</h3>
              <div className="grid grid-cols-3 gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreToggle(genre.id)}
                    className={`px-4 py-2 rounded-xl bg-gray-50 ${
                      selectedGenres.includes(genre.id)
                        ? "border-2 border-black text-black"
                        : "border border-gray-100 text-gray-900 hover:border-gray-200"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-medium mb-4 text-center">날짜</h3>
              <div className="text-center text-[40px] font-bold text-gray-900 mt-12">
                달력
                <div className="text-xl mt-2">날짜 중복</div>
                <div className="text-xl">선택 가능</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleApply}
            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            필터 적용
          </button>
        </div>
      </div>
    </div>
  );
}
