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
  email: string;
  is_admin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login(username: string, password: string): Promise<void>;
  logout(): void;
  user: User | null;
  accessToken: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function saveAuthData(token: string, user: User): void {
    localStorage.setItem("authData", JSON.stringify({ token, user }));
  }

  function loadAuthData(): { token: string; user: User } | null {
    const data = localStorage.getItem("authData");
    return data ? JSON.parse(data) : null;
  }

  function clearAuthData(): void {
    localStorage.removeItem("authData");
    setAccessToken(null);
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
      const { token, user } = response.data;

      setAccessToken(token.token);
      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      saveAuthData(token.token, user);
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      throw error;
    }
  }

  function logout(): void {
    clearAuthData();
  }

  function loadAuthInterceptor(token: string) {
    const requestInterceptor = axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${token}`;
        }
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
      setAccessToken(authData.token);
      setUser(authData.user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  useLayoutEffect(() => {
    return loadLogoutInterceptor();
  }, []);

  useLayoutEffect(() => {
    if (!accessToken) {
      return;
    }
    return loadAuthInterceptor(accessToken);
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, user, accessToken, loading }}
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
