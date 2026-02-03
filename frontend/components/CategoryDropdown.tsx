"use client";

import { useState, useRef, useEffect } from "react";
import { sampleCategories } from "@/lib/helper";
import { useAuth } from "@/contexts/AuthContext";

export default function CategoryDropdown({ currentCategories }: { currentCategories: string[] }) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string[]>(currentCategories);
    const ref = useRef<HTMLDivElement>(null);
    const authContext = useAuth();
    
    const toggleCategory = (category: string) => {
        const updated = selected.includes(category)
            ? selected.filter((c) => c !== category)
            : [...selected, category];
        setSelected(updated);
        authContext?.toggleCategoryParams(category);
    };

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
        <div ref={ref} className="flex flex-col gap-2 text-sm text-gray-600">
            <span className="font-medium text-gray-700">Categories</span>
            <div className="relative w-full max-w-sm">
                {/* Select button */}
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="w-full cursor-pointer flex items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <span className="truncate">
                        {selected.length > 0
                            ? `${selected.length} category selected`
                            : "Select categories"}
                    </span>
                    <svg
                        className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""
                            }`}
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
                    <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
                        <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                            {sampleCategories.map((category) => {
                                const active = selected.includes(category);
                                return (
                                    <button
                                        key={category}
                                        onClick={() => toggleCategory(category)}
                                        className="w-full cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        {/* Radio-style indicator */}
                                        <div
                                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${active
                                                    ? "border-green-600"
                                                    : "border-gray-300"
                                                }`}
                                        >
                                            {active && (
                                                <div className="w-2 h-2 rounded-full bg-green-600" />
                                            )}
                                        </div>
                                        <span>{category}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
