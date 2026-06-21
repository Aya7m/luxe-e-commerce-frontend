import { api } from "../lib/axios";

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCartApi = async (data: {
  productId: string;
  quantity: number;
}) => {
  const response = await api.post("/cart", data);
  return response.data;
};

export const removeFromCartApi = async (productId: string) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};

export const clearCartApi = async () => {
  const response = await api.delete("/cart");
  return response.data;
};

export const updateCartQuantityApi=async(data:{productId:string,quantity:number})=>{
  const res=await api.patch(`/cart/${data.productId}`,{
    quantity:data.quantity
  })
  return res.data

}