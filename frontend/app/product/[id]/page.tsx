"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { ProductDetail, SingleLoadingSkeleton } from "@/components";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProductPage() {
  const { status } = useSession();
  const pathname = usePathname();
  const currentId = pathname?.split("/")?.at(-1);
  const { data: currentProduct, isLoading } = useSWR(
    `/products/${currentId}`,
    fetcher
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const backUrl = `/?${params?.toString()}`;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status]);

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <button
          className="mb-4 text-blue-600 cursor-pointer"
          onClick={() => router.push(backUrl)}
        >
          ← Back to results
        </button>
      </div>
      {isLoading || status === "loading" ?
        <SingleLoadingSkeleton /> :
        <ProductDetail product={currentProduct} />
      }
    </div>
  );
}
