import { useState } from "react";
import { useAuth } from "../providers/AuthProvider";
import { login, signup } from "../utils/auth";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(false); // Toggle between login and sign-up

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { setAuth } = useAuth();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      if (!isLogin)
        await signup(email, name, password, setAuth);
      else
        await login(email, password, setAuth);
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        <form className="space-y-4">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#6CD0D0] focus:border-[#6CD0D0]"
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

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
            onClick={async (e) => await handleSubmit(e)}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Toggle Between Login and Sign Up */}
        <p className="text-sm text-center text-gray-600 mt-4">
          {isLogin ? (
            <>
              Don't have an account yet?{" "}
              <span
                className="text-[#6CD0D0] font-bold cursor-pointer hover:underline"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-[#6CD0D0] font-bold cursor-pointer hover:underline"
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
