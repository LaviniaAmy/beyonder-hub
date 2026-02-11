import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Join Beyonder</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="parent">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="parent">I'm a Parent</TabsTrigger>
              <TabsTrigger value="provider">I'm a Provider</TabsTrigger>
            </TabsList>
            <TabsContent value="parent" className="space-y-4 pt-4">
              <div><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" /></div>
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
              <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
              <Button className="w-full" asChild><Link to="/dashboard">Create Account</Link></Button>
            </TabsContent>
            <TabsContent value="provider" className="space-y-4 pt-4">
              <div className="rounded-lg bg-primary/10 p-4 text-sm">
                <p className="font-semibold text-primary">Why Join Beyonder?</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• Reach families actively looking for SEND services</li>
                  <li>• Build trust with verified reviews</li>
                  <li>• Manage enquiries in one place</li>
                </ul>
              </div>
              <div><Label>Organisation Name</Label><Input placeholder="Your organisation" /></div>
              <div><Label>Email</Label><Input type="email" placeholder="you@example.com" /></div>
              <div><Label>Password</Label><Input type="password" /></div>
              <Button className="w-full" asChild><Link to="/provider-dashboard">Create Provider Account</Link></Button>
            </TabsContent>
          </Tabs>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
