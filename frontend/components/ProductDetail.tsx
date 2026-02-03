"use client";

import { categoryColors } from "@/lib/colors";
import { Product } from "@/lib/types";

interface Props {
  product: Product;
}

export default function ProductDetail({ product }: Props) {
  const subImageProduct = product?.images?.filter((image) => !image?.isPrimary);
  const subImageProductLength = subImageProduct?.length;
  const rating = product?.rating || 0;
  const roundedRating = Math.round(rating);

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col gap-6">
      {/* Product Image */}
      <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow">
        <img
          src={product?.images?.find((image) => image?.isPrimary)?.url}
          alt={product?.name}
          className="w-full cursor-pointer h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* inStock badge */}
        <span
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium shadow ${product.inStock ? "bg-green-100 text-green-700" : "bg-gray-200/80 text-gray-600"
            }`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Sub Images */}
      {subImageProductLength > 0 && (
        <div
          className={`grid ${subImageProductLength === 2
              ? "grid-cols-2"
              : subImageProductLength === 3
                ? "grid-cols-3"
                : subImageProductLength === 4
                  ? "grid-cols-4"
                  : "grid-cols-1"
            } gap-3`}
        >
          {subImageProduct.map((image) => (
            <div
              key={image?.id}
              className="relative w-full aspect-square overflow-hidden rounded-2xl border border-gray-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              <img src={image?.url} alt={product?.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {product?.categories?.map((category) => {
          const colorClass = categoryColors[category?.name] || "bg-gray-100 text-gray-800";
          return (
            <span key={category?.id} className={`${colorClass} px-3 py-1 rounded-full text-sm font-medium shadow-sm`}>
              {category?.name}
            </span>
          );
        })}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-gray-900">{product?.name}</h1>
        <p className="text-gray-600 text-base leading-relaxed">{product?.description}</p>
        <p className="text-2xl font-semibold text-blue-600">${product?.price?.toFixed(2)}</p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2">
            {/* Rating */}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-[20px]
                      ${star <= roundedRating
                        ? "text-yellow-400"
                        : "text-gray-300"}
                    `}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="ml-1 text-md">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4">
        <button className="px-6 cursor-pointer py-3 bg-blue-600 text-white font-medium rounded-xl shadow transition-all duration-200 hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500">
          Add to Cart
        </button>
        <button className="px-6 cursor-pointer py-3 border border-gray-300 text-gray-700 rounded-xl shadow-sm transition-all duration-200 hover:bg-gray-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-gray-300">
          Buy Now
        </button>
      </div>
    </div>
  );
}
