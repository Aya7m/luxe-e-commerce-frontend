import { persist } from "zustand/middleware";

import { create } from "zustand";
import type { Product } from "../types/product";

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (productId: number) => void;
  updateProduct: (productId: number, updatedProduct: Product) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],

      addProduct: (product) =>
        set((state) => ({
          products: [product, ...state.products],
        })),

      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter(
            (product) => product.id !== productId,
          ),
        })),

      updateProduct: (productId, updatedProduct) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId ? updatedProduct : product,
          ),
        })),
        
    }),
    { name: "luxury-products" },
  ),
);
