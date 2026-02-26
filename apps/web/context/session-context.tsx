'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { fetchApi } from "@/lib/api";
import type { User } from "@food-delivery/shared";

interface SessionContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function checkSession() {
    setLoading(true);

    try {
      const me = await fetchApi<User>("/api/users/me");
      setUser(me);
    } catch (error: any) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkSession();
  }, []);

  async function login(email: string, password: string) {
    setLoading(true);

    try {
      await fetchApi<{ user: User }>("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      await checkSession();   // fetch user data from /me using the new cookie
    } catch (error: any) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetchApi('/api/users/logout', { method: 'POST' });
    setUser(null);
  }

  return (
    <SessionContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
