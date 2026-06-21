import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types/product";
import type { WishlistItem } from "../types/whishlist";


interface WishlistState {
  items: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.items.some(
            (item) => item.product.id === product.id
          );

          if (exists) {
            return {
              items: state.items.filter(
                (item) => item.product.id !== product.id
              ),
            };
          }

          return {
            items: [...state.items, { product }],
          };
        }),

      isInWishlist: (productId) =>
        get().items.some((item) => item.product.id === productId),
    }),
    {
      name: "luxury-wishlist",
    }
  )
);