import { useQuery } from "@tanstack/react-query";
import { getMyOrdersApi } from "../services/order.service";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const Orders = () => {
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getMyOrdersApi,
  });
  console.log(orders);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div className="py-20 text-center">Failed to load orders.</div>;
  }

  if (orders.length === 0) {
    return (
      <section className="py-20 text-center">
        <h1 className="text-4xl font-bold">No orders yet</h1>
        <p className="mt-3 text-gray-500">Your orders will appear here.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="mb-8 text-4xl font-bold">My Orders</h1>

        <Link to="/chat" className="flex items-center gap-5 border px-3 py-1.5 rounded-md">
          <p className="font-medium"> Chat with Support</p>
          <MessageCircle />
        </Link>
      </div>

      <div className="space-y-5">
        {orders?.map((order) => (
          <div key={order._id} className="rounded-3xl bg-white p-6 shadow">
            <div className="mb-4 flex justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Order #{order._id}</h2>
                <p className="text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span className="h-fit rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                {order.status}
              </span>
            </div>

            <div className="mb-4 space-y-2">
              {order.items.map((item) => (
                <div key={item.product} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <p className="border-t pt-4 font-semibold">
              Total: ${order.totalPrice}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Orders;
