import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../Pages/customer/Home";
import RestaurantDetail from "../Pages/customer/RestaurantDetail";
import Checkout from "../Components/cart/Checkout";
import Cart from "../Pages/customer/Cart";
import Login from "../Pages/auth/Login";
import Signup from "../Pages/auth/Signup";
// import RestaurantDetail from "../Pages/customer/RestaurantDetaill/";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/restaurant" element={<RestaurantDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
