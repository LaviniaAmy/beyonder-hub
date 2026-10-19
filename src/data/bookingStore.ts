// ── Call bookings (Live consultation) ───────────────────────
// TEST VERSION: saved in this browser only (see persist.ts). The specialists and time slots are still sample
// data (beyonder-app/data.ts) — nothing reaches a specialist yet. Moves to Supabase with payments.
import { loadSaved, save } from "@/data/persist";
import type { SharedProfile } from "@/data/enquiryStore";

export interface BookingRecord {
  bookingId: string;
  parentId: string;
  parentName: string;
  specialistId: string;
  specialistName: string;
  specialistRole: string;
  slot: string;
  price: string;
  format: string;
  childName: string;
  childAge: string;
  needs: string;
  message: string;
  status: "requested" | "confirmed" | "cancelled";
  createdAt: string;
  sharedProfile?: SharedProfile;
}

const STORAGE_KEY = "beyonder_bookings_v1";
const bookings: BookingRecord[] = loadSaved<BookingRecord[]>(STORAGE_KEY) ?? [];

export function addBooking(b: BookingRecord) {
  bookings.push(b);
  save(STORAGE_KEY, bookings);
}

export function getBookingsForParent(parentId: string): BookingRecord[] {
  return bookings.filter((b) => b.parentId === parentId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
