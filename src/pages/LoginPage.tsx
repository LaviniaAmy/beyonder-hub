import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { claimRecords, pendingClaims } from "@/data/founderStore";
import PageBanner from "@/components/PageBanner";

const TEST_LOGINS = [
  { label: "Parent", email: "test@parent.com" },
  { label: "Therapist", email: "therapist@beyonder.test" },
  { label: "Club", email: "club@beyonder.test" },
  { label: "Education", email: "education@beyonder.test" },
  { label: "Charity", email: "charity@beyonder.test" },
  { label: "Product", email: "product@beyonder.test" },
  { label: "Admin", email: "admin@beyonder.com" },
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(email);
  };

  const handleLogin = (emailToUse: string) => {
    login(emailToUse, "");

    const lower = emailToUse.toLowerCase().trim();

    if (lower === "admin@beyonder.com" || lower === "test@admin.com") {
      navigate("/admin");
      return;
    }

    const approvedClaim = claimRecords.find((r) => r.claimantEmail.toLowerCase() === lower);
    if (approvedClaim) {
      navigate("/provider-dashboard");
      return;
    }

    const pendingClaim = pendingClaims.find(
      (p) => p.claimantEmail.toLowerCase() === lower && p.status === "pending_review",
    );
    if (pendingClaim) {
      navigate("/provider-dashboard?claimStatus=pending_review");
      return;
    }

    if (lower.endsWith("@beyonder.test")) {
      navigate("/provider-dashboard");
      return;
    }

    navigate(redirectTo ?? "/dashboard");
  };

  return (
    <div className="bg-background">
      <PageBanner title="Log in" />
      <div className="flex items-start md:items-center justify-center py-8 md:py-12 px-4">
      <Card className="w-full max-w-sm border-0 shadow-card animate-fade-in">
        <CardHeader className="text-center pb-2">
          {redirectTo?.startsWith("/enquiry") && (
            <div className="mb-2 rounded-xl border border-teal-500/30 bg-teal-500/[0.08] px-4 py-3 text-left">
              <p className="text-base font-bold text-teal-400">Log in or sign up to send your enquiry</p>
              <p className="text-xs text-muted-foreground mt-1">
                You'll be taken straight back to the provider after logging in.
              </p>
            </div>
          )}
          <CardTitle className="text-2xl">
            {redirectTo?.startsWith("/enquiry") ? "Welcome to Beyonder" : "Welcome Back"}
          </CardTitle>
          <CardDescription>Log in to your Beyonder account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-400">
              Log In
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="text-teal-500 hover:underline">
                Sign up
              </Link>
            </p>
          </form>

          {/* Pilot test logins */}
          <div className="mt-4 border-t pt-4">
            <p className="text-xs text-muted-foreground mb-2">Pilot test logins (any password):</p>
            <div className="flex flex-wrap gap-1">
              {TEST_LOGINS.map(({ label, email: e }) => (
                <button
                  key={e}
                  type="button"
                  className="rounded-md bg-muted px-2 py-1 text-xs hover:bg-teal-500/10 hover:text-teal-500 transition-colors"
                  onClick={() => setEmail(e)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default LoginPage;
