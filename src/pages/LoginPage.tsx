import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth, UserRole } from "@/context/AuthContext";

const CATEGORY_TEST_EMAILS = [
  "therapist@beyonder.test",
  "club@beyonder.test",
  "education@beyonder.test",
  "charity@beyonder.test",
  "product@beyonder.test",
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("parent");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lower = email.toLowerCase();

    // Auto-detect role for known test emails and admin — otherwise use selected role
    let resolvedRole: UserRole = role;
    if (lower.includes("admin")) resolvedRole = "admin";
    else if (CATEGORY_TEST_EMAILS.includes(lower) || lower.includes("provider")) resolvedRole = "provider";

    login(email, password, resolvedRole);

    const redirects: Record<UserRole, string> = {
      parent: "/dashboard",
      provider: "/provider-dashboard",
      admin: "/admin",
    };
    navigate(redirects[resolvedRole]);
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
            {/* Role selector */}
            <div>
              <Label>I am a</Label>
              <div className="mt-2 flex gap-2">
                {(["parent", "provider"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors capitalize ${
                      role === r
                        ? "border-teal-500 bg-teal-500/15 text-teal-400"
                        : "border-border/60 text-muted-foreground hover:border-teal-500/40"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

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
              {["therapist", "club", "education", "charity", "product"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="rounded-md bg-muted px-2 py-1 text-xs hover:bg-teal-500/10 hover:text-teal-500 transition-colors duration-150"
                  onClick={() => {
                    setEmail(`${cat}@beyonder.test`);
                    setRole("provider");
                  }}
                >
                  {cat}
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
