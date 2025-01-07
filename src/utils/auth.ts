import axios from "axios";

import { AuthState } from "../providers/AuthProvider";

const API_URL = "http://localhost:3000";

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

// Login
export const login = async (
  email: string,
  password: string,
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>
): Promise<void> => {
  const response = await axios.post<{ accessToken: string }>(
    `${API_URL}/user/login`,
    { email, password },
    { withCredentials: true }
  );
  const { accessToken } = response.data;
  const user = await fetchUser(accessToken);
  setAuth({ isAuthenticated: true, accessToken, user });
};

// Signup
export const signup = async (
  email: string,
  name: string,
  password: string,
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>
): Promise<void> => {
  const response = await axios.post<{ accessToken: string }>(
    `${API_URL}/user/create`,
    { email, name, password, isAdmin: false },
  );
  
  if (response.status === 200) {
    login(email, password, setAuth);
  }
};

// Logout
export const logout = async (
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>
): Promise<void> => {
  await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true });
  setAuth({ isAuthenticated: false, accessToken: null, user: null });
};

// Refresh Access Token
export const refreshAccessToken = async (): Promise<string> => {
  const response = await axios.post<{ accessToken: string }>(
    `${API_URL}/token/refresh`,
    {},
    { withCredentials: true }
  );
  return response.data.accessToken;
};

// Fetch User Data
export const fetchUser = async (accessToken: string): Promise<User> => {
  const response = await axios.get<User>(`${API_URL}/user`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};
