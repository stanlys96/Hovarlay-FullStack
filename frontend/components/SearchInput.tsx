"use client";

import { useState, useEffect, useRef } from "react";
import { debounce } from "@/lib/debounce";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchInput({ value, onChange }: Props) {
  const [input, setInput] = useState(value);

  const isMountRef = useRef(true);

  const debouncedChange = debounce(onChange, 800);

  useEffect(() => {
    if (isMountRef.current) {
      isMountRef.current = false;
      return;
    }
    debouncedChange(input);
  }, [input]);

  return (
    <div className="relative w-full">
      {/* Search Icon */}
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m1.85-5.4a7.25 7.25 0 11-14.5 0 7.25 7.25 0 0114.5 0z"
        />
      </svg>

      <input
        type="text"
        placeholder="Search products..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white"
      />
    </div>
  );
}
