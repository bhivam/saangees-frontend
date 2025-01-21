import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  element: React.ReactElement;
  role: "admin" | "user";
}

export default function PR({ element, role }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();
  let node = element;

  if (loading) {
    node = <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log("User is not authenticated.");
    node = <Navigate to="/auth" />;
  }

  if (role === "admin" && !user?.is_admin) {
    console.log("User does not have the required admin role.", user);
    node = <Navigate to="/unauthorized" />;
  }

  return node;
}
