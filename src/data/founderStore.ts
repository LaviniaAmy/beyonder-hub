// ── Founder & claiming store ────────────────────────────────
// Shared singleton for claim state, founder logic, admin settings

export interface AdminSettings {
  founderLimit: number;
}

export interface ClaimRecord {
  providerId: string;
  claimedByUserId: string;
  planType: "founder" | "free";
  planStatus: "active";
  claimedAt: string;
}

// Admin-configurable settings
export const adminSettings: AdminSettings = {
  founderLimit: 200,
};

// All claim records
export const claimRecords: ClaimRecord[] = [];

// Provider plan overrides (keyed by providerId)
export const planOverrides: Record<string, { planType: string; planStatus: string; categoryType: string }> = {};

export function getFounderCount(): number {
  return claimRecords.filter((r) => r.planType === "founder" && r.planStatus === "active").length;
}

export function assignPlanOnClaim(userId: string, providerId: string): ClaimRecord {
  const founderCount = getFounderCount();
  const planType = founderCount < adminSettings.founderLimit ? "founder" : "free";

  const record: ClaimRecord = {
    providerId,
    claimedByUserId: userId,
    planType,
    planStatus: "active",
    claimedAt: new Date().toISOString().split("T")[0],
  };

  claimRecords.push(record);

  // QA log
  console.log("[Beyonder Founder Logic]", {
    founderLimit: adminSettings.founderLimit,
    founderCount,
    claimProviderId: providerId,
    assignedPlan: planType,
  });

  return record;
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
