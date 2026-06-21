import { api } from "../lib/axios";
import type { Order } from "../types/order";

export const createOrderApi = async (data: {
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  paymentMethod: "cash" | "card";
}): Promise<Order> => {
  const response = await api.post<Order>("/orders", data);
  return response.data;
};

export const getMyOrdersApi = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>("/orders/my-order");
  return response.data;
};

export const getAllOrdersApi = async () => {
  const response = await api.get("/orders");

  return response.data;
};

export const updateOrderStatusApi = async (
  orderId: string,
  status: string
) => {
  const response = await api.patch(
    `/orders/admin/${orderId}`,
    { status }
  );

  return response.data;
};

export const createStripeCheckout = async (data: any) => {
  const res = await api.post("/orders/checkout-session", data);
  return res.data;
};

export const confirmStripePaymentApi = async (data: any) => {
  const response = await api.post(
    "/orders/confirm-payment",
    data
  );

  return response.data;
};