import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { CheckCircle, Star, ShieldCheck, Users, BarChart2, MessageSquare, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProvider } from "@/data/providerStore";
import { providers } from "@/data/mockData";

const ForProviders = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const claimProviderId = searchParams.get("claimProviderId");

  // If a claimProviderId is present, look up the provider name for the banner
  const claimProvider = claimProviderId
    ? (getProvider(claimProviderId) ?? providers.find((p) => p.id === claimProviderId))
    : null;

  const providerName = claimProvider
    ? "businessName" in claimProvider
      ? claimProvider.businessName
      : claimProvider.name
    : null;

  const handleCreateAccount = () => {
    if (claimProviderId) {
      navigate(`/signup?claimProviderId=${claimProviderId}&role=provider`);
    } else {
      navigate("/signup?role=provider");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Claim banner — only shown when arriving from a provider profile */}
      {claimProviderId && providerName && (
        <div className="bg-teal-500/10 border-b border-teal-500/25 py-4">
          <div className="container flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-teal-400">Claim this profile on Beyonder</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Create your free provider account to manage{" "}
                  <span className="text-foreground font-medium">{providerName}</span>
                </p>
              </div>
            </div>
            <Button size="sm" className="bg-teal-500 hover:bg-teal-400 shrink-0" onClick={handleCreateAccount}>
              Create Account & Claim Profile
            </Button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="bg-navy-gradient py-20">
        <div className="container animate-fade-in text-center max-w-3xl mx-auto">
          <Badge className="mb-4 bg-teal-500/20 text-teal-400 border-0">For Service Providers</Badge>
          <h1 className="text-4xl font-bold text-accent-foreground mb-4">Reach SEND families who need you most</h1>
          <p className="text-lg text-accent-foreground/70 mb-8 leading-relaxed">
            Beyonder connects your service with thousands of families navigating special educational needs and
            disabilities. Join a trusted directory built specifically for the SEND community.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-400 text-white shadow-lg"
              onClick={handleCreateAccount}
            >
              {claimProviderId ? "Claim Your Profile" : "Join Beyonder Free"}
            </Button>
            <Button size="lg" variant="outline" className="border-accent-foreground/20 text-accent-foreground" asChild>
              <Link to="/providers">Browse Directory</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-10">Why providers choose Beyonder</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Users className="h-6 w-6 text-teal-500" />,
                title: "Targeted Audience",
                desc: "Every visitor is a family actively searching for SEND support — no wasted impressions.",
              },
              {
                icon: <ShieldCheck className="h-6 w-6 text-teal-500" />,
                title: "Verified Listings",
                desc: "Build trust with families through our verification badge and credentialing system.",
              },
              {
                icon: <MessageSquare className="h-6 w-6 text-teal-500" />,
                title: "Direct Enquiries",
                desc: "Families can message you directly through your profile with no third-party barriers.",
              },
              {
                icon: <BarChart2 className="h-6 w-6 text-teal-500" />,
                title: "Profile Analytics",
                desc: "Understand how families find and engage with your listing (coming soon).",
              },
              {
                icon: <Star className="h-6 w-6 text-orange-400" />,
                title: "Reviews & Testimonials",
                desc: "Showcase parent reviews to build credibility and stand out from the crowd.",
              },
              {
                icon: <Award className="h-6 w-6 text-orange-400" />,
                title: "Founding Provider Status",
                desc: "Early members receive permanent Founding Provider recognition on their profile.",
              },
            ].map((b, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-card p-5 space-y-2">
                {b.icon}
                <p className="font-semibold">{b.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-2">Simple, transparent pricing</h2>
          <p className="text-center text-muted-foreground mb-10">Start free. Upgrade when you're ready.</p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                name: "Free",
                price: "£0",
                period: "forever",
                features: ["Public profile listing", "Parent enquiries", "Availability status"],
                cta: "Get Started Free",
                highlight: false,
              },
              {
                name: "Founder",
                price: "£29",
                period: "per month",
                features: [
                  "Everything in Free",
                  "Founding Provider badge",
                  "Spotlight message",
                  "Gallery & credentials",
                  "Referral notes",
                  "Featured placement",
                ],
                cta: "Claim Founder Rate",
                highlight: true,
              },
              {
                name: "Professional",
                price: "£49",
                period: "per month",
                features: [
                  "Everything in Founder",
                  "Priority placement",
                  "Advanced enquiry tools",
                  "Analytics dashboard",
                  "Dedicated support",
                ],
                cta: "Go Professional",
                highlight: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-xl border p-6 space-y-4 ${
                  plan.highlight ? "border-teal-500/50 bg-teal-500/[0.06] relative" : "border-border/60 bg-card"
                }`}
              >
                {plan.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white border-0 text-xs">
                    Most Popular
                  </Badge>
                )}
                <div>
                  <p className="font-bold text-lg">{plan.name}</p>
                  <p className="text-2xl font-bold mt-1">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground ml-1">/ {plan.period}</span>
                  </p>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.highlight ? "bg-teal-500 hover:bg-teal-400" : ""}`}
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={handleCreateAccount}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-navy-gradient text-center">
        <div className="container max-w-xl">
          <h2 className="text-2xl font-bold text-accent-foreground mb-3">Ready to reach more SEND families?</h2>
          <p className="text-accent-foreground/70 mb-6">
            Join hundreds of providers already listed on Beyonder. It takes less than 5 minutes to get started.
          </p>
          <Button size="lg" className="bg-orange-500 hover:bg-orange-400 text-white" onClick={handleCreateAccount}>
            {claimProviderId ? "Claim Your Profile Now" : "Create Your Free Profile"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ForProviders;
