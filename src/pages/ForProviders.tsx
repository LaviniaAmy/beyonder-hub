import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  "Reach families actively searching for SEND services",
  "Build trust through verified reviews and badges",
  "Manage all enquiries in a simple dashboard",
  "Increase visibility with category listings",
  "Join a growing, supportive community",
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
        <div className="mt-8 text-center">
          <Button size="lg" asChild><Link to="/signup">Get Started — It's Free</Link></Button>
        </div>
      </div>
    </section>
  </div>
);

export default ForProviders;
