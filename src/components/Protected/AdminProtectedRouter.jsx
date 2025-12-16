import React from "react";
import { Navigate } from "react-router";
import { jwtDecode } from "jwt-decode";

export default function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("userToken");

  if (!token) return <Navigate to="/login" />;

  let decodedToken;
  try {
    decodedToken = jwtDecode(token);
  } catch (e) {
    return <Navigate to="/login" />;
  }

  const role = decodedToken["role"];

  if (role !== "admin" && role !== "superAdmin") {
    return <Navigate to="/login" />;
  }

  return children;
}
