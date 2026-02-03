"use client";

import { useSearchParams } from "next/navigation";

interface Props {
  onPageChange: (page: number) => void;
  totalPages: number;
}

export default function PaginationControls({ onPageChange, totalPages }: Props) {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
  return (
    <div className="flex justify-center items-center gap-3 mt-8">
      {/* Prev */}
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-100 hover:shadow active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
      >
        ← Prev
      </button>

      {/* Current Page */}
      <span className="min-w-[40px] h-[40px] flex items-center justify-center rounded-full bg-gray-900 text-white font-medium shadow">
        {page}
      </span>

      {/* Next */}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-100 hover:shadow active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        Next →
      </button>
    </div>
  );
}
