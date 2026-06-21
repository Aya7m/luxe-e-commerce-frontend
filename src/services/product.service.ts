import { api } from "../lib/axios";
import type { Product } from "../types/product";



export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: string;
}

export interface ProductsResponse {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}

export const getProducts = async (
  filters?: ProductFilters
): Promise<ProductsResponse> => {
  const response = await api.get(
    "/products",
    {
      params: filters,
    }
  );

  return response.data;
};

export const getProductById = async (
  id: string
): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};


