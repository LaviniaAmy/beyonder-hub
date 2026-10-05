// ── Browser persistence (interim) ───────────────────────────
// Keeps admin/provider data across refreshes until the Supabase migration (Phase 5).
// Data lives in this browser only — it is not shared between devices.

export function loadSaved<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable or full — keep working in memory */
  }
}
