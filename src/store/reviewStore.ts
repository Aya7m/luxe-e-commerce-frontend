import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Review } from "../types/review";

interface ReviewState {
  reviews: Review[];
  addReview: (review: Review) => void;
  getProductReviews: (productId: number) => Review[];
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (review) =>
        set((state) => ({
          reviews: [review, ...state.reviews],
        })),

      getProductReviews: (productId) =>
        get().reviews.filter((review) => review.productId === productId),
    }),
    {
      name: "luxury-reviews",
    }
  )
);