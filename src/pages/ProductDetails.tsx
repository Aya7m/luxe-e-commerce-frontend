import { useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, Star, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getProductById } from "../services/product.service";
import { addToCartApi } from "../services/cart.service";
import {
  createReviewApi,
  getProductReviewsApi,
} from "../services/review.service";
import {
  getWishlistApi,
  toggleWishlistApi,
} from "../services/wishlist.service";
import Loading from "../components/Loading";

const ProductDetails = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [quantity, setQuantity] = useState(1);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Product added to cart");
    },
    onError: () => {
      toast.error("Please login first");
    },
  });

  const productId = id!;

  const { data: productReviews = [] } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getProductReviewsApi(productId),
    enabled: !!productId,
  });

  const createReviewMutation = useMutation({
    mutationFn: createReviewApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      toast.success("Review added");
      setReviewName("");
      setReviewRating(5);
      setReviewComment("");
    },
    onError: () => {
      toast.error("Please login first");
    },
  });

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistApi,
  });

  const wishlistProducts = wishlist?.products || [];

  const liked = wishlistProducts?.some((item) => item?._id === product?._id);
  const toggleWishlistMutation = useMutation({
    mutationFn: toggleWishlistApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Wishlist updated");
    },
    onError: (error: any) => {
      console.log("WISHLIST ERROR:", error.response?.data);
      toast.error(error.response?.data?.message || "Wishlist failed");
    },
  });

  if (isLoading) {
    return <Loading/>
  }

  if (isError) {
    return <div className="py-20 text-center">Failed to load product.</div>;
  }

  if (!product) {
    return <div className="py-20 text-center">Product not found.</div>;
  }

  const handleAddToCart = (): void => {
    addToCartMutation.mutate({
      productId: product._id,
      quantity,
    });
  };

  const handleAddReview = (): void => {
    if (!reviewName || !reviewComment) {
      toast.error("Please fill review fields");
      return;
    }

    createReviewMutation.mutate({
      productId,
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
    });
  };

  return (
    <section className="grid gap-12 lg:grid-cols-2">
      <div className="overflow-hidden rounded-[2rem] bg-neutral-100 shadow-sm">
        <img
          src={product.image}
          alt={product.name}
          className="h-[650px] w-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-center">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-neutral-500">
          {product.brand}
        </p>

        <h1 className="text-5xl font-semibold">{product.name}</h1>

        <div className="mt-4 flex items-center gap-2">
          <Star size={18} fill="currentColor" />
          <span className="font-medium">{product.rating}</span>
          <span className="text-neutral-500">/ 5</span>
        </div>

        <p className="mt-6 text-3xl font-bold">${product.price}</p>

        <p className="mt-6 leading-8 text-neutral-600">{product.description}</p>

        <p className="mt-4 text-sm text-neutral-500">
          Stock: {product.stock} available
        </p>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            className="h-11 w-11 rounded-full border text-xl"
          >
            -
          </button>

          <span className="text-lg font-semibold">{quantity}</span>

          <button
            onClick={() => setQuantity((prev) => prev + 1)}
            className="h-11 w-11 rounded-full border text-xl"
          >
            +
          </button>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 rounded-full bg-black py-4 font-semibold text-white"
          >
            Add to Cart
          </button>

          <button
            onClick={() => toggleWishlistMutation.mutate(product._id)}
            className="rounded-full border px-5"
          >
            <Heart size={22} fill={liked ? "black" : "none"} />
          </button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <Truck className="mb-2" />
            <p className="font-semibold">Fast Delivery</p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <ShieldCheck className="mb-2" />
            <p className="font-semibold">Secure Payment</p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <RotateCcw className="mb-2" />
            <p className="font-semibold">Easy Returns</p>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t pt-8 lg:col-span-2">
        <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>

        <div className="mb-8 rounded-3xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Write a review</h3>

          <div className="grid gap-4">
            <input
              className="rounded-2xl border p-4"
              placeholder="Your name"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
            />

            <select
              className="rounded-2xl border p-4"
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
            >
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>

            <textarea
              className="rounded-2xl border p-4"
              placeholder="Your review"
              rows={4}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />

            <button
              onClick={handleAddReview}
              className="rounded-full bg-black py-4 text-white"
            >
              Submit Review
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {productReviews.length === 0 && (
            <p className="text-neutral-500">No reviews yet.</p>
          )}

          {productReviews.map((review) => (
            <div
              key={review._id}
              className="rounded-3xl bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex justify-between">
                <h4 className="font-semibold">{review.userName}</h4>
                <span>⭐ {review.rating}</span>
              </div>

              <p className="text-neutral-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
