import { useEffect, useRef, useState } from "react";
import "./beyonderApp.css";

const seenKey = (id: string) => `beyonder-tip-${id}`;
const hasSeen = (id: string) => { try { return localStorage.getItem(seenKey(id)) === "1"; } catch { return false; } };
const markSeen = (id: string) => { try { localStorage.setItem(seenKey(id), "1"); } catch { /* unavailable */ } };

/** Small perched starling — the "here's how it works" symbol. */
export const PerchedStarling = ({ size = 40 }: { size?: number }) => (
  <svg className="ba-starling" width={size} height={size * 0.8} viewBox="0 0 40 32" aria-hidden="true">
    <path d="M3 24.5 9.5 20.8C12 14 18 10.6 24.6 11.2 27 8.4 30.6 7.6 33.6 9.2L38.4 10.4 34.2 11.8C34.4 15.6 31.4 19.6 26.4 21.4 21.6 23.1 15 23.2 10.4 22.2Z" fill="#1B1A35" />
    <path d="M13.5 17.6C17 15.2 21 14.6 25 15.4" stroke="#8BA5BE" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <path d="M20 22.4 19.2 28M24 22 24.6 28" stroke="#1B1A35" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="32" cy="10.4" r="1.15" fill="#D98A6A" />
  </svg>
);

interface Props {
  /** Unique tip id — each tip shows once per device. */
  id: string;
  text: string;
  /** True while the screen holding the tip is showing. */
  active: boolean;
  /** Positioned element the tip is placed in (the screen). */
  container: () => HTMLElement | null;
  /** Element the arrow points at. */
  target: () => HTMLElement | null;
  /** Where on the target the arrow points, as a fraction of its height (0 = top edge). */
  yAt?: number;
  /** Point at the target's centre, or near its left edge. */
  align?: "center" | "start";
  /** Hide as soon as this changes (e.g. the user picked something). */
  dismissKey?: unknown;
}

/** One-off explainer bubble with a perched starling. Fades in, stays a few seconds, fades out. */
const StarlingTip = ({ id, text, active, container, target, yAt = 0, align = "center", dismissKey }: Props) => {
  const [pos, setPos] = useState<{ left: number; bottom: number; arrow: number } | null>(null);
  const [visible, setVisible] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (!active || hasSeen(id)) return;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => {
      const c = container(), t = target();
      if (!c || !t) return;
      const cr = c.getBoundingClientRect(), tr = t.getBoundingClientRect();
      const width = Math.min(260, cr.width - 32);
      const pointX = align === "center" ? tr.left + tr.width / 2 - cr.left : tr.left - cr.left + 28;
      const left = Math.max(16, Math.min(cr.width - width - 16, pointX - width / 2));
      const pointY = tr.top - cr.top + tr.height * yAt;
      setPos({ left, bottom: cr.height - pointY + 10, arrow: Math.max(18, Math.min(width - 18, pointX - left)) });
      setVisible(true);
      markSeen(id);
      timers.push(window.setTimeout(() => setVisible(false), 4500));
    }, 700));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, id]);

  useEffect(() => { if (!active) setVisible(false); }, [active]);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setVisible(false);
  }, [dismissKey]);

  if (!pos) return null;
  return (
    <div
      className={`ba-tip${visible ? " ba-tip-on" : ""}`}
      style={{ left: pos.left, bottom: pos.bottom, width: Math.min(260, (container()?.clientWidth ?? 300) - 32), ["--arrow" as string]: `${pos.arrow}px` }}
      role="status"
      onClick={() => setVisible(false)}
    >
      <PerchedStarling />
      <p>{text}</p>
    </div>
  );
};

export default StarlingTip;
