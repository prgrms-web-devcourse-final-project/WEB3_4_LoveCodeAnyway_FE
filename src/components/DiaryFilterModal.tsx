import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DiaryFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    success: boolean | null;
    dateRange: { start: string; end: string } | null;
  }) => void;
}

export function DiaryFilterModal({
  isOpen,
  onClose,
  onApply,
}: DiaryFilterModalProps) {
  const [success, setSuccess] = useState<boolean | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const handleApply = () => {
    onApply({ success, dateRange });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">필터</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">성공 여부</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSuccess(true)}
                className={`px-4 py-2 rounded-lg ${
                  success === true
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                성공
              </button>
              <button
                onClick={() => setSuccess(false)}
                className={`px-4 py-2 rounded-lg ${
                  success === false
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                실패
              </button>
              <button
                onClick={() => setSuccess(null)}
                className={`px-4 py-2 rounded-lg ${
                  success === null
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                전체
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">날짜 범위</h3>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">
                  시작일
                </label>
                <input
                  type="date"
                  value={dateRange?.start || ""}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      start: e.target.value,
                      end: prev?.end || e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">
                  종료일
                </label>
                <input
                  type="date"
                  value={dateRange?.end || ""}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      end: e.target.value,
                      start: prev?.start || e.target.value,
                    }))
                  }
                  min={dateRange?.start}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            취소
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
