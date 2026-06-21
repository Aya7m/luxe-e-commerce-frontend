import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/auth.service";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Logged in successfully");

      if (data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    },
    onError: () => {
      toast.error("Invalid email or password");
    },
  });

  const handleSubmit = (): void => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <section className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow mt-24">
      <h1 className="mb-6 text-3xl font-bold">Login , Welcome in Luxe</h1>

      <div className="space-y-4">
        <input
          className="w-full rounded-2xl border p-4"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded-2xl border p-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loginMutation.isPending}
          className="w-full rounded-full bg-black py-4 text-white disabled:opacity-50"
        >
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-12">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-black mt-4">
          Register
        </Link>
      </p>
    </section>
  );
};

export default Login;
