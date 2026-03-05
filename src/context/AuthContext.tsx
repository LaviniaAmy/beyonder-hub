import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { providers } from "@/data/mockData";
import type { CategoryType } from "@/lib/featureGating";

export type UserRole = "parent" | "provider" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  provider_id?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "beyonder_user";

const TEST_PROVIDER_EMAILS: Record<string, CategoryType> = {
  "therapist@beyonder.test": "therapist",
  "club@beyonder.test": "club",
  "education@beyonder.test": "education",
  "charity@beyonder.test": "charity",
  "product@beyonder.test": "product",
};

function resolveProviderId(email: string): string {
  const lower = email.toLowerCase();

  // 1) Exact test email match
  const categoryTarget = TEST_PROVIDER_EMAILS[lower];
  if (categoryTarget) {
    const match = providers.find((p) => p.category_type === categoryTarget);
    if (match) return match.id;
  }

  // 2) Legacy "provider" keyword
  if (lower.includes("provider")) {
    return providers[0]?.id ?? "";
  }

  // 3) Any provider login — default to first provider so dashboard always loads
  return providers[0]?.id ?? "";
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = (email: string, _password: string, role: UserRole) => {
    const providerId = role === "provider" ? resolveProviderId(email) : undefined;
    const newUser: User = {
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      role,
      provider_id: providerId,
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
