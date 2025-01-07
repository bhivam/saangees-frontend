import React, { createContext, useContext, useState, useEffect } from "react";
import { refreshAccessToken, fetchUser } from "../utils/auth";

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
}

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextProps {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
    user: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = await refreshAccessToken();
        const user = await fetchUser(accessToken);
        setAuth({ isAuthenticated: true, accessToken, user });
      } catch {
        setAuth({ isAuthenticated: false, accessToken: null, user: null });
      }
    };

    initializeAuth();
  }, []);

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

