"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  age?: number;
  city?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  doctorName?: string;
  doctorPhone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoaded: boolean;
  login: (userData?: Partial<AuthUser>) => void;
  logout: () => void;
  updateUser: (userData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoaded: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
});

const STORAGE_KEY = "smitri_auth_user";
const LOGGED_IN_KEY = "smitri_logged_in";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedLoggedIn = localStorage.getItem(LOGGED_IN_KEY);
      const storedUser = localStorage.getItem(STORAGE_KEY);
      if (storedLoggedIn === "true" && storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      }
    } catch (e) {
      console.error("Failed to read auth state from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const login = (userData?: Partial<AuthUser>) => {
    const defaultUser: AuthUser = {
      name: "Kamla Devi",
      email: "kamla.devi@example.com",
      age: 68,
      city: "Guwahati, Assam",
      emergencyName: "Rahul Sharma (Son / Caregiver)",
      emergencyPhone: "+91 98765 43210",
      doctorName: "Dr. Manab Barua",
      doctorPhone: "+91 94350 12345",
    };

    const finalUser = { ...defaultUser, ...userData };
    setUser(finalUser);
    setIsLoggedIn(true);

    try {
      localStorage.setItem(LOGGED_IN_KEY, "true");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalUser));
      document.cookie = `smitri_auth=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
    } catch (e) {
      console.error("Failed to save auth state to localStorage", e);
    }
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);

    try {
      localStorage.removeItem(LOGGED_IN_KEY);
      localStorage.removeItem(STORAGE_KEY);
      document.cookie = "smitri_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch (e) {
      console.error("Failed to clear auth state", e);
    }

    router.push("/login");
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    setUser((prev) => {
      const updated = { ...(prev || {}), ...userData };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to update user in localStorage", e);
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isLoaded, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
