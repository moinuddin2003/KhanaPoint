import { Navigate } from "react-router";

const CustomerRoute = ({ children }) => {
  const userString = localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (user?.is_admin === true) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default CustomerRoute;