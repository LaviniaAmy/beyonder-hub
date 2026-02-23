import { useState } from "react";
import { CheckCircle, Lock, Clock, Users, FileText, Image, Star, ShoppingBag, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { enquiries, mockProvider, providers } from "@/data/mockData";
import { hasFeature, categorySections } from "@/lib/featureGating";
import { getModuleProfile, providerTestimonials } from "@/data/providerModules";
import type { TherapistProfile, ClubProfile, EducationProfile, ProductProfile } from "@/data/providerModules";

const tiers = [
  { name: "Free Listing", price: "Free", features: ["Basic profile listing", "Receive enquiries", "Category placement"], current: true },
  { name: "Premium", price: "£19.95/mo", features: ["Everything in Free", "Priority placement", "Detailed analytics", "Verified badge", "Photo gallery"], current: false },
];

const ProviderDashboard = () => {
  const providerEnquiries = enquiries.filter((e) => e.providerId === mockProvider.id);
  const profile = providers.find((p) => p.id === mockProvider.id);
  const [selectedPlan, setSelectedPlan] = useState("Free Listing");

  if (!profile) return <div className="container py-20 text-center"><h1 className="text-2xl font-bold">Provider not found</h1></div>;

  const moduleProfile = getModuleProfile(profile.id, profile.category_type);
  const sections = categorySections[profile.category_type] ?? [];
  const testimonials = providerTestimonials.filter((t) => t.provider_id === profile.id);

  const isFeatureEnabled = (featureKey?: string) => {
    if (!featureKey) return true; // No gating = always visible
    return hasFeature(profile, featureKey as any);
  };

  return (
    <div className="py-8">
      <div className="container max-w-3xl">
        <h1 className="mb-2 text-3xl font-bold">Provider Dashboard</h1>
        <div className="mb-8 flex items-center gap-2">
          <Badge variant="secondary">{profile.category_type}</Badge>
          <Badge variant="outline">{profile.plan_type} plan</Badge>
          <Badge className="bg-green-100 text-green-800">{profile.plan_status}</Badge>
        </div>

        {/* Your Profile */}
        <Card className="mb-6">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Your Profile</CardTitle>
            <Button size="sm" variant="outline">Edit Profile</Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Type:</strong> {profile.typeBadge}</p>
            <p><strong>Category:</strong> {profile.category_type}</p>
            <p><strong>Location:</strong> {profile.location}</p>
            <p><strong>Delivery:</strong> {profile.deliveryFormat}</p>
          </CardContent>
        </Card>

        {/* Category-driven sections */}
        {sections.map((section) => {
          const enabled = isFeatureEnabled(section.featureKey);
          return (
            <Card key={section.key} className={`mb-6 ${!enabled ? "opacity-60" : ""}`}>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getSectionIcon(section.key)}
                  {section.label}
                  {!enabled && <Lock className="h-4 w-4 text-muted-foreground" />}
                </CardTitle>
                {!enabled && (
                  <Badge variant="outline" className="text-muted-foreground">
                    Upgrade to unlock
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                {enabled ? (
                  renderSectionContent(section.key, profile, moduleProfile, providerEnquiries, testimonials)
                ) : (
                  <p className="text-sm text-muted-foreground">
                    This feature is available on a higher plan. Upgrade to access {section.label.toLowerCase()}.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Upgrade Plan */}
        <Card>
          <CardHeader><CardTitle>Upgrade Plan</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {tiers.map((t) => (
                <div
                  key={t.name}
                  className={`rounded-lg border p-5 ${t.name === "Premium" ? "border-primary border-2" : ""} ${selectedPlan === t.name ? "bg-primary/5" : ""}`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">{t.name}</h3>
                    {t.current && <Badge variant="secondary">Current</Badge>}
                  </div>
                  <p className="mb-4 text-2xl font-bold text-primary">{t.price}</p>
                  <ul className="mb-4 space-y-2">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={t.current ? "outline" : "default"} disabled={t.current} onClick={() => setSelectedPlan(t.name)}>
                    {t.current ? "Current Plan" : "Upgrade"}
                  </Button>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Payment integration coming soon. Plan selection is for preview only.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function getSectionIcon(key: string) {
  const icons: Record<string, React.ReactNode> = {
    availability: <Clock className="h-4 w-4" />,
    enquiries: <Users className="h-4 w-4" />,
    certifications: <FileText className="h-4 w-4" />,
    testimonials: <Star className="h-4 w-4" />,
    timetable: <Clock className="h-4 w-4" />,
    gallery: <Image className="h-4 w-4" />,
    case_studies: <FileText className="h-4 w-4" />,
    spotlight: <Star className="h-4 w-4" />,
    store_link: <LinkIcon className="h-4 w-4" />,
    products: <ShoppingBag className="h-4 w-4" />,
  };
  return icons[key] ?? null;
}

function renderSectionContent(
  key: string,
  profile: any,
  moduleProfile: any,
  enquiries: any[],
  testimonials: any[],
) {
  switch (key) {
    case "availability":
      const tp = moduleProfile as TherapistProfile | null;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Accepting New Clients</Label>
            <Switch checked={tp?.accepting_new_clients ?? true} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Waitlist Enabled</Label>
            <Switch checked={tp?.waitlist_enabled ?? false} />
          </div>
        </div>
      );

    case "enquiries":
      return enquiries.length === 0 ? (
        <p className="text-muted-foreground">No enquiries yet.</p>
      ) : (
        <div className="space-y-3">
          {enquiries.map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">{e.parentName}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{e.message}</p>
              </div>
              <Badge variant={e.status === "sent" ? "destructive" : "secondary"}>
                {e.status === "sent" ? "New" : e.status}
              </Badge>
            </div>
          ))}
        </div>
      );

    case "certifications":
      const therapist = moduleProfile as TherapistProfile | null;
      return (
        <div className="space-y-2">
          {(therapist?.certifications ?? []).map((c) => (
            <div key={c} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-primary" />{c}
            </div>
          ))}
          <Button size="sm" variant="outline" className="mt-2">Upload Certification</Button>
        </div>
      );

    case "testimonials":
      return testimonials.length === 0 ? (
        <p className="text-muted-foreground">No testimonials yet.</p>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-lg border p-3">
              <div className="flex items-center gap-2">
                {t.rating && <span className="text-sm font-medium">{t.rating}★</span>}
                {t.parent_name && <span className="text-sm text-muted-foreground">{t.parent_name}</span>}
                <Badge variant="secondary" className="ml-auto text-xs">{t.status}</Badge>
              </div>
              <p className="mt-1 text-sm">{t.text}</p>
            </div>
          ))}
        </div>
      );

    case "timetable":
      const club = moduleProfile as ClubProfile | null;
      return (
        <div className="space-y-2">
          {(club?.timetable_json ?? []).map((t, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium w-24">{t.day}</span>
              <span className="text-muted-foreground">{t.time}</span>
              <span>{t.activity}</span>
            </div>
          ))}
          <Button size="sm" variant="outline" className="mt-2">Edit Timetable</Button>
        </div>
      );

    case "gallery":
      return (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Upload photos to showcase your activities.</p>
          <Button size="sm" variant="outline">Upload Photos</Button>
        </div>
      );

    case "case_studies":
      const edu = moduleProfile as EducationProfile | null;
      return (
        <div className="space-y-2">
          {(edu?.case_studies ?? []).map((cs, i) => (
            <p key={i} className="text-sm border-l-2 border-primary pl-3">{cs}</p>
          ))}
          <Button size="sm" variant="outline" className="mt-2">Add Case Study</Button>
        </div>
      );

    case "spotlight":
      return <p className="text-sm text-muted-foreground">Spotlight tools coming soon.</p>;

    case "store_link":
      const prod = moduleProfile as ProductProfile | null;
      return (
        <div className="space-y-2">
          <p className="text-sm"><strong>Store URL:</strong> {prod?.store_link ?? "Not set"}</p>
          <Button size="sm" variant="outline">Edit Store Link</Button>
        </div>
      );

    case "products":
      const prodProfile = moduleProfile as ProductProfile | null;
      return (
        <div className="space-y-2">
          {(prodProfile?.featured_products ?? []).map((p) => (
            <div key={p.name} className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <span>{p.name}</span>
              <span className="font-semibold text-primary">{p.price}</span>
            </div>
          ))}
          <Button size="sm" variant="outline" className="mt-2">Manage Products</Button>
        </div>
      );

    default:
      return <p className="text-sm text-muted-foreground">Coming soon.</p>;
  }
}

export default ProviderDashboard;
