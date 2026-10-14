import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, type User } from "@/context/AuthContext";
import Sheet from "@/components/child-profile/Sheet";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Called once the parent is signed in, with their account, so the form can send straight away. */
  onSignedIn: (user: User) => void;
  /** e.g. "send your enquiry" or "request your booking". */
  action: string;
}

/**
 * "Create a free account to send this" — three boxes, or sign in. Everything a parent sends lives in their
 * dashboard (replies, calls, notifications), so enquiries and bookings always come from an account.
 */
const AccountSheet = ({ open, onClose, onSignedIn, action }: Props) => {
  const { login, logout } = useAuth();
  const [mode, setMode] = useState<"create" | "signin">("create");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => { if (open) setErr(""); }, [open, mode]);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const ready = emailOk && password.length >= (mode === "create" ? 8 : 1) && (mode === "signin" || name.trim().length > 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) {
      setErr(mode === "create" ? "Please add your name, email and a password of at least 8 characters." : "Please add your email and password.");
      return;
    }
    const u = mode === "create" ? login(email, password, "parent", name) : login(email, password);
    if (u.role !== "parent") {
      logout();
      setErr("That's a provider or admin account. Enquiries and bookings are sent from a parent account.");
      return;
    }
    onSignedIn(u);
  };

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={mode === "create" ? `Create a free account to ${action}` : `Sign in to ${action}`}
      hint={mode === "create"
        ? "Replies, calls and updates all appear in your dashboard, and we'll email you when there's news."
        : "Welcome back. Your answers are kept."}
    >
      <form onSubmit={submit} noValidate>
        {mode === "create" && (
          <>
            <label className="ba-lbl" htmlFor="acc-name">Your name</label>
            <input id="acc-name" className="ba-field" value={name} autoComplete="name" maxLength={60}
              onChange={(e) => setName(e.target.value)} style={{ marginBottom: 14 }} />
          </>
        )}
        <label className="ba-lbl" htmlFor="acc-email">Email</label>
        <input id="acc-email" className="ba-field" type="email" value={email} autoComplete="email" inputMode="email"
          onChange={(e) => setEmail(e.target.value)} style={{ marginBottom: 14 }} />
        <label className="ba-lbl" htmlFor="acc-pass">Password</label>
        <input id="acc-pass" className="ba-field" type="password" value={password}
          autoComplete={mode === "create" ? "new-password" : "current-password"}
          onChange={(e) => setPassword(e.target.value)} />
        {mode === "create" && <p className="ba-note">At least 8 characters.</p>}
        <p className="ba-err" role="alert">{err}</p>
        <button type="submit" className="ba-btn ba-btn-primary" style={{ marginTop: 10 }}>
          {mode === "create" ? "Create account and send" : "Sign in and send"}
        </button>
        <p className="ba-note" style={{ textAlign: "center", marginTop: 14 }}>
          {mode === "create" ? "Already have an account? " : "New to Beyonder? "}
          <button type="button" className="cp-link" onClick={() => setMode(mode === "create" ? "signin" : "create")}>
            {mode === "create" ? "Sign in" : "Create a free account"}
          </button>
        </p>
        {mode === "create" && (
          <p className="ba-note" style={{ textAlign: "center" }}>
            By creating an account you agree to our <Link to="/terms" className="cp-link" target="_blank">terms</Link> and{" "}
            <Link to="/privacy" className="cp-link" target="_blank">privacy policy</Link>.
          </p>
        )}
      </form>
    </Sheet>
  );
};

export default AccountSheet;
