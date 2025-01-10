import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to /user if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("isAuthenticated is ", isAuthenticated);
      navigate("/user");
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    try {
      await login(email, password);
      if (isAuthenticated) {
        navigate("/user"); 
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login
        </h1>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#6CD0D0] focus:border-[#6CD0D0]"
              placeholder="example@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#6CD0D0] focus:border-[#6CD0D0]"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-[#F98128] text-white font-bold rounded-lg hover:bg-[#D96F20] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F98128]"
            onClick={handleSubmit}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
