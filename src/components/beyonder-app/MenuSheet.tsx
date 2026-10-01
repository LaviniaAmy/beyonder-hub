import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import "./beyonderApp.css";

interface Props {
  open: boolean;
  onClose: () => void;
  onProfile: () => void;
  onAbout: () => void;
  /** Cover the whole viewport (site pages) instead of just the app frame. */
  fixed?: boolean;
}

/** The app menu — used inside the app and by the site header on mobile pages. */
const MenuSheet = ({ open, onClose, onProfile, onAbout, fixed = false }: Props) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const firstBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const id = setTimeout(() => firstBtn.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(id); document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  const go = (to: string) => { onClose(); navigate(to); };
  const dashboard = user?.role === "admin" ? "/admin" : user?.role === "provider" ? "/provider-dashboard" : "/dashboard";

  return (
    <div
      className={`ba-root ba-veil${fixed ? " ba-fixed" : ""}${open ? " ba-open" : ""}`}
      role="dialog" aria-modal="true" aria-label="Menu"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="ba-sheet">
        <div className="ba-grab" />
        <ul className="ba-menu">
          <li><button ref={firstBtn} onClick={() => { onClose(); onProfile(); }}>Your child’s profile</button></li>
          <li><button onClick={() => go("/community")}>Community <small>Forums and meetups</small></button></li>
          <li><button onClick={() => go("/news")}>News and guides</button></li>
          <li><button onClick={() => { onClose(); onAbout(); }}>About Beyonder</button></li>
          <li><button onClick={() => go("/help")}>Help centre</button></li>
          <li><button onClick={() => go("/for-providers")}>For providers <small>List your service</small></button></li>
          {isAuthenticated ? (
            <>
              <li><button onClick={() => go(dashboard)}>Your dashboard</button></li>
              <li><button onClick={() => { onClose(); logout(); navigate("/"); }}>Log out</button></li>
            </>
          ) : (
            <li><button onClick={() => go("/login")}>Sign in <small>or join free</small></button></li>
          )}
        </ul>
        <p className="ba-proto">Specialists shown are samples.</p>
      </div>
    </div>
  );
};

export default MenuSheet;
