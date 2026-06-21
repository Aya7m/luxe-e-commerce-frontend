import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { registerUser } from "../services/auth.service";
import { useAuthStore } from "../store/authStore";

const Register = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Account created successfully");
      navigate("/login");
    },
    onError: () => {
      toast.error("Register failed");
    },
  });

  const handleSubmit = (): void => {
    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    registerMutation.mutate({ name, email, password });
  };

  

  return (
    <section className="mx-auto mt-20 max-w-md rounded-3xl bg-white p-8 shadow">
      <h1 className="mb-6 text-3xl font-bold">Create Account</h1>

      <div className="space-y-4">
        <input
          className="w-full rounded-2xl border p-4"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          disabled={registerMutation.isPending}
          className="w-full rounded-full bg-black py-4 text-white disabled:opacity-50"
        >
          {registerMutation.isPending ? "Creating..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-black">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Register;