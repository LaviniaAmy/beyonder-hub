import { useEffect, useRef } from "react";
import "./beyonderApp.css";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Cover the whole viewport (desktop hero) instead of just the app frame. */
  fixed?: boolean;
}

/** "How Beyonder works" bottom sheet — used in the app and on the desktop hero. */
const AboutSheet = ({ open, onClose, fixed = false }: Props) => {
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => btn.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(id); document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  return (
    <div
      className={`ba-root ba-veil${fixed ? " ba-fixed" : ""}${open ? " ba-open" : ""}`}
      role="dialog" aria-modal="true" aria-label="How Beyonder works"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="ba-sheet">
        <div className="ba-grab" />
        <h2>Built because we couldn't find what we needed either.</h2>
        <blockquote>I spent nearly a year searching for the right OT for my son. Information was scattered across Facebook groups, outdated PDFs and word of mouth. I kept thinking there has to be a better way.</blockquote>
        <cite>Co-founder and SEND parent</cite>
        <h2 style={{ fontSize: 21 }}>How it works</h2>
        <ol className="ba-steps">
          <li>Answer three short questions about your child. You can skip them.</li>
          <li>See specialists and local support that fit what your child needs now.</li>
          <li>Book a call or send an enquiry. Your answers are filled in, so you don't have to explain it all again.</li>
        </ol>
        <p className="ba-note" style={{ marginBottom: 20 }}>No diagnosis needed. Free for families to use.</p>
        <button ref={btn} className="ba-btn ba-btn-primary" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
};

export default AboutSheet;
