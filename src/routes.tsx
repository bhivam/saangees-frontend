import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Menu from "./pages/Menu";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Menu />} />
      <Route path="/auth" element={<Auth />} />

      <Route path="/unauthorized" element={<h1>UNAUTHORIZED</h1>} />
      <Route path="/*" element={<h1>404 Page not found...</h1>} />
    </Routes>
  );
}
