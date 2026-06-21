import { Route, Routes } from "react-router-dom";
import Home from "./pages/Hom";
import Products from "./pages/Products";
import MainLayout from "./components/layouts/MainLayout";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import { Toaster } from "react-hot-toast";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminChat from "./pages/admin/AdminChat";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Register from "./pages/Register";
import PaymentSuccess from "./pages/PaymentSuccess";

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AdminLayout />}>
          <Route
            path="/admin/chat"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminChat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />

          <Route path="/chat" element={<Chat />} />
          <Route path="/wishlist" element={<Wishlist />} />

          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
