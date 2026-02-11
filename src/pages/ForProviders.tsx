import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  "Reach families actively searching for SEND services",
  "Build trust through verified reviews and badges",
  "Manage all enquiries in a simple dashboard",
  "Increase visibility with category listings",
  "Join a growing, supportive community",
];

const tiers = [
  { name: "Free Listing", price: "Free", features: ["Basic profile listing", "Receive enquiries", "Category placement"] },
  { name: "Premium", price: "£19.95/mo", features: ["Everything in Free", "Priority placement", "Detailed analytics", "Verified badge", "Photo gallery"] },
];

const ForProviders = () => (
  <div>
    <section className="bg-accent py-16 text-accent-foreground">
      <div className="container text-center">
        <h1 className="mb-4 text-4xl font-bold">Grow Your Reach with Beyonder</h1>
        <p className="mx-auto max-w-2xl text-lg opacity-80">Join the platform trusted by SEND families to find the right support. List your services and connect with families who need you.</p>
        <Button size="lg" className="mt-6" asChild><Link to="/signup">Sign Up as a Provider</Link></Button>
      </div>
    </section>

    <section className="py-12">
      <div className="container max-w-2xl">
        <h2 className="mb-6 text-2xl font-bold text-center">Why Providers Choose Beyonder</h2>
        <ul className="space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-primary shrink-0" /><span>{b}</span></li>
          ))}
        </ul>
      </div>
    </section>

    <section className="border-t bg-muted py-12">
      <div className="container">
        <h2 className="mb-8 text-2xl font-bold text-center">Choose Your Plan</h2>
        <div className="mx-auto grid max-w-2xl gap-6 sm:grid-cols-2">
          {tiers.map((t) => (
            <Card key={t.name} className={t.name === "Premium" ? "border-primary border-2" : ""}>
              <CardHeader>
                <CardTitle>{t.name}</CardTitle>
                <p className="text-2xl font-bold text-primary">{t.price}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {t.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-primary" />{f}</li>)}
                </ul>
                <Button className="mt-4 w-full" variant={t.name === "Premium" ? "default" : "outline"} asChild>
                  <Link to="/signup">{t.name === "Premium" ? "Get Started" : "Sign Up Free"}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default ForProviders;
