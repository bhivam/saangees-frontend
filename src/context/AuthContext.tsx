import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useLayoutEffect,
} from "react";
import axios, { InternalAxiosRequestConfig } from "axios";
import { baseUrl } from "../default";

interface User {
  name: string;
  phone_number: string;
  is_admin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login(username: string, password: string): Promise<void>;
  logout(): void;
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function saveAuthData(user: User): void {
    localStorage.setItem("authData", JSON.stringify({ user }));
  }

  function loadAuthData(): { token: string; user: User } | null {
    const data = localStorage.getItem("authData");
    return data ? JSON.parse(data) : null;
  }

  function clearAuthData(): void {
    // TODO call to logout endpoint to remove http only token
    localStorage.removeItem("authData");
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  }

  async function login(username: string, password: string): Promise<void> {
    try {
      const response = await axios.post(
        baseUrl("/token"),
        { phone_number: username, password },
        { withCredentials: true },
      );
      const user = response.data;

      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      saveAuthData(user);
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      throw error;
    }
  }

  function logout(): void {
    axios.delete(baseUrl("/token"), { withCredentials: true });
    clearAuthData();
  }

  function loadAuthInterceptor() {
    const requestInterceptor = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // config.headers.Authorization = `Bearer ${token}`;
        config.withCredentials = true;
        return config;
      },
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }

  function loadLogoutInterceptor() {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          clearAuthData();
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }

  useEffect(() => {
    const authData = loadAuthData();
    if (authData) {
      setUser(authData.user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useLayoutEffect(() => {
    return loadLogoutInterceptor();
  }, []);

  useLayoutEffect(() => {
    return loadAuthInterceptor();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, user, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
