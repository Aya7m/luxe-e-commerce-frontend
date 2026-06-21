import { api } from "../lib/axios";
import type { User } from "../types/user";

interface LoginData {
  email: string;
  password: string;
}
interface RegisterData {
  name: string;
  email: string;
  password: string;
}
interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
};

export const registerUser = async (
  data: RegisterData,
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};
