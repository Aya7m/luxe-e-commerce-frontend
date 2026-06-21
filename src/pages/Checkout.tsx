import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getCart } from "../services/cart.service";
import {
  createOrderApi,
  createStripeCheckout,
} from "../services/order.service";

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  // CART
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const items = cart?.items || [];

  const totalPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // CASH ORDER
  const createOrderMutation = useMutation({
    mutationFn: createOrderApi,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

      toast.success("Order placed successfully");
      navigate("/orders");
    },

    onError: () => {
      toast.error("Failed to place order");
    },
  });

  localStorage.setItem(
  "shippingAddress",
  JSON.stringify({
    fullName,
    phone,
    address,
    city,
  })
);

  // STRIPE CHECKOUT
  const stripeMutation = useMutation({
    mutationFn: createStripeCheckout,

    onSuccess: (data) => {
      window.location.href = data.url;
    },

    onError: () => {
      toast.error("Failed to start Stripe checkout");
    },
  });

  // PLACE ORDER
  const handlePlaceOrder = (): void => {
    if (!fullName || !phone || !address || !city) {
      toast.error("Please fill all fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // CARD PAYMENT
    if (paymentMethod === "card") {
      stripeMutation.mutate({
        fullName,
        phone,
        address,
        city,
      });
      return;
    }

    // CASH PAYMENT
    createOrderMutation.mutate({
      shippingAddress: {
        fullName,
        phone,
        address,
        city,
      },
      paymentMethod: "cash",
    });
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_400px]">
      {/* FORM */}
      <div className="rounded-3xl bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold">Checkout</h1>

        <div className="space-y-4">
          <input
            className="w-full rounded-2xl border p-4"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            className="w-full rounded-2xl border p-4"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            className="w-full rounded-2xl border p-4"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            className="w-full rounded-2xl border p-4"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <select
            className="w-full rounded-2xl border p-4"
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod(e.target.value as "cash" | "card")
            }
          >
            <option value="cash">Cash on delivery</option>
            <option value="card">Credit Card (Stripe)</option>
          </select>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={
              createOrderMutation.isPending || stripeMutation.isPending
            }
            className="w-full rounded-full bg-black py-4 text-white disabled:opacity-50"
          >
            {createOrderMutation.isPending || stripeMutation.isPending
              ? "Processing..."
              : paymentMethod === "card"
              ? "Pay with Stripe"
              : "Place Order"}
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="h-fit rounded-3xl bg-white p-6 shadow">
        <h2 className="mb-4 text-2xl font-bold">Order Summary</h2>

        {items.map((item) => (
          <div
            key={item.product._id}
            className="mb-3 flex justify-between"
          >
           <img src={item.product.image} alt="" className="h-12 w-12 rounded-md" />
            <span>
              {item.product.name} × {item.quantity}
            </span>
            <span>
              ${item.product.price * item.quantity}
            </span>
          </div>
        ))}

        <div className="mt-4 flex justify-between border-t pt-4 text-xl font-bold">
          <span>Total</span>
          <span>${totalPrice}</span>
        </div>
      </div>
    </section>
  );
};

export default Checkout;