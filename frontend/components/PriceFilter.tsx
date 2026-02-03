"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface Props {
  minPrice?: number | null;
  maxPrice?: number | null;
  onApply?: (min: number | null, max: number | null) => void;
}

const toNumberOrNull = (value: string): number | null =>
  value === "" ? null : Number(value);

export default function PriceFilter({ minPrice = null, maxPrice = null, onApply }: Props) {
  const [min, setMin] = useState(() =>
    minPrice != null ? String(minPrice) : ""
  );
  const [max, setMax] = useState(() =>
    maxPrice != null ? String(maxPrice) : ""
  );
  const [isValid, setIsValid] = useState(true);
  const authContext = useAuth();

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setMin(val);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setMax(val);
    }
  };

  useEffect(() => {
    const minNum = toNumberOrNull(min);
    const maxNum = toNumberOrNull(max);

    setIsValid(
      minNum === null ||
      maxNum === null ||
      minNum <= maxNum
    );
  }, [min, max]);

  const handleApply = () => {
    if (!isValid) return;

    const toParam = (value: string) => (value ? String(Number(value)) : "");

    const minParam = toParam(min);
    const maxParam = toParam(max);

    authContext?.updateMinMaxPriceParams(minParam, maxParam);
  };

  const handleReset = () => {
    setMin("");
    setMax("")
    authContext?.updateMinMaxPriceParams("", "");
  }

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm">
      <div className="flex gap-2">
        {/* Min Price */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
          <input
            type="text"
            value={min}
            onChange={handleMinChange}
            placeholder="0"
            className={`w-full px-4 py-2 rounded-xl border shadow-sm text-gray-800 text-smfocus:outline-none focus:ring-2 focus:ring-green-500
              ${!isValid ? "border-red-400" : "border-gray-300"}
            `}
          />
        </div>

        {/* Max Price */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
          <input
            type="text"
            value={max}
            onChange={handleMaxChange}
            placeholder="0"
            className={`w-full px-4 py-2 rounded-xl border shadow-sm text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-green-500
              ${!isValid ? "border-red-400" : "border-gray-300"}
            `}
          />
        </div>
      </div>

      {/* Error Message */}
      {!isValid && (
        <p className="text-red-500 text-sm">Min price cannot be greater than Max price.</p>
      )}

      {/* Apply Button */}
      <button
        onClick={handleApply}
        disabled={!isValid}
        className={`mt-1 w-full cursor-pointer py-2 rounded-xl text-white text-sm font-medium transition
          ${isValid ? "bg-green-600 hover:bg-green-700" : "bg-green-300 cursor-not-allowed"}
        `}
      >
        Apply Price Filter
      </button>
      <button
        onClick={handleReset}
        className={`mt-1 w-full cursor-pointer py-2 rounded-xl text-white text-sm font-medium transition bg-red-600 hover:bg-red-700`}
      >
        Reset Price Filter
      </button>
    </div>
  );
}
