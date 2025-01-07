import axios from "axios";
import { useEffect, useState } from "react";

export default function User() {

  const [user, setUser] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("http://localhost:9090/user");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Your Account</h2>
        {JSON.stringify(user)}
      </div>
    </div>
  );
}
