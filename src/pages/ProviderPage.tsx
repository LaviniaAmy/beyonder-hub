import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Star, ShieldCheck, Award, Clock, Mail, Phone, Globe, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reviews } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { attemptClaim, isProviderClaimed } from "@/data/founderStore";
import { getProvider } from "@/data/providerStore";
import type { AvailabilityStatus } from "@/data/providerStore";

const availabilityConfig: Record<AvailabilityStatus, { label: string; classes: string }> = {
  accepting: {
    label: "Accepting new clients",
    classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  waitlist: {
    label: "Waitlist only",
    classes: "bg-orange-400/15 text-orange-400 border-orange-400/30",
  },
  closed: {
    label: "Not accepting clients",
    classes: "bg-red-400/15 text-red-400 border-red-400/30",
  },
};

const ProviderPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const provider = getProvider(id ?? "");
  const providerReviews = reviews.filter((r) => r.providerId === id);

  if (!provider) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Provider not found</h1>
        <Button asChild className="mt-4">
          <Link to="/providers">Back to Directory</Link>
        </Button>
      </div>
    );
  }

  const isSuspended = provider.moderationStatus === "suspended";
  const alreadyClaimed = isProviderClaimed(provider.id);
  const isTherapist = provider.category_type === "therapist";
  const availStatus = provider.availabilityStatus ?? "accepting";
  const availInfo = availabilityConfig[availStatus];

  const handleClaim = () => {
    if (!isAuthenticated || user?.role !== "provider") {
      navigate(`/for-providers?claimProviderId=${provider.id}`);
      return;
    }
    const result = attemptClaim(user.id, user.email, provider.id, provider.businessName, provider.websiteDomain);
    if (result.outcome === "approved") {
      navigate("/provider-dashboard");
    } else if (result.outcome === "pending_review") {
      navigate("/provider-dashboard?claimStatus=pending_review");
    }
  };

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="bg-navy-gradient py-12">
        <div className="container animate-fade-in">
          {isSuspended ? (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/08 p-4 mb-6">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-400">This listing is currently unavailable.</p>
            </div>
          ) : null}

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-navy-600 text-accent-foreground border-0">
                  {provider.typeBadge}
                </Badge>
                <Badge className="bg-teal-500/20 text-teal-400 border-0 capitalize">{provider.plan_type}</Badge>
                {/* Availability badge — therapists only */}
                {isTherapist && !isSuspended && (
                  <Badge variant="outline" className={`border ${availInfo.classes}`}>
                    {availInfo.label}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-accent-foreground">{provider.businessName}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-accent-foreground/70">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {provider.location}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-orange-400 text-orange-400" />
                  {provider.rating} ({provider.reviewCount} reviews)
                </span>
                {provider.verified && (
                  <span className="flex items-center gap-1 text-teal-400">
                    <ShieldCheck className="h-4 w-4" />
                    Verified
                  </span>
                )}
                {provider.foundingProvider && (
                  <span className="flex items-center gap-1 text-orange-300">
                    <Award className="h-4 w-4" />
                    Founding Provider
                  </span>
                )}
              </div>

              {/* Claim CTA */}
              {!alreadyClaimed && !isSuspended && (
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-sm text-accent-foreground/40">Own this profile?</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-teal-500/40 text-teal-400 hover:bg-teal-500/10"
                    onClick={handleClaim}
                  >
                    Claim this profile
                  </Button>
                </div>
              )}
            </div>
            {!isSuspended && (
              <Button size="lg" className="bg-teal-500 hover:bg-teal-400 shadow-lg" asChild>
                <Link to={`/enquiry/${provider.id}`}>Send Enquiry</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="container mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Overview */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{provider.description}</p>
              <div className="flex flex-wrap gap-2">
                {provider.needsSupported.map((n) => (
                  <Badge key={n} variant="outline" className="border-border/60">
                    {n}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  <strong className="text-foreground">Age Range:</strong> {provider.ageRange}
                </span>
                <span>
                  <strong className="text-foreground">Format:</strong> {provider.deliveryFormat}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Spotlight — charities */}
          {provider.spotlightMessage && (
            <Card className="border-0 shadow-card border-l-4 border-l-teal-500">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-teal-500 mb-2">From the team</p>
                <p className="text-muted-foreground leading-relaxed">{provider.spotlightMessage}</p>
              </CardContent>
            </Card>
          )}

          {/* Credentials — therapists */}
          {provider.credentials && provider.credentials.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Credentials & Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {provider.credentials.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="h-4 w-4 text-teal-500" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Timetable — clubs */}
          {provider.timetable && provider.timetable.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Timetable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {provider.timetable.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-teal-500" />
                      <span className="font-medium w-24">{t.day}</span>
                      <span className="text-muted-foreground">{t.time}</span>
                      <span>{t.activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gallery — clubs */}
          {provider.gallery && provider.gallery.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {provider.gallery.map((url, i) => (
                    <div key={i} className="rounded-lg overflow-hidden bg-muted aspect-square">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Case Studies — education */}
          {provider.caseStudies && provider.caseStudies.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Education Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {provider.caseStudies.map((cs, i) => (
                  <div key={i} className="border-l-2 border-teal-500 pl-3">
                    <p className="font-medium text-sm">{cs.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{cs.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Products */}
          {provider.products && provider.products.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {provider.products.map((p) => (
                    <div key={p.name} className="rounded-xl border border-border/60 p-4 text-center card-hover-lift">
                      <div className="mb-2 h-20 rounded-lg bg-muted" />
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-sm text-teal-500 font-semibold">{p.price}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {providerReviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet.</p>
              ) : (
                providerReviews.map((r) => (
                  <div key={r.id} className="border-b border-border/40 pb-4 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                      <span className="text-sm font-medium">{r.authorName}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle>Practical Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <strong className="text-foreground">Coverage Area</strong>
                <p className="text-muted-foreground">{provider.coverageArea}</p>
              </div>
              {provider.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-teal-500" />
                  <span>{provider.email}</span>
                </div>
              )}
              {provider.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-teal-500" />
                  <span>{provider.phone}</span>
                </div>
              )}
              {provider.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-teal-500" />
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline"
                  >
                    {provider.website}
                  </a>
                </div>
              )}
              {provider.storeUrl && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-teal-500" />
                  <a
                    href={provider.storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline"
                  >
                    Visit Store
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky CTA */}
      {!isSuspended && (
        <div className="fixed bottom-0 left-0 right-0 bg-navy-900 p-4 shadow-lg border-t border-navy-700">
          <div className="container flex items-center justify-between">
            <span className="font-semibold text-accent-foreground">{provider.businessName}</span>
            <Button className="bg-teal-500 hover:bg-teal-400" asChild>
              <Link to={`/enquiry/${provider.id}`}>Send Enquiry</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderPage;
