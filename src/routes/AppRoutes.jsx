import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../Pages/customer/Home";
import RestaurantDetail from "../Pages/customer/RestaurantDetail";
import Checkout from "../Components/cart/Checkout";
import Cart from "../Pages/customer/Cart";
import Login from "../Pages/auth/Login";
import Signup from "../Pages/auth/Signup";
import AdminRoute from "./AdminRoute";
import CustomerRoute from "./CustomerRoute";
import Layout from "../Components/layout/Layout";
import CategoryPage from "../Components/menu/CategoryDetailPage";
import DealDetailPage from "../Components/menu/DealDetailPage";
import ScrollToTop from "../Components/common/ScrollToTop";

// Admin pages
import AdminLayout from "../Pages/admin/AdminLayout";
import DashboardHome from "../Pages/admin/DashboardHome";
import Analytics from "../Pages/admin/Analytics";
import Orders from "../Pages/admin/Orders";
import Restaurants from "../Pages/admin/Restaurants";
import Categories from "../Pages/admin/Categories";
import MenuItems from "../Pages/admin/MenuItems";
import Deals from "../Pages/admin/Deals";
import DealItems from "../Pages/admin/DealItems";
import ScrollToHash from "../Components/common/ScrollToHash";
import TrackOrder from "../Pages/customer/TrackOrder";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollToHash />
      <Routes>
        <Route
          path="/"
          element={
            <CustomerRoute>
              <Layout />
            </CustomerRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/deal/:dealId" element={<DealDetailPage />} />
          <Route path="/restaurants/:rest_id" element={<RestaurantDetail />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders/track" element={<TrackOrder />} />;
        </Route>

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Section — everything under /admin renders inside AdminLayout's
            sidebar/topbar shell via <Outlet />, and is guarded by AdminRoute. */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="orders" element={<Orders />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="categories" element={<Categories />} />
          <Route path="menu-items" element={<MenuItems />} />
          <Route path="deals" element={<Deals />} />
          <Route path="deal-items" element={<DealItems />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
