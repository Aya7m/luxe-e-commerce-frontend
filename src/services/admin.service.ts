import { api } from "../lib/axios";
import type { Order } from "../types/order";

export const getAllOrdersApi = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>("/orders");
  return response.data;
};

export const updateOrderStatusApi = async (data: {
  orderId: string;
  status: string;
}) => {
  const response = await api.patch(`/orders/${data.orderId}/status`, {
    status: data.status,
  });

  return response.data;
};

import type { Product } from "../types/product";

export const createProductApi = async (
  data: Omit<Product, "_id" | "createdAt">,
): Promise<Product> => {
  const response = await api.post<Product>("/products", data);
  return response.data;
};

export const uploadImageApi = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<{ imageUrl: string }>("/upload", formData);

  return response.data.imageUrl;
};
export const updateProductApi = async (data: {
  productId: string;
  product: Omit<Product, "_id" | "createdAt">;
}): Promise<Product> => {
  const response = await api.patch<Product>(
    `/products/${data.productId}`,
    data.product,
  );

  return response.data;
};

export const deleteProductApi = async (productId: string): Promise<void> => {
  await api.delete(`/products/${productId}`);
};

// export const getAdminStatsApi = async () => {
//   const response = await api.get("/orders/admin");
//   const orders = response.data;

//   const totalSales = orders.reduce(
//     (total, order) => total + order.totalPrice,
//     0,
//   );

//   const pendingOrders = orders.filter(
//     (order) => order.status === "pending",
//   ).length;

//   return {
//     totalOrders: orders.length,
//     totalSales,
//     pendingOrders,
//   };
// };

import type { User } from "../types/user";

export const getUsersApi = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/auth/admin/users");
  return response.data;
};

export const updateUserRoleApi = async (data: {
  userId: string;
  role: "user" | "admin";
}): Promise<User> => {
  const response = await api.patch<User>(`/auth/admin/users/${data.userId}`, {
    role: data.role,
  });

  return response.data;
};






export const getAdminDashboard = async () => {
  const response = await api.get("/admin/stats");

  return response.data;
};