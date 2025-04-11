"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";

// 임시 쪽지 데이터
const mockMessages = [
  {
    id: 1,
    sender: "김방탈",
    content: "다음 주 방탈출 모임 일정 협의해주세요.",
    date: "2024.02.20",
    isRead: true,
  },
  {
    id: 2,
    sender: "이방출",
    content: "새로운 방탈출 카페 추천드립니다!",
    date: "2024.02.19",
    isRead: false,
  },
  // 추가 데이터
];

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<
    (typeof mockMessages)[0] | null
  >(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  // 전체 선택 핸들러
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(mockMessages.map((msg) => msg.id));
    }
    setSelectAll(!selectAll);
  };

  // 개별 선택 핸들러
  const handleSelectMessage = (id: number) => {
    setSelectedMessages((prev) => {
      if (prev.includes(id)) {
        return prev.filter((msgId) => msgId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 쪽지 상세 보기 핸들러
  const handleOpenMessage = (message: (typeof mockMessages)[0]) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F9FAFB" }}>
      <Navigation activePage="my" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex">
          {/* 왼쪽 사이드 메뉴 */}
          <div className="w-[230px] mr-8">
            <div className="bg-black text-white">
              <button className="w-full text-left py-3 px-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                받은 쪽지함
              </button>
            </div>
            <Link
              href="/my/messages?tab=sent"
              className="block bg-white border border-t-0 border-gray-300 py-3 px-4 hover:bg-gray-50 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              보낸 쪽지함
            </Link>
          </div>

          {/* 오른쪽 컨텐츠 */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-xl font-medium">쪽지함</h2>
            </div>

            {/* 쪽지 목록 */}
            <div>
              <div className="flex justify-end mb-4 gap-2">
                <button
                  className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 ${
                    selectedMessages.length > 0
                      ? "hover:bg-gray-50"
                      : "opacity-70 cursor-not-allowed"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  읽음 표시
                </button>
                <button
                  className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 ${
                    selectedMessages.length > 0
                      ? "hover:bg-gray-50"
                      : "opacity-70 cursor-not-allowed"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  삭제
                </button>
              </div>

              <div className="bg-white border border-gray-300 rounded-sm">
                <table className="w-full">
                  <thead>
                    <tr
                      className="border-b border-gray-300"
                      style={{ backgroundColor: "#F9FAFB" }}
                    >
                      <th className="p-4 text-left w-12">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          className="rounded"
                        />
                      </th>
                      <th className="p-4 text-left font-medium text-sm text-gray-700 w-24">
                        보낸사람
                      </th>
                      <th className="p-4 text-left font-medium text-sm text-gray-700">
                        내용
                      </th>
                      <th className="p-4 text-left font-medium text-sm text-gray-700 w-24">
                        날짜
                      </th>
                      <th className="p-4 text-left font-medium text-sm text-gray-700 w-20">
                        상태
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockMessages.map((message) => (
                      <tr
                        key={message.id}
                        className="border-b border-gray-300 hover:bg-gray-50"
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedMessages.includes(message.id)}
                            onChange={() => handleSelectMessage(message.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="p-4">{message.sender}</td>
                        <td className="p-4">
                          <button
                            className="text-left hover:text-primary focus:outline-none"
                            onClick={() => handleOpenMessage(message)}
                          >
                            {message.content}
                          </button>
                        </td>
                        <td className="p-4 text-gray-500">{message.date}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              message.isRead
                                ? "bg-gray-100 text-gray-600"
                                : "bg-red-50 text-red-500"
                            }`}
                          >
                            {message.isRead ? "읽음" : "안읽음"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 페이지네이션 */}
                <div className="flex justify-center p-4">
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm hover:bg-gray-50 text-gray-700">
                      &lt;
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-800 rounded-sm bg-black text-white">
                      1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm hover:bg-gray-50 text-gray-700">
                      2
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm hover:bg-gray-50 text-gray-700">
                      3
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-sm hover:bg-gray-50 text-gray-700">
                      &gt;
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 mt-2">전체 20 개</div>
            </div>
          </div>
        </div>
      </div>

      {/* 쪽지 상세 모달 */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0"
            style={{ backgroundColor: "#3D3D3D", opacity: "0.6" }}
          ></div>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">쪽지 보기</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="font-medium mb-1">보낸 사람</div>
              <div className="flex items-center bg-gray-50 p-3 rounded-md">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-medium text-sm mr-3">
                  {selectedMessage.sender.charAt(0)}
                </div>
                <div className="font-medium">{selectedMessage.sender}</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="font-medium mb-1">내용</div>
              <div className="bg-gray-50 p-3 rounded-md min-h-[100px]">
                {selectedMessage.content}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                닫기
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsReplyModalOpen(true);
                }}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                답장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 답장하기 모달 */}
      {isReplyModalOpen && selectedMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0"
            style={{ backgroundColor: "#3D3D3D", opacity: "0.6" }}
          ></div>
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">답장 하기</h3>
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="font-medium mb-1">받는 사람</div>
              <div className="flex items-center bg-gray-50 p-3 rounded-md">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-medium text-sm mr-3">
                  {selectedMessage.sender.charAt(0)}
                </div>
                <div className="font-medium">{selectedMessage.sender}</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="font-medium mb-1">내용</div>
              <textarea
                className="w-full border border-gray-200 rounded-md p-3 h-36 focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="내용을 입력하세요"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                닫기
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                보내기
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
