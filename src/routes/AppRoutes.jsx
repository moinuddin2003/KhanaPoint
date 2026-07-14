import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../Pages/customer/Home";
import RestaurantDetail from "../Pages/customer/RestaurantDetail";
import Checkout from "../Components/cart/Checkout";
import Cart from "../Pages/customer/Cart";
import Login from "../Pages/auth/Login";
import Signup from "../Pages/auth/Signup";
import DashboardHome from "../Pages/admin/DashboardHome";
import AdminRoute from "./AdminRoute";
// import RestaurantDetail from "../Pages/customer/RestaurantDetaill/";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/restaurants" element={<RestaurantDetail />} />
        <Route path="/cart" element={<Cart />} />

        {/* Admin Section Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <DashboardHome />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
