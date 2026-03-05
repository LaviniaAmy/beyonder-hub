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
}

// Seed with existing mock enquiries so dashboards aren't empty on first load
import { enquiries, providers } from "@/data/mockData";

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
  }
}

export function getEnquiriesForParent(parentId: string): EnquiryRecord[] {
  return enquiryStore.filter((e) => e.parentId === parentId);
}

export function getEnquiriesForProvider(providerId: string): EnquiryRecord[] {
  return enquiryStore.filter((e) => e.providerId === providerId);
}
