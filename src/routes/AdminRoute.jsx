import React from "react";
import { Navigate } from "react-router"; // Matching your routing library import

const AdminRoute = ({ children }) => {
  const userString =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  // If there is no logged-in user, or they are not an admin, boot them back to the login page
  if (!user || user.is_admin !== true) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the admin page component
  return children;
};

export default AdminRoute;
