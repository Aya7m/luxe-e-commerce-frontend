import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageCircle,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const AdminLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-[#f8f5f0] lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-black p-6 text-white">
        <h1 className="mb-10 text-2xl font-bold">LUXE Admin</h1>

        <nav className="space-y-3">
          <NavLink
            to="/admin"
            end
            className="flex gap-3 rounded-2xl p-3 hover:bg-white/10"
          >
            <LayoutDashboard /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className="flex gap-3 rounded-2xl p-3 hover:bg-white/10"
          >
            <Package /> Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className="flex gap-3 rounded-2xl p-3 hover:bg-white/10"
          >
            <ShoppingBag /> Orders
          </NavLink>

          <NavLink
            to="/admin/chat"
            className="flex gap-3 rounded-2xl p-3 hover:bg-white/10"
          >
            <MessageCircle /> Chat
          </NavLink>
        </nav>
      </aside>

      <main className="p-6 lg:p-10">
        <header className="mb-8 flex items-center justify-between rounded-3xl bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm text-gray-500">Welcome back</p>
            <h2 className="text-2xl font-bold">Admin Panel</h2>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full bg-black px-5 py-3 text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
