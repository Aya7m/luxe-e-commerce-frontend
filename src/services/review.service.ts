import { api } from "../lib/axios";

export interface Review {
  _id: string;
  product: string;
  user: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const getProductReviewsApi = async (
  productId: string,
): Promise<Review[]> => {
  const res = await api.get<Review[]>(`/reviews/${productId}`);
  return res.data;
};

export const createReviewApi = async (data: {
  productId: string;
  userName: string;
  rating: number;
  comment: string;
}): Promise<Review> => {
  const res = await api.post<Review>(`/reviews/${data.productId}`, {
    userName: data.userName,
    rating: data.rating,
    comment: data.comment,
  });
  return res.data;
};
