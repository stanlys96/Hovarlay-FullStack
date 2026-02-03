"use client";

import { categoryColors } from "@/lib/colors";
import { Product } from "@/lib/types";
import ProtectedLink from "./ProtectedLink";
import { useSearchParams } from "next/navigation";

interface Props {
  items: Product[];
}

export default function ResultsList({ items }: Props) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items?.map((item) => {
        const primaryImage = item?.images?.find((x) => x.isPrimary)?.url;
        const rating = item?.rating ?? 0;
        const roundedRating = Math.round(rating);
        return (
          <ProtectedLink
            key={item.id}
            href={`/product/${item.id}?${params?.toString()}`}
            className="group block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={primaryImage}
                alt={item?.name}
                className="
                  w-full h-full object-cover
                  transition-transform duration-300
                  group-hover:scale-105
                "
              />
              {item?.categories?.length > 0 && (
                <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
                  {item.categories.map((category, index) => {
                    const colorClass =
                      categoryColors[category?.name] ||
                      "bg-gray-100/80 text-gray-800";

                    return (
                      <span
                        key={index}
                        className={`${colorClass} px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur`}
                      >
                        {category?.name}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Stock badge */}
              <div className="absolute bottom-3 left-3">
                {item.inStock ? (
                  <span className="bg-green-100/80 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur">
                    In Stock
                  </span>
                ) : (
                  <span className="bg-gray-200/80 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-semibold text-gray-900 text-lg truncate">
                {item?.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= roundedRating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-1 text-xs">
                  {rating.toFixed(1)}
                </span>
              </div>

              {/* Description */}
              {item?.description && (
                <p className="text-gray-600 text-sm leading-snug">
                  {item.description.length > 100
                    ? `${item.description.slice(0, 100)}...`
                    : item.description}
                </p>
              )}

              {/* Price */}
              <p className="text-blue-600 font-semibold text-base">
                ${item?.price.toFixed(2)}
              </p>
            </div>
          </ProtectedLink>
        );
      })}
    </div>
  );
}
