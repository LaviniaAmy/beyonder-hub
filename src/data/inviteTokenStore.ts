export type InviteStatus = "pending" | "claimed" | "expired";

export interface InviteToken {
  token: string;
  providerId: string;
  providerName: string;
  email: string; // intended recipient email
  status: InviteStatus;
  createdAt: string;
  expiresAt: string;
  claimedAt?: string;
  claimedByEmail?: string;
}

// 30-day expiry
const EXPIRY_DAYS = 30;

function generateToken(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const inviteTokens: InviteToken[] = [];

export function createInviteToken(providerId: string, providerName: string, email: string): InviteToken {
  // Invalidate any existing pending token for this provider
  inviteTokens.forEach((t) => {
    if (t.providerId === providerId && t.status === "pending") {
      t.status = "expired";
    }
  });

  const token: InviteToken = {
    token: generateToken(),
    providerId,
    providerName,
    email,
    status: "pending",
    createdAt: new Date().toISOString(),
    expiresAt: addDays(EXPIRY_DAYS),
  };

  inviteTokens.push(token);
  return token;
}

export function validateToken(token: string): { valid: boolean; record?: InviteToken; reason?: string } {
  const record = inviteTokens.find((t) => t.token === token);
  if (!record) return { valid: false, reason: "This invite link is not recognised." };
  if (record.status === "claimed") return { valid: false, reason: "This invite link has already been used.", record };
  if (record.status === "expired" || new Date() > new Date(record.expiresAt)) {
    record.status = "expired";
    return { valid: false, reason: "This invite link has expired. Please contact Beyonder for a new one.", record };
  }
  return { valid: true, record };
}

export function redeemToken(token: string, claimedByEmail: string): boolean {
  const record = inviteTokens.find((t) => t.token === token);
  if (!record || record.status !== "pending") return false;
  record.status = "claimed";
  record.claimedAt = new Date().toISOString();
  record.claimedByEmail = claimedByEmail;
  return true;
}

export function getTokenForProvider(providerId: string): InviteToken | undefined {
  // Return the most recent token for this provider
  return [...inviteTokens]
    .filter((t) => t.providerId === providerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
}

export function getInviteStatus(providerId: string): "none" | InviteStatus {
  const token = getTokenForProvider(providerId);
  if (!token) return "none";
  // Sync expiry
  if (token.status === "pending" && new Date() > new Date(token.expiresAt)) {
    token.status = "expired";
  }
  return token.status;
}
