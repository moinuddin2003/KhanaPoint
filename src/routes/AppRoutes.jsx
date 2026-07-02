import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../Pages/customer/Home";
import RestaurantDetail from "../Pages/customer/RestaurantDetail";
// import RestaurantDetail from "../Pages/customer/RestaurantDetaill/";
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant" element={<RestaurantDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
