// ── Founder & claiming store ────────────────────────────────
// Shared singleton for claim state, founder logic, admin settings

export interface AdminSettings {
  founderLimit: number;
}

export interface ClaimRecord {
  providerId: string;
  claimedByUserId: string;
  claimantEmail: string;
  claimantDomain: string;
  planType: "founder" | "free";
  planStatus: "active";
  claimedAt: string;
}

export interface PendingClaim {
  id: string;
  providerId: string;
  providerName: string;
  websiteDomain: string;
  claimantEmail: string;
  claimantDomain: string;
  claimantUserId: string;
  status: "pending_review" | "approved" | "rejected";
  submittedAt: string;
}

// ── Admin settings ──
export const adminSettings: AdminSettings = {
  founderLimit: 200,
};

// ── Claim records (approved/auto claims) ──
export const claimRecords: ClaimRecord[] = [];

// ── Pending review queue ──
export const pendingClaims: PendingClaim[] = [];

// ── Plan overrides keyed by providerId ──
export const planOverrides: Record<
  string,
  {
    planType: string;
    planStatus: string;
    categoryType: string;
  }
> = {};

// ── Helpers ────────────────────────────────────────────────

export function extractDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase().trim() ?? "";
}

export function getFounderCount(): number {
  return claimRecords.filter((r) => r.planType === "founder" && r.planStatus === "active").length;
}

export function isProviderClaimed(providerId: string): boolean {
  return claimRecords.some((r) => r.providerId === providerId);
}

export function getClaimForProvider(providerId: string): ClaimRecord | undefined {
  return claimRecords.find((r) => r.providerId === providerId);
}

export function updateAdminSettings(newLimit: number) {
  adminSettings.founderLimit = newLimit;
}

export function applyPlanOverride(providerId: string, planType: string, planStatus: string, categoryType: string) {
  planOverrides[providerId] = { planType, planStatus, categoryType };
}

// ── Core claim logic ────────────────────────────────────────

function _assignPlan(userId: string, providerId: string, email: string): ClaimRecord {
  const founderCount = getFounderCount();
  const planType = founderCount < adminSettings.founderLimit ? "founder" : "free";
  const record: ClaimRecord = {
    providerId,
    claimedByUserId: userId,
    claimantEmail: email,
    claimantDomain: extractDomain(email),
    planType,
    planStatus: "active",
    claimedAt: new Date().toISOString().split("T")[0],
  };
  claimRecords.push(record);
  console.log("[Beyonder Founder Logic]", {
    founderLimit: adminSettings.founderLimit,
    founderCount,
    claimProviderId: providerId,
    assignedPlan: planType,
  });
  return record;
}

/**
 * Attempt to claim a listing.
 * Returns { success: true, record } if domain matches (auto-approved).
 * Returns { success: false, pending } if domain mismatch (pending review).
 * Returns { success: false, error: "already_claimed" } if already claimed.
 */
export type ClaimResult =
  | { outcome: "approved"; record: ClaimRecord }
  | { outcome: "pending_review"; pending: PendingClaim }
  | { outcome: "already_claimed" };

export function attemptClaim(
  userId: string,
  email: string,
  providerId: string,
  providerName: string,
  websiteDomain: string,
): ClaimResult {
  // Guard: already claimed
  if (isProviderClaimed(providerId)) {
    return { outcome: "already_claimed" };
  }

  const claimantDomain = extractDomain(email);
  const normalised = websiteDomain.toLowerCase().trim();

  console.log("[Beyonder Claim Attempt]", {
    claimProviderId: providerId,
    websiteDomain: normalised,
    claimantDomain,
    match: claimantDomain === normalised,
  });

  if (claimantDomain === normalised) {
    // ✅ Domain match — auto approve
    const record = _assignPlan(userId, providerId, email);
    return { outcome: "approved", record };
  } else {
    // ⏳ Domain mismatch — queue for admin review
    const pending: PendingClaim = {
      id: crypto.randomUUID(),
      providerId,
      providerName,
      websiteDomain: normalised,
      claimantEmail: email,
      claimantDomain,
      claimantUserId: userId,
      status: "pending_review",
      submittedAt: new Date().toISOString().split("T")[0],
    };
    pendingClaims.push(pending);
    return { outcome: "pending_review", pending };
  }
}

/** Admin approves a pending claim */
export function approvePendingClaim(pendingId: string): ClaimRecord | null {
  const pending = pendingClaims.find((p) => p.id === pendingId);
  if (!pending) return null;
  pending.status = "approved";
  const record = _assignPlan(pending.claimantUserId, pending.providerId, pending.claimantEmail);
  return record;
}

/** Admin rejects a pending claim */
export function rejectPendingClaim(pendingId: string) {
  const pending = pendingClaims.find((p) => p.id === pendingId);
  if (pending) pending.status = "rejected";
}

/** Legacy helper — used by ProviderDashboard plan copy */
export function assignPlanOnClaim(userId: string, providerId: string): ClaimRecord {
  return _assignPlan(userId, providerId, "");
}
