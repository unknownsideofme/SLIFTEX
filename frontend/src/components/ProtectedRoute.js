import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const authToken = localStorage.getItem("authToken"); // Check for auth token

  // If the auth token does not exist, redirect to the login page
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  // If the auth token exists, allow access to the protected route
  return <Outlet />;
};

export default ProtectedRoute;
