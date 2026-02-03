export type SortField = "relevance" | "price" | "created_at" | "rating";
export type SortOrder = "asc" | "desc";
export type UpdateMode = "set" | "append" | "delete";
export type StockFilterOption = "all" | "inStock" | "outOfStock";

export interface ProductImage {
  id: number;
  url: string;
  order: number;
  isPrimary: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  rating: number;
  inStock: boolean;
  images: ProductImage[];
  categories: ProductCategory[];
  created_at: string;
  updated_at: string;
}
