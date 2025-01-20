import axios from "axios";
import { useEffect, useState } from "react";
import { baseUrl } from "../default";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(baseUrl("/user/list"), {});
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {users.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            User List
          </h2>
          <ul className="space-y-2">
            {users.map((user, i) => (
              <li
                key={i}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 overflow-x-auto"
              >
                {JSON.stringify(user)}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <h1 className="text-xl font-semibold text-gray-500">No users found</h1>
      )}
    </div>
  );
}
