"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { EmptyState, FiltersPanel, LoadingSkeleton, PaginationControls, ResultsList, SortDropdown } from "@/components";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "next/navigation";
import { FIRST_PAGE } from "@/lib/constants";

export default function HomePage() {
  const authContext = useAuth();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const currentSortField = params.get("sort") || "relevance";
  const currentSortOrder = params.get("method") || "asc";

  const { data: totalProducts, isLoading } = useSWR(
    authContext?.backendQuery,
    fetcher
  );

  const handlePageChange = (page: number) => {
    authContext?.updateSearchParams(
      "page",
      page === FIRST_PAGE ? "" : String(page),
      page === FIRST_PAGE ? "delete" : "set"
    );

    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-6">
        {/* Filters panel */}
        <aside className="hidden md:block">
          <FiltersPanel />
        </aside>

        {/* Results & sort */}
        <section className="flex-1 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <SortDropdown field={currentSortField as any} order={currentSortOrder as any} />
            {isLoading && <p className="text-gray-500">Loading...</p>}
          </div>

          {/* Results */}
          {isLoading ? (
            <LoadingSkeleton />
          ) : totalProducts?.data?.length === 0 ? (
            <EmptyState />
          ) : (
            <ResultsList items={totalProducts?.data} />
          )}

          {/* Pagination */}
          <PaginationControls totalPages={totalProducts?.meta?.totalPages} onPageChange={handlePageChange} />
        </section>
      </main>
    </div>
  );
}
