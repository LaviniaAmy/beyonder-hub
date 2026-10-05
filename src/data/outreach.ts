// ── Outreach status ─────────────────────────────────────────
// One status per provider for the admin, combining both claim routes:
// invite links (inviteTokenStore) and the organic "Claim this profile" flow (founderStore).
import { claimRecords, pendingClaims } from "@/data/founderStore";
import { getInviteStatus, getTokenForProvider } from "@/data/inviteTokenStore";

export type OutreachState = "not_contacted" | "invite_sent" | "invite_expired" | "claim_pending" | "claimed";

export interface OutreachStatus {
  state: OutreachState;
  /** ISO date of the event behind the status, when there is one. */
  date?: string;
  /** How it was claimed, or the email the invite went to. */
  detail?: string;
}

export const OUTREACH_LABEL: Record<OutreachState, string> = {
  not_contacted: "Not contacted",
  invite_sent: "Invite sent",
  invite_expired: "Invite expired",
  claim_pending: "Claim under review",
  claimed: "Claimed",
};

export function getOutreachStatus(providerId: string): OutreachStatus {
  const claim = claimRecords.find((r) => r.providerId === providerId);
  const token = getTokenForProvider(providerId);
  const inviteStatus = getInviteStatus(providerId);

  if (claim || inviteStatus === "claimed") {
    const viaInvite = inviteStatus === "claimed" && token?.claimedByEmail?.toLowerCase() === claim?.claimantEmail.toLowerCase();
    return {
      state: "claimed",
      date: claim?.claimedAt ?? token?.claimedAt,
      detail: `${viaInvite || !claim ? "via invite" : "directly"}${claim?.claimantEmail ? ` · ${claim.claimantEmail}` : ""}`,
    };
  }
  const pending = pendingClaims.find((p) => p.providerId === providerId && p.status === "pending_review");
  if (pending) return { state: "claim_pending", date: pending.submittedAt, detail: pending.claimantEmail };
  if (inviteStatus === "pending" && token) return { state: "invite_sent", date: token.createdAt, detail: token.email || undefined };
  if (inviteStatus === "expired" && token) return { state: "invite_expired", date: token.expiresAt, detail: token.email || undefined };
  return { state: "not_contacted" };
}

export const formatOutreachDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("en-GB") : "");
