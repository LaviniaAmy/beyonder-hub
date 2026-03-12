// ── In-memory enquiry store ─────────────────────────────────
export interface ThreadMessage {
  messageId: string;
  senderId: "parent" | "provider";
  senderName: string;
  text: string;
  sentAt: string;
}

export interface EnquiryRecord {
  enquiryId: string;
  providerId: string;
  providerName: string;
  parentId: string;
  parentName: string;
  childAge: string;
  childName: string;
  needs: string;
  message: string;
  reply: string | null;
  messages: ThreadMessage[];
  statusForParent: "sent" | "replied";
  statusForProvider: "new" | "replied";
  createdAt: string;
  isUnlocked: boolean;
  messageCount: number;
  providerNotes: string;
  customAnswers: { question: string; answer: string }[];
}

// ── Cap: 6 total (parent 3, provider 3 — opener is message 1) ──
export const MESSAGE_CAP = 6;

import { enquiries } from "@/data/mockData";

const seeded: EnquiryRecord[] = enquiries.map((e) => {
  const messages: ThreadMessage[] = [
    {
      messageId: `${e.id}-msg-0`,
      senderId: "parent",
      senderName: e.parentName,
      text: e.message,
      sentAt: e.date,
    },
  ];
  if (e.reply) {
    messages.push({
      messageId: `${e.id}-msg-1`,
      senderId: "provider",
      senderName: e.providerName,
      text: e.reply,
      sentAt: e.date,
    });
  }
  return {
    enquiryId: e.id,
    providerId: e.providerId,
    providerName: e.providerName,
    parentId: "parent-test",
    parentName: e.parentName,
    childAge: e.childAge,
    childName: "",
    needs: "",
    message: e.message,
    reply: e.reply ?? null,
    messages,
    statusForParent: e.status === "replied" ? "replied" : "sent",
    statusForProvider: e.status === "replied" ? "replied" : "new",
    createdAt: e.date,
    isUnlocked: false,
    messageCount: messages.length,
    providerNotes: "",
    customAnswers: [],
  };
});

export const enquiryStore: EnquiryRecord[] = [...seeded];

export function addEnquiry(record: EnquiryRecord) {
  record.messageCount = record.messages.length;
  enquiryStore.push(record);
}

export function replyToEnquiry(enquiryId: string, replyText: string, providerName: string) {
  const record = enquiryStore.find((e) => e.enquiryId === enquiryId);
  if (!record || record.messages.length >= MESSAGE_CAP) return;
  if (!isProviderTurn(record)) return;
  record.messages.push({
    messageId: crypto.randomUUID(),
    senderId: "provider",
    senderName: providerName,
    text: replyText,
    sentAt: new Date().toISOString().split("T")[0],
  });
  record.reply = replyText;
  record.statusForParent = "replied";
  record.statusForProvider = "replied";
  record.messageCount = record.messages.length;
}

export function parentReplyToEnquiry(enquiryId: string, text: string, parentName: string) {
  const record = enquiryStore.find((e) => e.enquiryId === enquiryId);
  if (!record || record.messages.length >= MESSAGE_CAP) return;
  if (!isParentTurn(record)) return;
  record.messages.push({
    messageId: crypto.randomUUID(),
    senderId: "parent",
    senderName: parentName,
    text,
    sentAt: new Date().toISOString().split("T")[0],
  });
  record.statusForProvider = "new";
  record.messageCount = record.messages.length;
}

export function unlockEnquiry(enquiryId: string) {
  const record = enquiryStore.find((e) => e.enquiryId === enquiryId);
  if (record) record.isUnlocked = true;
}

export function updateProviderNotes(enquiryId: string, notes: string) {
  const record = enquiryStore.find((e) => e.enquiryId === enquiryId);
  if (record) record.providerNotes = notes;
}

export function getEnquiriesForParent(parentId: string): EnquiryRecord[] {
  return enquiryStore.filter((e) => e.parentId === parentId);
}

export function getEnquiriesForProvider(providerId: string): EnquiryRecord[] {
  return enquiryStore.filter((e) => e.providerId === providerId);
}

// ── Shared display helpers (used by both dashboards) ─────────

export function messagesRemaining(record: EnquiryRecord): number {
  return Math.max(0, MESSAGE_CAP - record.messages.length);
}

export function isAtCap(record: EnquiryRecord): boolean {
  return record.messages.length >= MESSAGE_CAP;
}

/** Provider's turn = last message was sent by parent */
export function isProviderTurn(record: EnquiryRecord): boolean {
  if (!record.messages.length) return false;
  return record.messages[record.messages.length - 1].senderId === "parent";
}

/** Parent's turn = last message was sent by provider */
export function isParentTurn(record: EnquiryRecord): boolean {
  if (!record.messages.length) return false;
  return record.messages[record.messages.length - 1].senderId === "provider";
}

/** Messages remaining for parent (3 max per side) */
export function messagesRemainingForParent(record: EnquiryRecord): number {
  const parentCount = record.messages.filter((m) => m.senderId === "parent").length;
  return Math.max(0, 3 - parentCount);
}

/** Messages remaining for provider (3 max per side) */
export function messagesRemainingForProvider(record: EnquiryRecord): number {
  const providerCount = record.messages.filter((m) => m.senderId === "provider").length;
  return Math.max(0, 3 - providerCount);
}
