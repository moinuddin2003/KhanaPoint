import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";

import { toast } from "react-toastify";

import { loginUser } from "../../services/authApi";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const data = await loginUser(formData);
      console.log(data);
      console.log(formData);

      if (data?.message) {
        console.log("Full Data inside login success:", data.data);
        login(data.data, data.token, formData.remember);
        toast.success(data.message);

        console.log("Full Data inside login success:", data.data);
        if (data.data && data.data.is_admin === true) {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Heading */}

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#03081F]">Welcome Back 👋</h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to continue ordering your favourite meals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}

        <div className="relative">
          <label className="absolute -top-2 left-4 bg-white px-2 text-xs font-medium text-[#FC8A06]">
            Email Address
          </label>

          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="h-14 w-full rounded-xl border border-gray-300 pl-12 pr-4 outline-none transition focus:border-[#FC8A06]"
          />
        </div>

        {/* Password */}

        <div className="relative">
          <label className="absolute -top-2 left-4 bg-white px-2 text-xs font-medium text-[#FC8A06]">
            Password
          </label>

          <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="h-14 w-full rounded-xl border border-gray-300 pl-12 pr-14 outline-none transition focus:border-[#FC8A06]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-400"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {/* Remember & Forgot */}

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="h-4 w-4 accent-[#FC8A06]"
            />
            Remember Me
          </label>

          <button
            type="button"
            className="text-sm font-medium text-[#FC8A06] hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {/* Button */}

        <button
          disabled={loading}
          type="submit"
          className="h-14 w-full rounded-full bg-[#FC8A06] font-semibold text-white transition hover:bg-[#E97B05]"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup */}

        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[#FC8A06] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </>
  );
};

export default LoginForm;
