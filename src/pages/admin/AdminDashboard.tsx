import { Package, ShoppingBag, MessageCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../../services/admin.service";

const AdminDashboard = () => {
 

  // const { data: stats } = useQuery({
  //   queryKey: ["admin-stats"],
  //   queryFn: getAdminStatsApi,
  // });



  const { data: dashboard, error, isLoading } = useQuery({
  queryKey: ["admin-dashboard"],
  queryFn: getAdminDashboard,
});

console.log({ dashboard, error, isLoading });
  return (
    <section>
      <h1 className="mb-8 text-4xl font-bold">Admin Dashboard</h1>

      <div className="mb-8 grid gap-6 md:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow">
          <Package />
          <p className="mt-4 text-gray-500">Products</p>
          <h2 className="text-3xl font-bold">{dashboard?.productCounts }</h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <ShoppingBag />
          <p className="mt-4 text-gray-500">Orders</p>
          <h2 className="text-3xl font-bold">{dashboard?.ordersCount ??0}</h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <MessageCircle />
          <p className="mt-4 text-gray-500">Messages</p>
          <h2 className="text-3xl font-bold">{dashboard?.messageCount  ??0}</h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow">
          <Users />
          <p className="mt-4 text-gray-500">Sales</p>
          <h2 className="text-3xl font-bold">${dashboard?.totalSale}</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link
          to="/admin/products"
          className="rounded-3xl bg-black p-6 text-white"
        >
          Manage Products
        </Link>

        <Link
          to="/admin/orders"
          className="rounded-3xl bg-black p-6 text-white"
        >
          Manage Orders
        </Link>

        <Link to="/admin/chat" className="rounded-3xl bg-black p-6 text-white">
          Customer Chat
        </Link>
      </div>
    </section>
  );
};

export default AdminDashboard;
