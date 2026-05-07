"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { authApi, auth } from "@/lib/api";
import type { StaffPayload } from "@/lib/types";

interface AuthContextValue {
  staff: StaffPayload | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = useState<StaffPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check if a token already exists and is valid
    if (auth.isLoggedIn()) {
      authApi
        .me()
        .then(setStaff)
        .catch(() => auth.clearToken()) // token expired or invalid — clear it
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(email: string, password: string) {
    // authApi.login() already calls auth.setToken() internally
    await authApi.login(email, password);
    const me = await authApi.me();
    setStaff(me);
  }

  function logout() {
    auth.clearToken();
    setStaff(null);
  }

  return (
    <AuthContext.Provider value={{ staff, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
