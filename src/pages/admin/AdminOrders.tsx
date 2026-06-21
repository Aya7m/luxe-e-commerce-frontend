import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getAllOrdersApi,
  updateOrderStatusApi,
} from "../../services/admin.service";

const AdminOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAllOrdersApi,
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated");
    },
    onError: () => {
      toast.error("Failed to update order");
    },
  });

  if (isLoading) return <div>Loading orders...</div>;
  if (isError) return <div>Failed to load orders.</div>;

  return (
    <section>
      <h1 className="mb-8 text-4xl font-bold">Orders Management</h1>

      <div className="space-y-4">
        {orders?.map((order) => (
          <div key={order._id} className="rounded-3xl bg-white p-6 shadow">
            <div className="mb-4 flex justify-between gap-4">
              <div>
                <h2 className="font-bold">
                  {order.shippingAddress?.fullName || "Customer"}
                </h2>
                <p>{order.shippingAddress?.phone}</p>
                <p>{order.shippingAddress?.city}</p>
                <p className="text-sm text-gray-500">Order #{order._id}</p>
              </div>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatusMutation.mutate({
                    orderId: order._id,
                    status: e.target.value,
                  })
                }
                className="h-fit rounded-xl border p-2"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div className="space-y-2 border-t pt-4">
              {order.items?.map((item) => (
                <div key={item.product} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}

              <p className="border-t pt-3 font-bold">
                Total: ${order.totalPrice}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminOrders;