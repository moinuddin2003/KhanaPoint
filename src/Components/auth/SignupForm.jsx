import React, { useState } from "react";
import { Link } from "react-router";
import { FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi";
const SignupForm = () => {
  const [showPassword, setShowPassword] = useState("false");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify("formData"));
    console.log(formData);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
    >
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#03081F]">Create Account</h2>

        <p className="mt-2 text-sm text-gray-500">
          Join KhanaPoint and start ordering your favourite meals.
        </p>
      </div>

      {/* Full Name */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-[#03081F]">
          Full Name
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="h-14 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-[#FC8A06]"
        />
      </div>

      {/* Email */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-[#03081F]">
          Email
        </label>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="h-14 w-full rounded-xl border border-gray-300 px-4 outline-none transition focus:border-[#FC8A06]"
        />
      </div>

      {/* Password */}
      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-[#03081F]">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "password" : "text"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password"
            className="h-14 w-full rounded-xl border border-gray-300 px-4 pr-14 outline-none transition focus:border-[#FC8A06]"
          />

          <button
            onClick={() => setShowPassword(!showPassword)}
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FC8A06]"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium text-[#03081F]">
          Confirm Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "password" : "text"}
            name="confirmpassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
            className="h-14 w-full rounded-xl border border-gray-300 px-4 pr-14 outline-none transition focus:border-[#FC8A06]"
          />

          <button
            onClick={() => setShowPassword(!showPassword)}
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FC8A06]"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
      </div>

      {/* Terms */}
      <div className="mb-6 flex items-center gap-3">
        <input type="checkbox" className="h-4 w-4 accent-[#FC8A06]" />

        <p className="text-sm text-gray-600">
          I agree to the Terms & Conditions
        </p>
      </div>

      {/* Button */}
      <button
        type="submit"
        className="h-14 w-full rounded-xl bg-[#FC8A06] font-semibold text-white transition hover:bg-[#e97d00]"
      >
        Create Account
      </button>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        {/* <span className="cursor-pointer font-semibold text-[#FC8A06] hover:underline">
          Sign In
        </span> */}
        <Link
          to="/login"
          className="font-semibold text-[#FC8A06] hover:underline"
        >
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
