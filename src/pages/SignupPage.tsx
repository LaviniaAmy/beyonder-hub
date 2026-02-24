import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, UserRole } from "@/context/AuthContext";

const SignupPage = () => {
  const [tab, setTab] = useState<"parent" | "provider">("parent");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role: UserRole = tab;
    login(email, password, role);
    navigate(role === "provider" ? "/provider-dashboard" : "/dashboard");
  };

  return (
    <div className="bg-navy-gradient flex min-h-[80vh] items-center justify-center py-16">
      <Card className="w-full max-w-md border-0 shadow-card animate-fade-in">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">Join Beyonder</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={(v) => setTab(v as "parent" | "provider")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="parent">I'm a Parent</TabsTrigger>
              <TabsTrigger value="provider">I'm a Provider</TabsTrigger>
            </TabsList>
            <TabsContent value="parent">
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required /></div>
                <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
                <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-400">Create Account</Button>
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
                <div><Label>Organisation Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your organisation" required /></div>
                <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
                <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                <Button type="submit" className="w-full bg-teal-500 hover:bg-teal-400">Create Provider Account</Button>
              </form>
            </TabsContent>
          </Tabs>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-teal-500 hover:underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
