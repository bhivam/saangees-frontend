import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../default";
import { useAuth } from "../context/AuthContext";

export default function User() {
  const { logout } = useAuth();
  const [user, setUser] = useState([]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(baseUrl("/user"), {});
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Your Account
        </h2>
        <p className="text-black">{JSON.stringify(user)}</p>
      </div>
      <button
        onClick={logout}
        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        logout
      </button>
    </div>
  );
}
