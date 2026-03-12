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
    // FIX #3: count all messages already in the thread (parent + optional reply)
    messageCount: messages.length,
    providerNotes: "",
    customAnswers: [],
  };
});

export const enquiryStore: EnquiryRecord[] = [...seeded];

export function addEnquiry(record: EnquiryRecord) {
  enquiryStore.push(record);
}

/** Provider sends a reply — adds to thread, updates status */
export function replyToEnquiry(enquiryId: string, replyText: string, providerName: string) {
  const record = enquiryStore.find((e) => e.enquiryId === enquiryId);
  if (!record) return;
  const msg: ThreadMessage = {
    messageId: crypto.randomUUID(),
    senderId: "provider",
    senderName: providerName,
    text: replyText,
    sentAt: new Date().toISOString().split("T")[0],
  };
  record.messages.push(msg);
  record.reply = replyText;
  record.statusForParent = "replied";
  record.statusForProvider = "replied";
  // FIX #3: increment based on actual messages array length
  record.messageCount = record.messages.length;
}

/** Parent sends a follow-up message in an unlocked thread */
export function parentReplyToEnquiry(enquiryId: string, text: string, parentName: string) {
  const record = enquiryStore.find((e) => e.enquiryId === enquiryId);
  if (!record) return;
  // FIX #3: cap check against messages.length (source of truth)
  if (record.messages.length >= 4) return;
  const msg: ThreadMessage = {
    messageId: crypto.randomUUID(),
    senderId: "parent",
    senderName: parentName,
    text,
    sentAt: new Date().toISOString().split("T")[0],
  };
  record.messages.push(msg);
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
