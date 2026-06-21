import { Link } from "react-router-dom";
import { Search, Heart, ShoppingBag } from "lucide-react";

import { useAuthStore } from "../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "../services/cart.service";

function Navbar() {
  const { user, logout } = useAuthStore();
  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!user,
    retry: false,
  });

  const cartCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-2xl font-bold">
          LUXE
        </Link>

        <nav className="hidden md:flex gap-8">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/wishlist">Wishlist</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Search size={20} />
          <Link to="/wishlist">
            <Heart size={20} />
          </Link>
          <Link to="/cart" className="relative">
            <ShoppingBag size={22} />

            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <span>Hello, {user.name}</span>
          ) : (
            <Link to="/login">Login</Link>
          )}
          {user && (
            <button
              onClick={logout}
              className="cursor-pointer border text-red-500 px-3 py-1.5 rounded-b-2xl rounded-r-2xl hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
