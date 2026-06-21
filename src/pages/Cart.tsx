import { MoveRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  clearCartApi,
  getCart,
  removeFromCartApi,
  updateCartQuantityApi,
} from "../services/cart.service";
import Loading from "../components/Loading";

const Cart = () => {
  const queryClient = useQueryClient();

  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const removeMutation = useMutation({
    mutationFn: removeFromCartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Product removed");
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearCartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared");
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: updateCartQuantityApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  if (isLoading) {
    return <Loading/>
  }

  if (isError) {
    return <div className="py-20 text-center">Please login first.</div>;
  }

  const items = cart?.items || [];

  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-gray-500">Start shopping and add products.</p>
      </section>
    );
  }

  return (
    <section>
      <h1 className="mb-8 text-4xl font-bold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product._id}
              className="flex gap-5 rounded-3xl bg-white p-4 shadow"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-32 w-28 rounded-2xl object-cover"
              />

              <div className="flex flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>

                  <p className="text-gray-500">{item.product.brand}</p>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() =>
                        updateQuantityMutation.mutate({
                          productId: item.product._id,
                          quantity: item.quantity - 1,
                        })
                      }
                      className="h-8 w-8 rounded-full border"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantityMutation.mutate({
                          productId: item.product._id,
                          quantity: item.quantity + 1,
                        })
                      }
                      className="h-8 w-8 rounded-full border"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold">
                    ${item.product.price * item.quantity}
                  </p>
                </div>

                <button
                  onClick={() => removeMutation.mutate(item.product._id)}
                  className="text-red-500"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-3xl bg-white p-6 shadow">
          <h2 className="mb-4 text-2xl font-bold">Order Summary</h2>

          <div className="mb-4 flex justify-between">
            <span>Subtotal</span>
            <span>${totalPrice}</span>
          </div>

          <div className="mb-6 flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="mb-6 flex justify-between border-t pt-4 text-xl font-bold">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>

          <Link
            to="/checkout"
            className="block w-full rounded-full bg-black py-4 text-center text-white"
          >
            Checkout
          </Link>

          <button
            onClick={() => clearMutation.mutate()}
            className="mt-3 w-full rounded-full border py-4"
          >
            Clear Cart
          </button>
        </div>
        
      <Link to="/orders" className="flex items-center justify-between gap-4  px-3 py-1.5 hover:scale-105 hover:font-bold transition-all duration-300 border max-w-64 shadow">
        Show your orders
      <MoveRight/>
    
      </Link>
      </div>

    </section>
  );
};

export default Cart;
