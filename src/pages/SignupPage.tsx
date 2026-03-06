import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, UserRole } from "@/context/AuthContext";
import { attemptClaim } from "@/data/founderStore";
import { providers } from "@/data/mockData";

const STORAGE_KEY = "beyonder_user";

const SignupPage = () => {
  const [searchParams] = useSearchParams();
  const claimProviderId = searchParams.get("claimProviderId");
  const defaultRole = searchParams.get("role") === "provider" ? "provider" : "parent";

  const [tab, setTab] = useState<"parent" | "provider">(defaultRole as "parent" | "provider");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role: UserRole = tab;

    // Pass role explicitly so provider signups aren't downgraded to parent
    login(email, password, role);

    // If provider signup with a claim intent — attempt the claim now
    if (role === "provider" && claimProviderId) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const user = JSON.parse(stored);
          const provider = providers.find((p) => p.id === claimProviderId);
          const result = attemptClaim(
            user.id,
            user.email,
            claimProviderId,
            provider?.name ?? "",
            provider?.websiteDomain ?? "",
          );

          // Write the correct provider_id back into localStorage so the
          // dashboard loads the right profile regardless of claim outcome
          const updatedUser = { ...user, provider_id: claimProviderId };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

          if (result.outcome === "pending_review") {
            navigate("/provider-dashboard?claimStatus=pending_review");
            return;
          }
        }
      } catch {
        // silent fail — claim can be retried from provider page
      }
      navigate("/provider-dashboard");
      return;
    }

    navigate(role === "provider" ? "/provider-dashboard" : "/dashboard");
  };

  return (
    <div className="bg-navy-gradient flex min-h-[80vh] items-center justify-center py-16">
      <Card className="w-full max-w-md border-0 shadow-card animate-fade-in">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Join Beyonder</CardTitle>
          <CardDescription>
            {claimProviderId
              ? "Create your provider account to claim this listing"
              : "Create your account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {claimProviderId ? (
            <div>
              <div
                style={{
                  marginBottom: 16,
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "rgba(42,122,106,0.10)",
                  border: "1px solid rgba(42,122,106,0.22)",
                  fontSize: "0.78rem",
                  color: "#3a9a88",
                }}
              >
                You're creating a provider account to claim and manage this listing on Beyonder.
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Organisation Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your organisation"
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-400">
                  Create Account & Claim Profile
                </Button>
              </form>
            </div>
          ) : (
            <Tabs value={tab} onValueChange={(v) => setTab(v as "parent" | "provider")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="parent">I'm a Parent</TabsTrigger>
                <TabsTrigger value="provider">I'm a Provider</TabsTrigger>
              </TabsList>

              <TabsContent value="parent">
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-400">
                    Create Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="provider">
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="rounded-xl bg-teal-500/10 p-4 text-sm">
                    <p className="font-semibold text-teal-500">Why Join Beyonder?</p>
                    <ul className="mt-2 space-y-1 text-muted-foreground">
                      <li>• Reach families actively looking for SEND services</li>
                      <li>• Build trust with verified reviews</li>
                      <li>• Manage enquiries in one place</li>
                    </ul>
                  </div>
                  <div>
                    <Label>Organisation Name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your organisation"
                      required
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-400">
                    Create Provider Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-500 hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
