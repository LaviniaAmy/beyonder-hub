import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { providers } from "@/data/mockData";
import { claimRecords, pendingClaims } from "@/data/founderStore";

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
  login: (email: string, password: string, forceRole?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "beyonder_user";

// ── Exact email → role + stable id + provider_id map ──────
const EMAIL_MAP: Record<string, { role: UserRole; id: string; name: string; provider_id?: string }> = {
  "admin@beyonder.com": { role: "admin", id: "admin-1", name: "Admin" },
  "test@admin.com": { role: "admin", id: "admin-2", name: "Admin" },
  "test@parent.com": { role: "parent", id: "parent-test", name: "Jane Smith" },
  "therapist@beyonder.test": {
    role: "provider",
    id: "provider-therapist",
    name: "Bright Minds Speech Therapy",
    provider_id: providers.find((p) => p.category_type === "therapist")?.id,
  },
  "club@beyonder.test": {
    role: "provider",
    id: "provider-club",
    name: "Splash Inclusive Swimming",
    provider_id: providers.find((p) => p.category_type === "club")?.id,
  },
  "education@beyonder.test": {
    role: "provider",
    id: "provider-education",
    name: "Learning Tree Tutoring",
    provider_id: providers.find((p) => p.category_type === "education")?.id,
  },
  "charity@beyonder.test": {
    role: "provider",
    id: "provider-charity",
    name: "SEND Families United",
    provider_id: providers.find((p) => p.category_type === "charity")?.id,
  },
  "product@beyonder.test": {
    role: "provider",
    id: "provider-product",
    name: "SensoryPlay Shop",
    provider_id: providers.find((p) => p.category_type === "product")?.id,
  },
};

function resolveUser(email: string): { role: UserRole; id: string; name: string; provider_id?: string } {
  const lower = email.toLowerCase().trim();

  // 1) Exact match in hardcoded map
  if (EMAIL_MAP[lower]) return EMAIL_MAP[lower];

  // 2) Approved claim record
  const approvedClaim = claimRecords.find((r) => r.claimantEmail.toLowerCase() === lower);
  if (approvedClaim) {
    return {
      role: "provider",
      id: `claim-${approvedClaim.providerId}`,
      name: lower.split("@")[0],
      provider_id: approvedClaim.providerId,
    };
  }

  // 3) Pending claim
  const pendingClaim = pendingClaims.find(
    (p) => p.claimantEmail.toLowerCase() === lower && p.status === "pending_review",
  );
  if (pendingClaim) {
    return {
      role: "provider",
      id: `claim-${pendingClaim.providerId}`,
      name: lower.split("@")[0],
      provider_id: pendingClaim.providerId,
    };
  }

  // 4) Fallback — stable id derived from email so it persists across logins
  return { role: "parent", id: `parent-${lower}`, name: lower.split("@")[0] };
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

  const login = (email: string, _password: string, forceRole?: UserRole) => {
    const resolved = resolveUser(email);
    const newUser: User = {
      id: resolved.id,
      name: resolved.name,
      email,
      role: forceRole ?? resolved.role,
      provider_id: resolved.provider_id,
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
