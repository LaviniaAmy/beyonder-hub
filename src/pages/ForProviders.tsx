import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { providers } from "@/data/mockData";
import { getFounderCount, adminSettings } from "@/data/founderStore";

const benefits = [
  "Reach families actively searching for SEND services",
  "Build trust through verified reviews and badges",
  "Manage all enquiries in a simple dashboard",
  "Increase visibility with category listings",
  "Join a growing, supportive community",
];

const ForProviders = () => {
  const [searchParams] = useSearchParams();
  const claimProviderId = searchParams.get("claimProviderId");
  const claimProvider = claimProviderId ? providers.find((p) => p.id === claimProviderId) : null;

  const founderCount = getFounderCount();
  const founderLimit = adminSettings.founderLimit;
  const slotsLeft = Math.max(0, founderLimit - founderCount);

  // Build signup URL preserving claimProviderId if present
  const signupUrl = claimProviderId
    ? `/signup?claimProviderId=${claimProviderId}&role=provider`
    : "/signup?role=provider";

  return (
    <div>
      {/* Claim intent banner */}
      {claimProvider && (
        <div
          style={{
            background: "rgba(42,122,106,0.10)",
            borderBottom: "1px solid rgba(42,122,106,0.22)",
            padding: "14px 0",
          }}
        >
          <div className="container">
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3a9a88", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: "0.88rem", fontWeight: 600, color: "#3a9a88", margin: 0 }}>
                  Claim this profile on Beyonder
                </p>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.55)", margin: 0 }}>
                  Create your free provider account to manage{" "}
                  <strong style={{ color: "rgba(255,255,255,0.80)" }}>{claimProvider.name}</strong> on Beyonder.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="bg-navy-gradient py-24">
        <div className="container text-center animate-fade-in">
          <h1 className="mb-5 text-4xl font-bold text-accent-foreground">Grow Your Reach with Beyonder</h1>
          <p className="mx-auto max-w-2xl text-lg text-accent-foreground/75 leading-relaxed">
            Join the platform trusted by SEND families to find the right support. List your services and connect with
            families who need you.
          </p>

          {/* Founder slots indicator */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginTop: 20,
              padding: "7px 16px",
              borderRadius: 20,
              background: slotsLeft > 0 ? "rgba(42,122,106,0.15)" : "rgba(232,98,42,0.12)",
              border: `1px solid ${slotsLeft > 0 ? "rgba(42,122,106,0.30)" : "rgba(232,98,42,0.25)"}`,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: slotsLeft > 0 ? "#3a9a88" : "#e8622a",
              }}
            />
            <span style={{ fontSize: "0.78rem", color: slotsLeft > 0 ? "#3a9a88" : "#e8622a", fontWeight: 500 }}>
              {slotsLeft > 0
                ? `${slotsLeft} Founding Provider ${slotsLeft === 1 ? "place" : "places"} remaining`
                : "Founding Provider places are now full"}
            </span>
          </div>

          <div className="mt-8">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-400 shadow-lg" asChild>
              <Link to={signupUrl}>{claimProviderId ? "Create Account & Claim Profile" : "Sign Up as a Provider"}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-2xl">
          <h2 className="mb-8 text-2xl font-semibold text-center">Why Providers Choose Beyonder</h2>
          <ul className="space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-foreground/90">
                <CheckCircle className="h-5 w-5 text-teal-500 shrink-0" />
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-400 shadow-lg" asChild>
              <Link to={signupUrl}>Get Started — It's Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForProviders;
