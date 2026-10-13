import { useEffect, useRef, type ReactNode } from "react";
import "@/components/beyonder-app/beyonderApp.css";
import "./childProfile.css";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  hint?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Slide-up panel (centred card on desktop) — same look as the app's menu sheet. */
const Sheet = ({ open, onClose, title, hint, children, footer }: Props) => {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => panel.current?.querySelector<HTMLElement>("button, input, select, textarea")?.focus(), 80);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(id); document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  return (
    <div
      className={`ba-root ba-veil ba-fixed${open ? " ba-open" : ""}`}
      role="dialog" aria-modal="true" aria-label={title} aria-hidden={!open}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="ba-sheet cp-sheet" ref={panel}>
        <div className="ba-grab" />
        <div className="cp-sheet-head">
          <h2>{title}</h2>
          {hint && <p>{hint}</p>}
        </div>
        <div className="cp-sheet-body">{open && children}</div>
        {footer && <div className="cp-sheet-foot">{footer}</div>}
      </div>
    </div>
  );
};

export default Sheet;
