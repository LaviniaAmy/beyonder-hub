// ── In-memory enquiry store ─────────────────────────────────
// Shared singleton so EnquiryPage writes and dashboards read
// from the same array within a session.

export interface EnquiryRecord {
  enquiryId: string;
  providerId: string;
  providerName: string;
  parentId: string;
  parentName: string;
  childAge: string;
  message: string;
  reply: string | null;
  statusForParent: "sent" | "replied";
  statusForProvider: "new" | "replied";
  createdAt: string;
  // ── Pre-build new fields ──
  isUnlocked: boolean; // true once parent has paid to view this thread
  messageCount: number; // increments per parent/provider turn (not auto-response)
  providerNotes: string; // private provider-only notes, never shown to parent
  customAnswers: { question: string; answer: string }[]; // custom enquiry form responses
}

import { enquiries } from "@/data/mockData";

const seeded: EnquiryRecord[] = enquiries.map((e) => ({
  enquiryId: e.id,
  providerId: e.providerId,
  providerName: e.providerName,
  parentId: "mock-parent",
  parentName: e.parentName,
  childAge: e.childAge,
  message: e.message,
  reply: e.reply ?? null,
  statusForParent: e.status === "replied" ? "replied" : "sent",
  statusForProvider: e.status === "replied" ? "replied" : "new",
  createdAt: e.date,
  // defaults for seeded records
  isUnlocked: false,
  messageCount: 0,
  providerNotes: "",
  customAnswers: [],
}));

export const enquiryStore: EnquiryRecord[] = [...seeded];

export function addEnquiry(record: EnquiryRecord) {
  enquiryStore.push(record);
}

export function replyToEnquiry(enquiryId: string, replyText: string) {
  const record = enquiryStore.find((e) => e.enquiryId === enquiryId);
  if (record) {
    record.reply = replyText;
    record.statusForParent = "replied";
    record.statusForProvider = "replied";
    record.messageCount = (record.messageCount ?? 0) + 1;
  }
}

/** Mark an enquiry thread as unlocked (called on payment confirmation). */
export function unlockEnquiry(enquiryId: string) {
  const record = enquiryStore.find((e) => e.enquiryId === enquiryId);
  if (record) {
    record.isUnlocked = true;
  }
}

/** Update provider's private notes on an enquiry. */
export function updateProviderNotes(enquiryId: string, notes: string) {
  const record = enquiryStore.find((e) => e.enquiryId === enquiryId);
  if (record) {
    record.providerNotes = notes;
  }
}

export function getEnquiriesForParent(parentId: string): EnquiryRecord[] {
  return enquiryStore.filter((e) => e.parentId === parentId);
}

export function getEnquiriesForProvider(providerId: string): EnquiryRecord[] {
  return enquiryStore.filter((e) => e.providerId === providerId);
}
