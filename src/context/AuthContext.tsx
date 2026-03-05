import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { providers } from "@/data/mockData";

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
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "beyonder_user";

// ── Exact email → role + provider_id map ──────────────────
const EMAIL_MAP: Record<string, { role: UserRole; provider_id?: string }> = {
  "admin@beyonder.com": { role: "admin" },
  "test@admin.com": { role: "admin" },
  "test@parent.com": { role: "parent" },
  "therapist@beyonder.test": {
    role: "provider",
    provider_id: providers.find((p) => p.category_type === "therapist")?.id,
  },
  "club@beyonder.test": { role: "provider", provider_id: providers.find((p) => p.category_type === "club")?.id },
  "education@beyonder.test": {
    role: "provider",
    provider_id: providers.find((p) => p.category_type === "education")?.id,
  },
  "charity@beyonder.test": { role: "provider", provider_id: providers.find((p) => p.category_type === "charity")?.id },
  "product@beyonder.test": { role: "provider", provider_id: providers.find((p) => p.category_type === "product")?.id },
};

function resolveUser(email: string): { role: UserRole; provider_id?: string } {
  const lower = email.toLowerCase().trim();
  // 1) Exact match
  if (EMAIL_MAP[lower]) return EMAIL_MAP[lower];
  // 2) Fallback — any unknown email logs in as parent
  return { role: "parent" };
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

  const login = (email: string, _password: string) => {
    const { role, provider_id } = resolveUser(email);
    const newUser: User = {
      id: crypto.randomUUID(),
      name: email.split("@")[0],
      email,
      role,
      provider_id,
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
