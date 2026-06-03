import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { validateToken, redeemToken, InviteToken } from "@/data/inviteTokenStore";
import { attemptClaim } from "@/data/founderStore";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

type PageState = "validating" | "invalid" | "form" | "submitting" | "success";

const ClaimInvitePage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const token = params.get("token") ?? "";

  const [state, setState] = useState<PageState>("validating");
  const [record, setRecord] = useState<InviteToken | null>(null);
  const [invalidReason, setInvalidReason] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!token) {
      setInvalidReason("No invite token found in this link.");
      setState("invalid");
      return;
    }
    const result = validateToken(token);
    if (!result.valid) {
      setInvalidReason(result.reason ?? "Invalid invite link.");
      setState("invalid");
    } else {
      setRecord(result.record!);
      setEmail(result.record!.email);
      setState("form");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!name.trim()) { setFormError("Please enter your name."); return; }
    if (!email.trim()) { setFormError("Please enter your email."); return; }
    if (password.length < 8) { setFormError("Password must be at least 8 characters."); return; }

    setState("submitting");

    login(email, password, "provider");

    // Redeem token — bypasses domain matching entirely
    redeemToken(token, email);

    // Register the claim in the founder store as auto-approved
    if (record) {
      attemptClaim(record.providerId, `invited-user-${Date.now()}`, email);
    }

    setState("success");
    setTimeout(() => navigate("/provider-dashboard"), 2000);
  };

  if (state === "validating") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <p>Validating your invite link…</p>
        </div>
      </div>
    );
  }

  if (state === "invalid") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="border-0 shadow-card w-full max-w-md">
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-red-500/10 p-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-lg">Invite link issue</p>
              <p className="text-muted-foreground text-sm mt-1">{invalidReason}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
              <Button asChild className="flex-1 bg-teal-500 hover:bg-teal-400">
                <Link to="/for-providers">Join Beyonder</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/providers">Browse directory</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Need a new invite? Contact{" "}
              <a href="mailto:hello@beyonderhub.co.uk" className="text-teal-400 underline">
                hello@beyonderhub.co.uk
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="border-0 shadow-card w-full max-w-md">
          <CardContent className="pt-8 pb-8 flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-teal-500/10 p-4">
              <CheckCircle2 className="h-8 w-8 text-teal-400" />
            </div>
            <div>
              <p className="font-semibold text-lg">Profile claimed!</p>
              <p className="text-muted-foreground text-sm mt-1">
                Taking you to your dashboard…
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="border-0 shadow-card w-full max-w-md">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-5 w-5 text-teal-400" />
            <span className="text-xs font-medium text-teal-400 uppercase tracking-wide">Verified Invite</span>
          </div>
          <CardTitle className="text-xl">Claim your Beyonder profile</CardTitle>
          {record && (
            <p className="text-sm text-muted-foreground mt-1">
              You've been invited to manage{" "}
              <span className="font-medium text-foreground">{record.providerName}</span>.
              Create your account to get started.
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                placeholder="Jane Mitchell"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@yourpractice.co.uk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <p className="text-xs text-muted-foreground">
                Pre-filled from your invite — change if needed.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Create a password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            {formError && (
              <p className="text-sm text-red-400">{formError}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-400"
              disabled={state === "submitting"}
            >
              {state === "submitting" ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating account…</>
              ) : (
                "Claim my profile"
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-400 underline">
              Log in instead
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimInvitePage;
