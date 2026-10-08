"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";

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
  caregiverRelation?: string;
  preferredLanguage?: string;
  isDemo?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoaded: boolean;
  login: (userData?: Partial<AuthUser>) => void;
  loginWithSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithSupabase: (
    email: string,
    password: string,
    userData: Partial<AuthUser>
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  isLoaded: false,
  login: () => {},
  loginWithSupabase: async () => ({ success: false }),
  signUpWithSupabase: async () => ({ success: false }),
  logout: async () => {},
  updateUser: () => {},
});

const STORAGE_KEY = "smitri_auth_user";
const LOGGED_IN_KEY = "smitri_logged_in";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // Initialize session from Supabase or localStorage
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          // Supabase session exists
          const email = session.user.email;
          const userMeta = session.user.user_metadata || {};
          const authUser: AuthUser = {
            id: session.user.id,
            email: email || '',
            name: userMeta.name || email?.split('@')[0] || 'Member',
            age: userMeta.age || 68,
            emergencyName: userMeta.emergencyName || 'Caregiver',
            emergencyPhone: userMeta.emergencyPhone || '+91 98765 43210',
            city: userMeta.city,
            isDemo: false,
          };
          setUser(authUser);
          setIsLoggedIn(true);
          localStorage.setItem(LOGGED_IN_KEY, "true");
          localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
          document.cookie = `smitri_auth=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
          setIsLoaded(true);
          return;
        }
      } catch (e) {
        console.warn("Supabase session check skipped or failed:", e);
      }

      // Check localStorage for demo session or previous login
      try {
        const storedLoggedIn = localStorage.getItem(LOGGED_IN_KEY);
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedLoggedIn === "true" && storedUser && mounted) {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Failed to read auth state from localStorage", e);
      } finally {
        if (mounted) setIsLoaded(true);
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * 1-Click Demo Login (Kamla Devi / Demo User)
   */
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
      isDemo: true,
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

  /**
   * Supabase Cloud Email/Password Authentication
   */
  const loginWithSupabase = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data?.user) {
        const userMeta = data.user.user_metadata || {};
        const finalUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || email,
          name: userMeta.name || email.split('@')[0],
          age: userMeta.age || 68,
          emergencyName: userMeta.emergencyName || 'Rahul (Caregiver)',
          emergencyPhone: userMeta.emergencyPhone || '+91 98765 43210',
          city: userMeta.city,
          isDemo: false,
        };

        setUser(finalUser);
        setIsLoggedIn(true);

        localStorage.setItem(LOGGED_IN_KEY, "true");
        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalUser));
        document.cookie = `smitri_auth=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;

        return { success: true };
      }

      return { success: false, error: "Failed to retrieve user session" };
    } catch (err: any) {
      return { success: false, error: err?.message || "Authentication error" };
    }
  };

  /**
   * Supabase Cloud Sign-Up + Cloud Database Profile Creation
   */
  const signUpWithSupabase = async (
    email: string,
    password: string,
    userData: Partial<AuthUser>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name || 'Elderly Member',
            age: userData.age || 68,
            emergencyName: userData.emergencyName || 'Caregiver',
            emergencyPhone: userData.emergencyPhone || '+91 98765 43210',
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      const finalUser: AuthUser = {
        id: data.user?.id || `user_${Date.now()}`,
        email,
        name: userData.name || 'Elderly Member',
        age: userData.age || 68,
        emergencyName: userData.emergencyName || 'Caregiver',
        emergencyPhone: userData.emergencyPhone || '+91 98765 43210',
        isDemo: false,
      };

      // Also sync user profile into PostgreSQL via API
      try {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: finalUser.id,
            email: finalUser.email,
            name: finalUser.name,
            age: finalUser.age,
            emergencyName: finalUser.emergencyName,
            emergencyPhone: finalUser.emergencyPhone,
          }),
        });
      } catch (syncErr) {
        console.warn('Profile sync during sign up deferred:', syncErr);
      }

      setUser(finalUser);
      setIsLoggedIn(true);

      localStorage.setItem(LOGGED_IN_KEY, "true");
      localStorage.setItem(STORAGE_KEY, JSON.stringify(finalUser));
      document.cookie = `smitri_auth=true; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Sign-up error" };
    }
  };

  const logout = async () => {
    setUser(null);
    setIsLoggedIn(false);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase sign out error:", e);
    }

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
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoaded,
        login,
        loginWithSupabase,
        signUpWithSupabase,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
