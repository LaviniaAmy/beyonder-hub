import { useState } from "react";
import { CheckCircle, Lock, Clock, Users, FileText, Image, Star, ShoppingBag, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { providers } from "@/data/mockData";
import { hasFeature, categorySections } from "@/lib/featureGating";
import { getModuleProfile, providerTestimonials } from "@/data/providerModules";
import type { TherapistProfile, ClubProfile, EducationProfile, ProductProfile } from "@/data/providerModules";
import { useAuth } from "@/context/AuthContext";
import { getEnquiriesForProvider, replyToEnquiry, EnquiryRecord } from "@/data/enquiryStore";

const MAX_REPLY = 800;

const ProviderDashboard = () => {
  const { user } = useAuth();
  const providerId = user?.provider_id ?? providers[0]?.id;
  const profile = providers.find((p) => p.id === providerId);

  // Reply modal state
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<EnquiryRecord | null>(null);
  const [replyText, setReplyText] = useState("");
  const [, forceUpdate] = useState(0);

  if (!profile)
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Provider not found</h1>
      </div>
    );

  const moduleProfile = getModuleProfile(profile.id, profile.category_type);
  const sections = categorySections[profile.category_type] ?? [];
  const testimonials = providerTestimonials.filter((t) => t.provider_id === profile.id);

  const isFeatureEnabled = (featureKey?: string) => {
    if (!featureKey) return true;
    return hasFeature(profile, featureKey as any);
  };

  const openReply = (enquiry: EnquiryRecord) => {
    setReplyTarget(enquiry);
    setReplyText(enquiry.reply ?? "");
    setReplyOpen(true);
  };

  const handleSaveReply = () => {
    if (!replyTarget || !replyText.trim()) return;
    replyToEnquiry(replyTarget.enquiryId, replyText.trim());
    setReplyOpen(false);
    setReplyTarget(null);
    setReplyText("");
    forceUpdate((n) => n + 1); // trigger re-render to show updated status
  };

  return (
    <div className="bg-navy-gradient min-h-screen py-10">
      <div className="container max-w-3xl animate-fade-in">
        <h1 className="mb-3 text-3xl font-bold text-accent-foreground">Provider Dashboard</h1>
        <div className="mb-8 flex items-center gap-2">
          <Badge className="bg-navy-600 text-accent-foreground border-0">{profile.category_type}</Badge>
          <Badge className="bg-teal-500/20 text-teal-400 border-0">{profile.plan_type} plan</Badge>
          <Badge className="bg-emerald-500/15 text-emerald-400 border-0">{profile.plan_status}</Badge>
        </div>

        {/* Your Profile */}
        <Card className="mb-6 border-0 shadow-card">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Your Profile</CardTitle>
            <Button size="sm" variant="outline">
              Edit Profile
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong className="text-foreground">Name:</strong>{" "}
              <span className="text-muted-foreground">{profile.name}</span>
            </p>
            <p>
              <strong className="text-foreground">Type:</strong>{" "}
              <span className="text-muted-foreground">{profile.typeBadge}</span>
            </p>
            <p>
              <strong className="text-foreground">Category:</strong>{" "}
              <span className="text-muted-foreground">{profile.category_type}</span>
            </p>
            <p>
              <strong className="text-foreground">Location:</strong>{" "}
              <span className="text-muted-foreground">{profile.location}</span>
            </p>
            <p>
              <strong className="text-foreground">Delivery:</strong>{" "}
              <span className="text-muted-foreground">{profile.deliveryFormat}</span>
            </p>
          </CardContent>
        </Card>

        {/* Category-driven sections */}
        {sections.map((section) => {
          const enabled = isFeatureEnabled(section.featureKey);
          return (
            <Card key={section.key} className={`mb-6 border-0 shadow-card ${!enabled ? "opacity-60" : ""}`}>
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
                  renderSectionContent(
                    section.key,
                    profile,
                    moduleProfile,
                    getEnquiriesForProvider(providerId),
                    testimonials,
                    openReply,
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    This feature is available on a higher plan. Upgrade to access {section.label.toLowerCase()}.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Plan Info */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Your Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge className="bg-teal-500/20 text-teal-400 border-0">
                {profile.plan_type.charAt(0).toUpperCase() + profile.plan_type.slice(1)} Plan
              </Badge>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-0">
                {profile.plan_status.charAt(0).toUpperCase() + profile.plan_status.slice(1)}
              </Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              You're on the {profile.plan_type} plan. All features are enabled during the pilot period.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reply Modal */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {replyTarget?.parentName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground border-l-2 border-teal-500 pl-3 italic">
              "{replyTarget?.message}"
            </p>
            <Label htmlFor="replyText">Your reply</Label>
            <Textarea
              id="replyText"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value.slice(0, MAX_REPLY))}
              placeholder="Write your response here..."
              rows={5}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span />
              <span style={{ color: MAX_REPLY - replyText.length < 100 ? "#f07840" : undefined }}>
                {MAX_REPLY - replyText.length} remaining
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" className="flex-1" onClick={() => setReplyOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-teal-500 hover:bg-teal-400"
              disabled={!replyText.trim()}
              onClick={handleSaveReply}
            >
              Send Reply
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function getSectionIcon(key: string) {
  const icons: Record<string, React.ReactNode> = {
    availability: <Clock className="h-4 w-4 text-teal-500" />,
    enquiries: <Users className="h-4 w-4 text-teal-500" />,
    certifications: <FileText className="h-4 w-4 text-teal-500" />,
    testimonials: <Star className="h-4 w-4 text-orange-400" />,
    timetable: <Clock className="h-4 w-4 text-teal-500" />,
    gallery: <Image className="h-4 w-4 text-teal-500" />,
    case_studies: <FileText className="h-4 w-4 text-teal-500" />,
    spotlight: <Star className="h-4 w-4 text-orange-400" />,
    store_link: <LinkIcon className="h-4 w-4 text-teal-500" />,
    products: <ShoppingBag className="h-4 w-4 text-teal-500" />,
  };
  return icons[key] ?? null;
}

function renderSectionContent(
  key: string,
  profile: any,
  moduleProfile: any,
  enquiries: EnquiryRecord[],
  testimonials: any[],
  openReply: (e: EnquiryRecord) => void,
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
            <div key={e.enquiryId} className="flex items-center justify-between rounded-xl border border-border/60 p-4">
              <div>
                <p className="font-medium">{e.parentName}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{e.message}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={e.statusForProvider === "new" ? "destructive" : "secondary"}>
                  {e.statusForProvider === "new" ? "New" : "Replied"}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => openReply(e)}>
                  {e.statusForProvider === "replied" ? "Edit Reply" : "Reply"}
                </Button>
              </div>
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
              <CheckCircle className="h-4 w-4 text-teal-500" />
              {c}
            </div>
          ))}
          <Button size="sm" variant="outline" className="mt-2">
            Upload Certification
          </Button>
        </div>
      );

    case "testimonials":
      return testimonials.length === 0 ? (
        <p className="text-muted-foreground">No testimonials yet.</p>
      ) : (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-xl border border-border/60 p-4">
              <div className="flex items-center gap-2">
                {t.rating && <span className="text-sm font-medium text-orange-400">{t.rating}★</span>}
                {t.parent_name && <span className="text-sm text-muted-foreground">{t.parent_name}</span>}
                <Badge variant="secondary" className="ml-auto text-xs">
                  {t.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm leading-relaxed">{t.text}</p>
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
              <Clock className="h-4 w-4 text-teal-500" />
              <span className="font-medium w-24">{t.day}</span>
              <span className="text-muted-foreground">{t.time}</span>
              <span>{t.activity}</span>
            </div>
          ))}
          <Button size="sm" variant="outline" className="mt-2">
            Edit Timetable
          </Button>
        </div>
      );

    case "gallery":
      return (
        <div>
          <p className="text-sm text-muted-foreground mb-2">Upload photos to showcase your activities.</p>
          <Button size="sm" variant="outline">
            Upload Photos
          </Button>
        </div>
      );

    case "case_studies":
      const edu = moduleProfile as EducationProfile | null;
      return (
        <div className="space-y-2">
          {(edu?.case_studies ?? []).map((cs, i) => (
            <p key={i} className="text-sm border-l-2 border-teal-500 pl-3">
              {cs}
            </p>
          ))}
          <Button size="sm" variant="outline" className="mt-2">
            Add Case Study
          </Button>
        </div>
      );

    case "spotlight":
      return <p className="text-sm text-muted-foreground">Spotlight tools coming soon.</p>;

    case "store_link":
      const prod = moduleProfile as ProductProfile | null;
      return (
        <div className="space-y-2">
          <p className="text-sm">
            <strong className="text-foreground">Store URL:</strong>{" "}
            <span className="text-muted-foreground">{prod?.store_link ?? "Not set"}</span>
          </p>
          <Button size="sm" variant="outline">
            Edit Store Link
          </Button>
        </div>
      );

    case "products":
      const prodProfile = moduleProfile as ProductProfile | null;
      return (
        <div className="space-y-2">
          {(prodProfile?.featured_products ?? []).map((p) => (
            <div
              key={p.name}
              className="flex items-center justify-between rounded-xl border border-border/60 p-4 text-sm"
            >
              <span>{p.name}</span>
              <span className="font-semibold text-teal-500">{p.price}</span>
            </div>
          ))}
          <Button size="sm" variant="outline" className="mt-2">
            Manage Products
          </Button>
        </div>
      );

    default:
      return <p className="text-sm text-muted-foreground">Coming soon.</p>;
  }
}

export default ProviderDashboard;
