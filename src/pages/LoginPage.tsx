import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth, UserRole } from "@/context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const CATEGORY_TEST_EMAILS = [
    "therapist@beyonder.test",
    "club@beyonder.test",
    "education@beyonder.test",
    "charity@beyonder.test",
    "product@beyonder.test",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lower = email.toLowerCase();

    let role: UserRole = "parent";
    if (lower.includes("admin")) role = "admin";
    else if (lower.includes("provider") || CATEGORY_TEST_EMAILS.includes(lower)) role = "provider";

    login(email, password, role);

    const redirects: Record<UserRole, string> = {
      parent: "/dashboard",
      provider: "/provider-dashboard",
      admin: "/admin",
    };
    navigate(redirects[role]);
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Log in to your Beyonder account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Log In</Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
            </p>
          </form>
          <div className="mt-4 border-t pt-4">
            <p className="text-xs text-muted-foreground mb-2">Pilot test logins (any password):</p>
            <div className="flex flex-wrap gap-1">
              {["therapist", "club", "education", "charity", "product"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className="rounded bg-muted px-2 py-1 text-xs hover:bg-muted/80"
                  onClick={() => { setEmail(`${cat}@beyonder.test`); }}
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
