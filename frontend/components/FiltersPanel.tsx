"use client";

import { useSearchParams } from "next/navigation";
import CategoryDropdown from "./CategoryDropdown";
import InStockDropdown from "./InStockDropdown";
import PaginationSizeDropdown from "./PaginationSizeDropdown";
import PriceFilter from "./PriceFilter";

export default function FiltersPanel() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const minPriceInit = params.get("minPrice") ? Number(params.get("minPrice")) : null;
  const maxPriceInit = params.get("maxPrice") ? Number(params.get("maxPrice")) : null;
  const inStockValue = params.get("inStock") === "true" ? "inStock" : params.get("inStock") === "false" ? "outOfStock" : "all";
  const paginationValue = params.get("pageSize") ? Number(params.get("pageSize")) : 20;
  const currentCategories = params.getAll('category') || [];
  
  return (
    <div className="w-64 p-5 rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Filters
        </h2>
        <span className="text-xs text-gray-400">Refine results</span>
      </div>
      <CategoryDropdown currentCategories={currentCategories} />
      <PriceFilter minPrice={minPriceInit} maxPrice={maxPriceInit} />
      <InStockDropdown value={inStockValue} />
      <PaginationSizeDropdown value={paginationValue} />
    </div>
  );
}
