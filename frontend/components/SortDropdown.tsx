"use client";

import { useAuth } from "@/contexts/AuthContext";
import { SortField, SortOrder } from "@/lib/types";
import { useState, useRef, useEffect } from "react";


interface Props {
  field?: SortField;
  order?: SortOrder;
  onChange?: (field: SortField, order: SortOrder) => void;
}

export default function SortDropdown({ field = "relevance", order = "asc", onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<SortField>(field);
  const [selectedOrder, setSelectedOrder] = useState<SortOrder>(order);
  const authContext = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  const fields: { label: string; value: SortField }[] = [
    { label: "Relevance", value: "relevance" },
    { label: "Price", value: "price" },
    { label: "Created At", value: "created_at" },
    { label: "Rating", value: "rating" },
  ];

  const orders: { label: string; value: SortOrder }[] = [
    { label: "Ascending", value: "asc" },
    { label: "Descending", value: "desc" },
  ];

  const handleChange = (newField: SortField, newOrder: SortOrder) => {
    setSelectedField(newField);
    setSelectedOrder(newOrder);
    authContext?.updateSortMethodParams(newField, newOrder);
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
    <div className="flex items-center gap-3">
      {/* Label */}
      <span className="text-sm font-medium text-gray-600">
        Sort by
      </span>
      <div ref={ref} className="relative w-60">
        {/* Trigger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full cursor-pointer flex justify-between items-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 shadow-sm text-gray-800 text-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <span>
            {fields.find(f => f.value === selectedField)?.label}, {selectedOrder === "asc" ? "Ascending" : "Descending"}
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
          <div className="absolute z-20 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg p-2">
            {/* Sort field */}
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-700 mb-1">Sort By</p>
              <div className="flex flex-col gap-1">
                {fields.map(f => (
                  <button
                    key={f.value}
                    onClick={() => handleChange(f.value, selectedOrder)}
                    className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg text-sm
                    ${selectedField === f.value ? "bg-green-100 text-green-700" : "hover:bg-gray-50 text-gray-700"}
                  `}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort order */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Order</p>
              <div className="flex flex-col gap-1">
                {orders.map(o => (
                  <button
                    key={o.value}
                    onClick={() => handleChange(selectedField, o.value)}
                    className={`w-full cursor-pointer text-left px-3 py-2 rounded-lg text-sm
                    ${selectedOrder === o.value ? "bg-green-100 text-green-700" : "hover:bg-gray-50 text-gray-700"}
                  `}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
