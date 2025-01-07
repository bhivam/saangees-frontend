
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Users from "./pages/Users";
import User from "./pages/MyUser";


const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/auth" element={<Auth />} />
    <Route
      path="/users"
      element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      }
    />
    <Route
      path="/user"
      element={
        <ProtectedRoute requiredRole="admin">
          <User />
        </ProtectedRoute>
      }
    />
    <Route path="/unauthorized" element={<h1>UNAUTHORIZED</h1>} />
  </Routes>
);

export default AppRoutes;
