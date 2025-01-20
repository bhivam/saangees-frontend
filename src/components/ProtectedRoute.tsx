import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: "admin";
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while authentication state is being determined
  }

  if (!isAuthenticated) {
    console.log("User is not authenticated.");
    return <Navigate to="/auth" />;
  }

  if (requiredRole && !user?.is_admin) {
    console.log("User does not have the required admin role.", user);
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default ProtectedRoute;
