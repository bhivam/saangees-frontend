import { Routes, Route } from "react-router-dom";
import PR from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import Users from "./pages/Users";
import User from "./pages/MyUser";
import Menu from "./pages/Menu";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/auth" element={<Auth />} />

      <Route path="/user" element={<PR role="user" element={<User />} />} />
      <Route path="/users" element={<PR role="admin" element={<Users />} />} />

      <Route path="/unauthorized" element={<h1>UNAUTHORIZED</h1>} />
    </Routes>
  );
}
