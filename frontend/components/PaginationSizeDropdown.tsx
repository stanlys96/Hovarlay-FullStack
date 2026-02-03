"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { useState, useRef, useEffect } from "react";

interface Props {
    value?: number;
    onChange?: (val: number) => void;
}

export default function PaginationSizeDropdown({ value = 20, onChange }: Props) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<number>(value);
    const ref = useRef<HTMLDivElement>(null);
    const authContext = useAuth();

    const options = [20, 50, 100];


    const handleSelect = (value: number) => {
        setSelected(value);

        const mode = value === DEFAULT_PAGE_SIZE ? "delete" : "set";
        const pageSize = value === DEFAULT_PAGE_SIZE ? "" : String(value);

        authContext?.updateSearchParams("pageSize", pageSize, mode);

        onChange?.(value);
        setOpen(false);
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="flex flex-col gap-2 text-sm text-gray-600 w-full">
            <span className="font-medium text-gray-700">Page Size</span>
            <div className="relative w-full">
                {/* Trigger button */}
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="w-full cursor-pointer flex justify-between items-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 shadow-sm text-gray-800 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <span>{selected}</span>
                    <svg
                        className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg p-2">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleSelect(opt)}
                                className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg text-sm ${selected === opt ? "bg-green-100 text-green-700" : "hover:bg-gray-50 text-gray-700"}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
