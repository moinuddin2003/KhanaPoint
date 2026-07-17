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
import Layout from "../Components/layout/Layout";
import CategoryPage from "../Components/menu/CategoryDetailPage";
import DealDetailPage from "../Components/menu/DealDetailPage";
import ScrollToTop from "../Components/common/ScrollToTop";
// import RestaurantDetail from "../Pages/customer/RestaurantDetaill/";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/deal/:dealId" element={<DealDetailPage />} />
          <Route path="/restaurants/:rest_id" element={<RestaurantDetail />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
        </Route>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

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
