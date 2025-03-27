import { MeetingCard } from "@/components/MeetingCard";
import { ThemeCard } from "@/components/ThemeCard";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  return (
    <main className="bg-gray-50">
      <Navigation activePage="home" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12">
        {/* 실시간 모집 섹션 */}
        <section className="my-8">
          <h2 className="text-xl font-bold mb-4">실시간 모집</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              {
                id: "1",
                title: "공포 테마 같이 도전하실 분!",
                category: "공포의 저택",
                date: "2024.03.15 19:00",
                location: "홍대입구역",
                participants: "2/4명",
                host: {
                  name: "철희스터",
                  image: "/images/host1.jpg",
                },
                image: "/images/horror-room.jpg",
              },
              {
                id: "2",
                title: "추리 테마 도전!",
                category: "셜록홈즈",
                date: "2024.03.16 15:00",
                location: "강남역",
                participants: "3/4명",
                host: {
                  name: "주마링",
                  image: "/images/host2.jpg",
                },
                image: "/images/mystery-room.jpg",
              },
              {
                id: "3",
                title: "SF 테마 도전자 모집",
                category: "우주정거장",
                date: "2024.03.17 14:00",
                location: "신대방역",
                participants: "1/4명",
                host: {
                  name: "우주인",
                  image: "/images/host3.jpg",
                },
                image: "/images/sf-room.jpg",
              },
              {
                id: "4",
                title: "SF 테마 도전자 모집",
                category: "우주정거장",
                date: "2024.03.17 14:00",
                location: "신대방역",
                participants: "1/4명",
                host: {
                  name: "우주인",
                  image: "/images/host3.jpg",
                },
                image: "/images/sf-room.jpg",
              },
            ].map((room, index) => (
              <div key={index}>
                <MeetingCard room={room} />
              </div>
            ))}
          </div>
        </section>

        {/* 인기 테마 섹션 */}
        <section className="my-8">
          <h2 className="text-xl font-bold mb-4">인기 테마</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              {
                id: "1",
                title: "비밀의 방",
                category: "미스터리 룸 잠입전",
                date: "오늘",
                location: "홍대입구역",
                participants: "2/4명",
                rating: "60",
                tags: ["공포", "추리"],
                image: "/images/mystery-room.jpg",
              },
              {
                id: "2",
                title: "타임머신",
                category: "시간여행 어드벤처",
                date: "오늘",
                location: "강남역",
                participants: "3/6명",
                rating: "75",
                tags: ["SF", "액션"],
                image: "/images/sf-room.jpg",
              },
              {
                id: "3",
                title: "탐정사무소",
                category: "명탐정 신드롬",
                date: "오늘",
                location: "종로",
                participants: "2/4명",
                rating: "90",
                tags: ["추리", "미스터리"],
                image: "/images/detective-room.jpg",
              },
              {
                id: "4",
                title: "저주받은 저택",
                category: "호러룸 건탈출",
                date: "오늘",
                location: "홍대입구역",
                participants: "2/4명",
                rating: "70",
                tags: ["공포", "어드벤처"],
                image: "/images/horror-room.jpg",
              },
            ].map((room, index) => (
              <div key={index}>
                <ThemeCard room={room} />
              </div>
            ))}
          </div>
        </section>

        {/* 최신 등록 테마 섹션 */}
        <section className="my-8">
          <h2 className="text-xl font-bold mb-4">최신 등록 테마</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[
              {
                id: "1",
                title: "비밀의 방",
                category: "미스터리 룸 잠입전",
                date: "오늘",
                location: "홍대입구역",
                participants: "2/4명",
                rating: "60",
                tags: ["공포", "추리"],
                image: "/images/mystery-room.jpg",
              },
              {
                id: "2",
                title: "타임머신",
                category: "시간여행 어드벤처",
                date: "오늘",
                location: "강남역",
                participants: "3/6명",
                rating: "75",
                tags: ["SF", "액션"],
                image: "/images/sf-room.jpg",
              },
              {
                id: "3",
                title: "탐정사무소",
                category: "명탐정 신드롬",
                date: "오늘",
                location: "종로",
                participants: "2/4명",
                rating: "90",
                tags: ["추리", "미스터리"],
                image: "/images/detective-room.jpg",
              },
              {
                id: "4",
                title: "저주받은 저택",
                category: "호러룸 건탈출",
                date: "오늘",
                location: "홍대입구역",
                participants: "2/4명",
                rating: "70",
                tags: ["공포", "어드벤처"],
                image: "/images/horror-room.jpg",
              },
            ].map((room, index) => (
              <div key={index}>
                <ThemeCard room={room} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
