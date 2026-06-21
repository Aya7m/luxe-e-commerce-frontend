import { api } from "../lib/axios";
import type { Product } from "../types/product";

export interface WishListResponse {
  _id: string;
  user?: string;
  products: Product[];
}

export const getWishlistApi = async (): Promise<WishListResponse> => {
  const response = await api.get<WishListResponse>("/wishlist");
  return response.data;
};

export const toggleWishlistApi = async (
  productId: string,
): Promise<WishListResponse> => {
  const response = await api.post<WishListResponse>(`/wishlist/${productId}`);
  return response.data;
};
