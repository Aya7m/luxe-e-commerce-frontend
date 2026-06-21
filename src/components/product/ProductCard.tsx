import type { Product } from "../../types/product";
import { Heart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addToCartApi } from "../../services/cart.service";

import { useQuery } from "@tanstack/react-query";
import {
  getWishlistApi,
  toggleWishlistApi,
} from "../../services/wishlist.service";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const queryClient = useQueryClient();

  const { data: wishlist } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistApi,
    retry: false,
  });

  const wishlistProducts = (wishlist?.products || []).filter(Boolean);

  const liked = wishlistProducts.some((item) => item?._id === product._id);

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

  const toggleWishlistMutation = useMutation({
    mutationFn: toggleWishlistApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wishlist"],
      });

      toast.success("Wishlist updated");
    },

    onError: () => {
      toast.error("Wishlist failed");
    },
  });

  const handleAddToCart = (): void => {
    addToCartMutation.mutate({
      productId: product._id,
      quantity: 1,
    });
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow">
      <div className="aspect-[4/5] overflow-hidden bg-neutral-200">
        <Link
          to={`/products/${product._id}`}
          className="relative block h-full overflow-hidden"
        >
          <button
            onClick={(e) => {
              e.preventDefault();

              toggleWishlistMutation.mutate(product._id);
            }}
            className="absolute right-4 top-4 z-10 rounded-full bg-white p-3 shadow"
          >
            <Heart size={20} fill={liked ? "black" : "none"} />
          </button>

          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 hover:scale-110"
          />
        </Link>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-neutral-500">{product.brand}</p>

          <div className="flex items-center gap-1">
            <Star size={16} fill="currentColor" />
            <span className="text-sm">{product.rating}</span>
          </div>
        </div>

        <h3 className="mb-2 text-xl font-semibold">{product.name}</h3>

        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">${product.price}</p>

          <button
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
            className="rounded-full bg-black px-5 py-2 text-sm text-white disabled:opacity-50"
          >
            {addToCartMutation.isPending ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
