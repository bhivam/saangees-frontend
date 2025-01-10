//  https://www.youtube.com/watch?v=X9WULjvgqTY&list=PLlameCF3cMEuXdBAqa4v8CsbjGnpic71H

import React, {
  createContext,
  useState,
  useLayoutEffect,
  useCallback,
  ReactNode,
} from "react";
import axios, { InternalAxiosRequestConfig } from "axios";

interface User {
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login(username: string, password: string): Promise<void>;
  logout(): void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, _setIsAuthenticated] = useState(false);
  function setIsAuthenticated(value: boolean, location: string) {
    console.log("SETTING isAuthenticated TO ", value, "FROM ", location);
    _setIsAuthenticated(value);
  }
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  function saveUserToLocalStorage(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  function getUserFromLocalStorage(): User | null {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }

  function clearUserData(): void {
    localStorage.removeItem("user");
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false, "clearUserData");
  }

  async function login(username: string, password: string): Promise<void> {
    console.log(`Logging in as ${username}`);
    console.log(`Logging in with password ${password}`);

    try {
      const response = await axios.post(
        "http://localhost:3000/user/login",
        {
          email: username,
          password,
        },
        { withCredentials: true },
      );
      const { user, access_token: accessToken } = response.data;

      setAccessToken(accessToken);
      setUser(user);
      saveUserToLocalStorage(user);
      setIsAuthenticated(true, "login");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  function logout(): void {
    console.log("LOGGING OUT");
    try {
      axios.post("/user/logout");
    } catch (error) {
      console.warn("Failed to logout:", error);
    } finally {
      clearUserData();
    }
  }
  const refreshAccessToken = useCallback(async function (): Promise<string> {
    try {
      const response = await axios.get("http://localhost:3000/token/refresh", {
        withCredentials: true,
      });
      setAccessToken(response.data.access_token);
      setIsAuthenticated(true, "refreshAccessToken");
      console.log("REFRESHED TOKEN:", response.data.access_token);
      return response.data.access_token;
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearUserData();
      throw error;
    }
  }, []);

  interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
  }

  useLayoutEffect(() => {
    function registerInterceptors() {
      const requestInterceptor = axios.interceptors.request.use(
        (config: CustomAxiosRequestConfig) => {
          if (accessToken && !config._retry) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          return config;
        },
      );

      const responseInterceptor = axios.interceptors.response.use(
        (response) => {
          return response;
        },
        async (error) => {
          const originalRequest = error.config as CustomAxiosRequestConfig;

          // 1. Stop infinite loop by not retrying if the endpoint is /token/refresh
          //    or if we've already retried once (_retry).
          if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/token/refresh")
          ) {
            originalRequest._retry = true;
            try {
              // 2. Refresh only for non-refresh requests
              const newAccessToken = await refreshAccessToken();
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            } catch (refreshError) {
              console.error("Failed to refresh token:", refreshError);
              logout();
            }
          }

          return Promise.reject(error);
        },
      );

      return () => {
        axios.interceptors.request.eject(requestInterceptor);
        axios.interceptors.response.eject(responseInterceptor);
      };
    }

    const unregisterInterceptors = registerInterceptors();

    return function cleanup() {
      unregisterInterceptors();
    };
  }, [accessToken, refreshAccessToken]);

  useLayoutEffect(
    function () {
      const savedUser = getUserFromLocalStorage();

      if (!savedUser) {
        return;
      }

      setUser(savedUser);
      refreshAccessToken().catch(() => {
        clearUserData();
      });
    },
    [refreshAccessToken],
  );

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
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
