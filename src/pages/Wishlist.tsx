import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ProductCard from "../components/product/ProductCard";
import { getWishlistApi,  toggleWishlistApi } from "../services/wishlist.service";


const Wishlist = () => {
  const queryClient = useQueryClient();

  const {
    data: wishlist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistApi,
  });

  const toggleWishlistMutation = useMutation({
    mutationFn: toggleWishlistApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Wishlist updated");
    },
    onError: () => {
      toast.error("Please login first");
    },
  });

  if (isLoading) {
    return <div className="py-20 text-center">Loading wishlist...</div>;
  }

  if (isError) {
    return <div className="py-20 text-center">Please login first.</div>;
  }

const products = (wishlist?.products || []).filter(Boolean);

  if (products.length === 0) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold">Wishlist is empty</h1>
        <p className="mt-3 text-gray-500">Save products you love.</p>
      </section>
    );
  }

  return (
    <section>
      <h1 className="mb-8 text-4xl font-bold">Wishlist</h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product._id} className="relative">
            <ProductCard product={product} />

            <button
              onClick={() => toggleWishlistMutation.mutate(product._id)}
              className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 shadow"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Wishlist;