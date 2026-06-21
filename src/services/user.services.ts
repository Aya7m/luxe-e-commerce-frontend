import { api } from "../lib/axios";

export const getUsersApi = async () => {
  const res = await api.get("/auth/admin/users");
  return res.data;
};