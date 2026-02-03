"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DEFAULT_STOCK_FILTER } from "@/lib/constants";
import { StockFilterOption } from "@/lib/types";
import { useState, useRef, useEffect } from "react";

interface Props {
    value?: StockFilterOption;
    onChange?: (val: StockFilterOption) => void;
}

export default function InStockDropdown({ value = "all", onChange }: Props) {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<StockFilterOption>(value);
    const ref = useRef<HTMLDivElement>(null);
    const authContext = useAuth();

    const options: { label: string; value: StockFilterOption }[] = [
        { label: "All", value: "all" },
        { label: "In Stock", value: "inStock" },
        { label: "Out of Stock", value: "outOfStock" },
    ];

    const handleSelect = (value: StockFilterOption) => {
        setSelected(value);
        onChange?.(value);

        const shouldDelete = value === DEFAULT_STOCK_FILTER;
        const inStockValue =
            value === "inStock" ? "true" : "false";

        authContext?.updateSearchParams(
            "inStock",
            shouldDelete ? "" : inStockValue,
            shouldDelete ? "delete" : "set"
        );

        setOpen(false);
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
            <span className="font-medium text-gray-700">In Stock</span>
            <div ref={ref} className="relative w-full max-w-xs">
                {/* Select button */}
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="w-full cursor-pointer flex justify-between items-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 shadow-sm text-gray-800 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <span>
                        {selected === "all"
                            ? "All"
                            : selected === "inStock"
                                ? "In Stock"
                                : "Out of Stock"}
                    </span>
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
                    <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
                        <div className="p-2">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg text-smtransition ${selected === opt.value
                                        ? "bg-green-100 text-green-700"
                                        : "hover:bg-gray-50 text-gray-700"
                                        }
                                    `}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
