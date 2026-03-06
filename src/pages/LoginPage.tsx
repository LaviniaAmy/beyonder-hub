import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { claimRecords, pendingClaims } from "@/data/founderStore";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);

    const lower = email.toLowerCase().trim();

    // Check for admin
    if (lower === "admin@beyonder.com" || lower === "test@admin.com") {
      navigate("/admin");
      return;
    }

    // Check if this email has an approved claim → full provider dashboard
    const approvedClaim = claimRecords.find((r) => r.claimantEmail.toLowerCase() === lower);
    if (approvedClaim) {
      navigate("/provider-dashboard");
      return;
    }

    // Check if this email has a pending claim → pending screen
    const pendingClaim = pendingClaims.find(
      (p) => p.claimantEmail.toLowerCase() === lower && p.status === "pending_review",
    );
    if (pendingClaim) {
      navigate("/provider-dashboard?claimStatus=pending_review");
      return;
    }

    // Hardcoded test provider emails
    if (lower.endsWith("@beyonder.test")) {
      navigate("/provider-dashboard");
      return;
    }

    // Everyone else → parent dashboard
    navigate("/dashboard");
  };

  return (
    <div className="bg-navy-gradient flex min-h-[80vh] items-center justify-center py-16">
      <Card className="w-full max-w-sm border-0 shadow-card animate-fade-in">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
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
  );
};

export default LoginPage;
