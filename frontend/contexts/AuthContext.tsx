"use client";
import { SortField, SortOrder, UpdateMode } from "@/lib/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useContext, useState, useCallback } from "react";

interface AuthContextType {
  backendQuery: string;
  setBackendQuery: (value: string) => void;
  updateSearchParams: (name: string, value: string, mode: "set" | "append" | "delete") => void;
  params: URLSearchParams;
  toggleCategoryParams: (categoryName: string) => void;
  updateMinMaxPriceParams: (minPrice?: string, maxPrice?: string) => void;
  updateSortMethodParams: (sortField: SortField, sortOrder: SortOrder) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const [backendQuery, setBackendQuery] = useState(`/products/search` + (params?.toString() ? `?${params.toString()}` : ""));

  const updateSearchParams = useCallback(
    (
      name: string,
      value: string,
      mode: UpdateMode = "set"
    ) => {
      const params = new URLSearchParams(window.location.search);

      switch (mode) {
        case "append":
          params.append(name, value);
          break;
        case "delete":
          params.delete(name);
          break;
        default:
          params.set(name, value);
      }

      if (name !== "page") {
        params.delete("page");
      }

      const queryString = params.toString();
      const url = `${pathname}?${queryString}`;

      setBackendQuery(`/products/search?${queryString}`);
      router.replace(url);
    },
    [pathname, router]
  );

  const toggleCategoryParams = useCallback(
    (category: string) => {
      const params = new URLSearchParams(window.location.search);
      const categories = params.getAll("category");

      params.delete("category");

      const nextCategories = categories.includes(category)
        ? categories.filter(c => c !== category)
        : [...categories, category];

      nextCategories.forEach(c => params.append("category", c));

      params.delete("page");

      const queryString = params.toString();

      setBackendQuery(`/products/search?${queryString}`);
      router.replace(`${pathname}?${queryString}`);
    },
    [pathname, router]
  );

  const updateMinMaxPriceParams = useCallback(
    (minPrice?: string, maxPrice?: string) => {
      const params = new URLSearchParams(window.location.search);

      minPrice
        ? params.set("minPrice", minPrice)
        : params.delete("minPrice");

      maxPrice
        ? params.set("maxPrice", maxPrice)
        : params.delete("maxPrice");

      params.delete("page");

      const queryString = params.toString();

      setBackendQuery(`/products/search?${queryString}`);
      router.replace(`${pathname}?${queryString}`);
    },
    [pathname, router]
  );

  const updateSortMethodParams = useCallback(
    (sortField: SortField, sortOrder: SortOrder) => {
      const params = new URLSearchParams(window.location.search);

      sortField === "relevance"
        ? params.delete("sort")
        : params.set("sort", sortField);

      sortOrder === "asc"
        ? params.delete("method")
        : params.set("method", sortOrder);

      params.delete("page");

      const queryString = params.toString();
      const url = `${pathname}?${queryString}`;

      setBackendQuery(`/products/search?${queryString}`);
      router.replace(url);
    },
    [pathname, router]
  );

  return (
    <AuthContext.Provider
      value={{
        backendQuery,
        setBackendQuery,
        updateSearchParams,
        params,
        toggleCategoryParams,
        updateMinMaxPriceParams,
        updateSortMethodParams
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
