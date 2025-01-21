import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { baseUrl } from "../default";
import axios from "axios";

function PhoneNumberInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = e.target.value
      .replace(/[^0-9]/g, "")
      .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
      .slice(0, 14);
    onChange(formatted);
  }

  return (
    <input
      type="tel"
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-[#6CD0D0] focus:border-[#6CD0D0]"
      placeholder="(123) 456-7890"
      value={value}
      onChange={handleInput}
    />
  );
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to /user if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user");
    }
  }, [isAuthenticated, navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(phoneNumber.replace(/\D/g, ""), password);
      if (isAuthenticated) {
        navigate("/user");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await axios.post(baseUrl("/user/create"), {
        name,
        phone_number: phoneNumber.replace(/\D/g, ""),
        password,
      });

      if (response.status === 201) {
        await login(phoneNumber.replace(/\D/g, ""), password);
        if (isAuthenticated) {
          navigate("/user");
        }
      } else {
        console.error("Sign-up failed:", response.data);
      }
    } catch (err) {
      console.error("Sign-up failed:", err);
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
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <PhoneNumberInput value={phoneNumber} onChange={setPhoneNumber} />
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
            onClick={isLogin ? handleLogin : handleSignUp}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p className="text-sm text-center mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="text-[#F98128] font-bold hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
