import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  CheckCircle,
  Lock,
  Clock,
  Users,
  FileText,
  Image,
  Star,
  ShoppingBag,
  Link as LinkIcon,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { providers } from "@/data/mockData";
import { hasFeature, categorySections } from "@/lib/featureGating";
import { getModuleProfile, providerTestimonials } from "@/data/providerModules";
import { useAuth } from "@/context/AuthContext";
import { getEnquiriesForProvider, replyToEnquiry, EnquiryRecord } from "@/data/enquiryStore";
import { getClaimForProvider } from "@/data/founderStore";
import { getProvider, updateProvider, AvailabilityStatus } from "@/data/providerStore";

const MAX_REPLY = 800;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const NEEDS_OPTIONS = [
  "Autism",
  "ADHD",
  "Dyslexia",
  "Dyspraxia",
  "Sensory Processing",
  "Speech Delay",
  "Anxiety",
  "Down Syndrome",
  "Learning Disability",
  "Physical Disability",
  "All SEND needs",
];
const DELIVERY_OPTIONS: Array<"in-person" | "online" | "hybrid"> = ["in-person", "online", "hybrid"];

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; label: string; description: string; color: string }[] = [
  {
    value: "accepting",
    label: "Accepting Clients",
    description: "Open to new clients now",
    color: "text-emerald-400",
  },
  {
    value: "waitlist",
    label: "Waitlist Only",
    description: "Not taking new clients directly, but accepting waitlist enquiries",
    color: "text-orange-400",
  },
  {
    value: "closed",
    label: "Closed",
    description: "Not accepting new clients or waitlist enquiries at this time",
    color: "text-red-400",
  },
];

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const claimStatus = searchParams.get("claimStatus");

  const resolvedUser = (() => {
    try {
      const stored = localStorage.getItem("beyonder_user");
      return stored ? JSON.parse(stored) : user;
    } catch {
      return user;
    }
  })();
  const providerId = resolvedUser?.provider_id ?? providers[0]?.id;

  const storeProfile = getProvider(providerId);
  const fallback = providers.find((p) => p.id === providerId);

  const [editOpen, setEditOpen] = useState(false);
  const [editFields, setEditFields] = useState<{
    businessName: string;
    description: string;
    location: string;
    email: string;
    phone: string;
    website: string;
    coverageArea: string;
    ageRange: string;
    deliveryFormat: "in-person" | "online" | "hybrid";
    needsSupported: string[];
  }>({
    businessName: storeProfile?.businessName ?? fallback?.name ?? "",
    description: storeProfile?.description ?? fallback?.description ?? "",
    location: storeProfile?.location ?? fallback?.location ?? "",
    email: storeProfile?.email ?? "",
    phone: storeProfile?.phone ?? "",
    website: storeProfile?.website ?? "",
    coverageArea: storeProfile?.coverageArea ?? fallback?.coverageArea ?? "",
    ageRange: storeProfile?.ageRange ?? fallback?.ageRange ?? "",
    deliveryFormat: storeProfile?.deliveryFormat ?? fallback?.deliveryFormat ?? "in-person",
    needsSupported: storeProfile?.needsSupported ?? fallback?.needsSupported ?? [],
  });

  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState<EnquiryRecord | null>(null);
  const [replyText, setReplyText] = useState("");
  const [, forceUpdate] = useState(0);

  const [newCert, setNewCert] = useState("");
  const [newTimetable, setNewTimetable] = useState({ day: "", time: "", activity: "" });
  const [spotlightMsg, setSpotlightMsg] = useState(storeProfile?.spotlightMessage ?? "");
  const [storeUrl, setStoreUrl] = useState(storeProfile?.storeUrl ?? "");
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "" });
  const [newCaseStudy, setNewCaseStudy] = useState({ title: "", description: "" });
  const [savedMsg, setSavedMsg] = useState("");
  const [galleryError, setGalleryError] = useState("");
  const [changeRequestDone, setChangeRequestDone] = useState(false);

  const profile =
    storeProfile ??
    (fallback
      ? {
          ...fallback,
          businessName: fallback.name,
          email: "",
          phone: "",
          website: "",
          credentials: fallback.credentials ?? [],
          timetable: fallback.timetable ?? [],
          gallery: [],
          caseStudies: fallback.educationDetails ? [{ title: "Overview", description: fallback.educationDetails }] : [],
          spotlightMessage: "",
          storeUrl: "",
          products: fallback.products ?? [],
          availabilityStatus: "accepting" as AvailabilityStatus,
          moderationStatus: "active" as const,
          suspendedMessage: "",
          changeRequest: null,
        }
      : null);

  if (!profile)
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Provider not found</h1>
      </div>
    );

  // ── Block dashboard if claim is pending review ──
  if (claimStatus === "pending_review") {
    return (
      <div className="bg-navy-gradient min-h-screen py-10">
        <div className="container max-w-xl animate-fade-in">
          <h1 className="mb-6 text-3xl font-bold text-accent-foreground">Provider Dashboard</h1>
          <div
            className="rounded-xl border p-6 text-center space-y-4"
            style={{
              background: "rgba(232,98,42,0.08)",
              border: "1px solid rgba(232,98,42,0.25)",
            }}
          >
            <div className="flex justify-center">
              <Clock className="h-10 w-10 text-orange-400" />
            </div>
            <h2 className="text-xl font-semibold text-orange-400">Your claim is being reviewed</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We're verifying your connection to this listing. Our team will be in touch shortly. Your dashboard will
              become available once your claim has been approved.
            </p>
            <p className="text-xs text-muted-foreground">
              If you have any questions, please contact <span className="text-teal-400">support@beyonder.com</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isSuspended = profile.moderationStatus === "suspended";
  const changeRequest = profile.changeRequest;
  const isAcknowledged = changeRequestDone || changeRequest?.status === "acknowledged";

  const moduleProfile = getModuleProfile(providerId, profile.category_type);
  const sections = categorySections[profile.category_type as keyof typeof categorySections] ?? [];
  const testimonials = providerTestimonials.filter((t) => t.provider_id === providerId);

  const isFeatureEnabled = (featureKey?: string) => {
    if (!featureKey) return true;
    return hasFeature(
      { plan_type: profile.plan_type as any, plan_status: profile.plan_status as any },
      featureKey as any,
    );
  };

  const showSaved = (msg = "Saved ✓") => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 2000);
  };

  const handleSaveProfile = () => {
    updateProvider(providerId, {
      businessName: editFields.businessName,
      description: editFields.description,
      location: editFields.location,
      email: editFields.email,
      phone: editFields.phone,
      website: editFields.website,
      coverageArea: editFields.coverageArea,
      ageRange: editFields.ageRange,
      deliveryFormat: editFields.deliveryFormat,
      needsSupported: editFields.needsSupported,
    });
    setEditOpen(false);
    showSaved("Profile saved ✓");
    forceUpdate((n) => n + 1);
  };

  const toggleNeed = (need: string) => {
    setEditFields((f) => ({
      ...f,
      needsSupported: f.needsSupported.includes(need)
        ? f.needsSupported.filter((n) => n !== need)
        : [...f.needsSupported, need],
    }));
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
    forceUpdate((n) => n + 1);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGalleryError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setGalleryError("Only PNG or JPEG files are accepted.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setGalleryError("File is too large. Maximum size is 2MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      updateProvider(providerId, { gallery: [...(profile.gallery ?? []), dataUrl] });
      forceUpdate((n) => n + 1);
      showSaved("Image added ✓");
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleChangesMade = () => {
    if (changeRequest) {
      updateProvider(providerId, {
        changeRequest: { message: changeRequest.message, status: "acknowledged" },
      });
    }
    setChangeRequestDone(true);
    forceUpdate((n) => n + 1);
  };

  const handleAvailabilityChange = (value: AvailabilityStatus) => {
    updateProvider(providerId, { availabilityStatus: value });
    forceUpdate((n) => n + 1);
    showSaved("Availability updated ✓");
  };

  return (
    <div className="bg-navy-gradient min-h-screen py-10">
      <div className="container max-w-3xl animate-fade-in">
        <h1 className="mb-3 text-3xl font-bold text-accent-foreground">Provider Dashboard</h1>
        <div className="mb-8 flex items-center gap-2 flex-wrap">
          <Badge className="bg-navy-600 text-accent-foreground border-0">{profile.category_type}</Badge>
          <Badge className="bg-teal-500/20 text-teal-400 border-0">{profile.plan_type} plan</Badge>
          <Badge className="bg-emerald-500/15 text-emerald-400 border-0">{profile.plan_status}</Badge>
          {isSuspended && <Badge className="bg-red-500/20 text-red-400 border-0">Suspended</Badge>}
        </div>

        {/* Suspension banner */}
        {isSuspended && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.08] p-4">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 text-sm">Your account has been suspended</p>
              <p className="text-sm text-muted-foreground mt-1">
                {profile.suspendedMessage ||
                  "Your listing has been suspended by Beyonder. Please contact support for more information."}
              </p>
            </div>
          </div>
        )}

        {/* Change request banner */}
        {changeRequest && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-orange-500/25 bg-orange-500/[0.08] p-4">
            <ClipboardList className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              {isAcknowledged ? (
                <>
                  <p className="font-semibold text-orange-400 text-sm">Thanks — we'll review your changes shortly</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our team has been notified and will check your profile soon.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-orange-400 text-sm">Action required: please update your profile</p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{changeRequest.message}</p>
                  <Button
                    size="sm"
                    className="mt-3 bg-orange-500 hover:bg-orange-400 text-white"
                    onClick={handleChangesMade}
                  >
                    Changes Made
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {savedMsg && (
          <div className="mb-4 rounded-xl bg-teal-500/10 border border-teal-500/25 px-4 py-2 text-sm text-teal-400">
            {savedMsg}
          </div>
        )}

        {/* Profile card */}
        <Card className="mb-6 border-0 shadow-card">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Your Profile</CardTitle>
            <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
              Edit Profile
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong className="text-foreground">Name:</strong>{" "}
              <span className="text-muted-foreground">{profile.businessName}</span>
            </p>
            <p>
              <strong className="text-foreground">Type:</strong>{" "}
              <span className="text-muted-foreground">{profile.typeBadge}</span>
            </p>
            <p>
              <strong className="text-foreground">Location:</strong>{" "}
              <span className="text-muted-foreground">{profile.location}</span>
            </p>
            <p>
              <strong className="text-foreground">Coverage:</strong>{" "}
              <span className="text-muted-foreground">{profile.coverageArea}</span>
            </p>
            <p>
              <strong className="text-foreground">Age Range:</strong>{" "}
              <span className="text-muted-foreground">{profile.ageRange}</span>
            </p>
            <p>
              <strong className="text-foreground">Delivery:</strong>{" "}
              <span className="text-muted-foreground">{profile.deliveryFormat}</span>
            </p>
            {profile.email && (
              <p>
                <strong className="text-foreground">Email:</strong>{" "}
                <span className="text-muted-foreground">{profile.email}</span>
              </p>
            )}
            {profile.phone && (
              <p>
                <strong className="text-foreground">Phone:</strong>{" "}
                <span className="text-muted-foreground">{profile.phone}</span>
              </p>
            )}
            {profile.website && (
              <p>
                <strong className="text-foreground">Website:</strong>{" "}
                <span className="text-muted-foreground">{profile.website}</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Category sections */}
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
                    handleAvailabilityChange,
                    {
                      newCert,
                      setNewCert,
                      newTimetable,
                      setNewTimetable,
                      spotlightMsg,
                      setSpotlightMsg,
                      storeUrl,
                      setStoreUrl,
                      newProduct,
                      setNewProduct,
                      newCaseStudy,
                      setNewCaseStudy,
                      updateProvider,
                      providerId,
                      forceUpdate,
                      showSaved,
                      handleGalleryUpload,
                      galleryError,
                    },
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">Upgrade to access {section.label.toLowerCase()}.</p>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Plan card */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Your Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const claim = getClaimForProvider(providerId);
              const planType = claim?.planType ?? profile.plan_type;
              const isFounder = planType === "founder";
              return (
                <>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-teal-500/20 text-teal-400 border-0">
                      {isFounder ? "Founder Plan" : "Free Plan"}
                    </Badge>
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-0">Active</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {isFounder
                      ? "You're a founding provider on Beyonder. Founder benefits stay with you after launch."
                      : "You're on the free plan. Upgrade anytime for more visibility and tools."}
                  </p>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Business Name</Label>
              <Input
                value={editFields.businessName}
                onChange={(e) => setEditFields((f) => ({ ...f, businessName: e.target.value }))}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={4}
                value={editFields.description}
                onChange={(e) => setEditFields((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={editFields.location}
                onChange={(e) => setEditFields((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div>
              <Label>Coverage Area</Label>
              <Input
                value={editFields.coverageArea}
                onChange={(e) => setEditFields((f) => ({ ...f, coverageArea: e.target.value }))}
              />
            </div>
            <div>
              <Label>Age Range</Label>
              <Input
                value={editFields.ageRange}
                onChange={(e) => setEditFields((f) => ({ ...f, ageRange: e.target.value }))}
                placeholder="e.g. 3-18 years"
              />
            </div>
            <div>
              <Label>Email (public)</Label>
              <Input
                type="email"
                value={editFields.email}
                onChange={(e) => setEditFields((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={editFields.phone}
                onChange={(e) => setEditFields((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div>
              <Label>Website</Label>
              <Input
                value={editFields.website}
                onChange={(e) => setEditFields((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://yoursite.co.uk"
              />
            </div>
            <div>
              <Label>Delivery Type</Label>
              <Select
                value={editFields.deliveryFormat}
                onValueChange={(v) => setEditFields((f) => ({ ...f, deliveryFormat: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {DELIVERY_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Needs Supported</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {NEEDS_OPTIONS.map((need) => (
                  <button
                    key={need}
                    type="button"
                    onClick={() => toggleNeed(need)}
                    className={`rounded-full px-3 py-1 text-xs border transition-colors ${
                      editFields.needsSupported.includes(need)
                        ? "bg-teal-500/20 border-teal-500/50 text-teal-400"
                        : "border-border/60 text-muted-foreground"
                    }`}
                  >
                    {need}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-teal-500 hover:bg-teal-400" onClick={handleSaveProfile}>
                Save Profile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; label: string; description: string }[] = [
  { value: "accepting", label: "Accepting Clients", description: "Open to new clients now" },
  { value: "waitlist", label: "Waitlist Only", description: "Accepting waitlist enquiries only" },
  { value: "closed", label: "Closed", description: "Not accepting new clients or enquiries" },
];

function renderSectionContent(
  key: string,
  profile: any,
  moduleProfile: any,
  enquiries: EnquiryRecord[],
  testimonials: any[],
  openReply: (e: EnquiryRecord) => void,
  handleAvailabilityChange: (value: AvailabilityStatus) => void,
  ctx: any,
) {
  const {
    newCert,
    setNewCert,
    newTimetable,
    setNewTimetable,
    spotlightMsg,
    setSpotlightMsg,
    storeUrl,
    setStoreUrl,
    newProduct,
    setNewProduct,
    newCaseStudy,
    setNewCaseStudy,
    updateProvider,
    providerId,
    forceUpdate,
    showSaved,
    handleGalleryUpload,
    galleryError,
  } = ctx;

  switch (key) {
    case "availability":
      const current: AvailabilityStatus = profile.availabilityStatus ?? "accepting";
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This status is shown on your public profile so families know whether to get in touch.
          </p>
          <div className="grid gap-2">
            {AVAILABILITY_OPTIONS.map((opt) => {
              const isSelected = current === opt.value;
              const borderColor =
                opt.value === "accepting"
                  ? isSelected
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-border/60"
                  : opt.value === "waitlist"
                    ? isSelected
                      ? "border-orange-400 bg-orange-400/10"
                      : "border-border/60"
                    : isSelected
                      ? "border-red-400 bg-red-400/10"
                      : "border-border/60";
              const labelColor =
                opt.value === "accepting"
                  ? "text-emerald-400"
                  : opt.value === "waitlist"
                    ? "text-orange-400"
                    : "text-red-400";
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAvailabilityChange(opt.value)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${borderColor}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium text-sm ${isSelected ? labelColor : "text-foreground"}`}>
                      {opt.label}
                    </span>
                    {isSelected && <span className={`text-xs font-semibold ${labelColor}`}>● Active</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
                </button>
              );
            })}
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
      return (
        <div className="space-y-2">
          {(profile.credentials ?? []).map((c: string) => (
            <div key={c} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-teal-500" />
                {c}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-400 h-6 px-2"
                onClick={() => {
                  updateProvider(providerId, { credentials: profile.credentials.filter((x: string) => x !== c) });
                  forceUpdate((n: number) => n + 1);
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <Input placeholder="e.g. HCPC Registered" value={newCert} onChange={(e) => setNewCert(e.target.value)} />
            <Button
              size="sm"
              className="bg-teal-500 hover:bg-teal-400 shrink-0"
              onClick={() => {
                if (!newCert.trim()) return;
                updateProvider(providerId, { credentials: [...(profile.credentials ?? []), newCert.trim()] });
                setNewCert("");
                forceUpdate((n: number) => n + 1);
                showSaved();
              }}
            >
              Add
            </Button>
          </div>
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
      return (
        <div className="space-y-2">
          {(profile.timetable ?? []).map((t: any, i: number) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-teal-500 shrink-0" />
              <span className="font-medium w-24">{t.day}</span>
              <span className="text-muted-foreground">{t.time}</span>
              <span className="flex-1">{t.activity}</span>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-400 h-6 px-2"
                onClick={() => {
                  updateProvider(providerId, {
                    timetable: profile.timetable.filter((_: any, idx: number) => idx !== i),
                  });
                  forceUpdate((n: number) => n + 1);
                }}
              >
                ✕
              </Button>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <Input
              placeholder="Day"
              value={newTimetable.day}
              onChange={(e) => setNewTimetable((t: any) => ({ ...t, day: e.target.value }))}
            />
            <Input
              placeholder="Time"
              value={newTimetable.time}
              onChange={(e) => setNewTimetable((t: any) => ({ ...t, time: e.target.value }))}
            />
            <Input
              placeholder="Activity"
              value={newTimetable.activity}
              onChange={(e) => setNewTimetable((t: any) => ({ ...t, activity: e.target.value }))}
            />
          </div>
          <Button
            size="sm"
            className="bg-teal-500 hover:bg-teal-400"
            onClick={() => {
              if (!newTimetable.day || !newTimetable.time || !newTimetable.activity) return;
              updateProvider(providerId, { timetable: [...(profile.timetable ?? []), newTimetable] });
              setNewTimetable({ day: "", time: "", activity: "" });
              forceUpdate((n: number) => n + 1);
              showSaved();
            }}
          >
            Add Session
          </Button>
        </div>
      );

    case "gallery":
      return (
        <div className="space-y-3">
          {(profile.gallery ?? []).length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {profile.gallery.map((url: string, i: number) => (
                <div key={i} className="relative rounded-lg overflow-hidden bg-muted aspect-square">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    onClick={() => {
                      updateProvider(providerId, {
                        gallery: profile.gallery.filter((_: any, idx: number) => idx !== i),
                      });
                      forceUpdate((n: number) => n + 1);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-1">
            <label
              htmlFor="galleryUpload"
              className="flex flex-col items-center justify-center w-full rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-6 cursor-pointer hover:bg-muted/50 transition-colors text-center"
            >
              <Image className="h-6 w-6 text-teal-500 mb-2" />
              <span className="text-sm font-medium text-foreground">Click to upload an image</span>
              <span className="text-xs text-muted-foreground mt-1">PNG or JPEG only · Max 2MB</span>
              <input
                id="galleryUpload"
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleGalleryUpload}
              />
            </label>
            {galleryError && <p className="text-xs text-red-400">{galleryError}</p>}
          </div>
        </div>
      );

    case "case_studies":
      return (
        <div className="space-y-3">
          {(profile.caseStudies ?? []).map((cs: any, i: number) => (
            <div key={i} className="rounded-xl border border-border/60 p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{cs.title}</p>
                  <p className="text-muted-foreground mt-1">{cs.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 h-6 px-2 shrink-0"
                  onClick={() => {
                    updateProvider(providerId, {
                      caseStudies: profile.caseStudies.filter((_: any, idx: number) => idx !== i),
                    });
                    forceUpdate((n: number) => n + 1);
                  }}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
          <div className="space-y-2 mt-2">
            <Input
              placeholder="Title"
              value={newCaseStudy.title}
              onChange={(e) => setNewCaseStudy((c: any) => ({ ...c, title: e.target.value }))}
            />
            <Textarea
              placeholder="Description"
              rows={3}
              value={newCaseStudy.description}
              onChange={(e) => setNewCaseStudy((c: any) => ({ ...c, description: e.target.value }))}
            />
            <Button
              size="sm"
              className="bg-teal-500 hover:bg-teal-400"
              onClick={() => {
                if (!newCaseStudy.title || !newCaseStudy.description) return;
                updateProvider(providerId, { caseStudies: [...(profile.caseStudies ?? []), newCaseStudy] });
                setNewCaseStudy({ title: "", description: "" });
                forceUpdate((n: number) => n + 1);
                showSaved();
              }}
            >
              Add Case Study
            </Button>
          </div>
        </div>
      );

    case "spotlight":
      return (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            This message appears as a highlighted block on your public profile.
          </p>
          <Textarea
            rows={3}
            placeholder="e.g. We currently have free drop-in sessions every Tuesday..."
            value={spotlightMsg}
            onChange={(e) => setSpotlightMsg(e.target.value)}
          />
          <Button
            size="sm"
            className="bg-teal-500 hover:bg-teal-400"
            onClick={() => {
              updateProvider(providerId, { spotlightMessage: spotlightMsg });
              forceUpdate((n: number) => n + 1);
              showSaved();
            }}
          >
            Save Message
          </Button>
        </div>
      );

    case "store_link":
      return (
        <div className="space-y-2">
          <Input placeholder="https://yourstore.co.uk" value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)} />
          <Button
            size="sm"
            className="bg-teal-500 hover:bg-teal-400"
            onClick={() => {
              updateProvider(providerId, { storeUrl });
              forceUpdate((n: number) => n + 1);
              showSaved();
            }}
          >
            Save Store URL
          </Button>
        </div>
      );

    case "products":
      return (
        <div className="space-y-2">
          {(profile.products ?? []).map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-border/60 p-4 text-sm">
              <div>
                <span className="font-medium">{p.name}</span>
                <span className="text-teal-500 ml-2">{p.price}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-400 h-6 px-2"
                onClick={() => {
                  updateProvider(providerId, { products: profile.products.filter((_: any, idx: number) => idx !== i) });
                  forceUpdate((n: number) => n + 1);
                }}
              >
                ✕
              </Button>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              placeholder="Product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct((p: any) => ({ ...p, name: e.target.value }))}
            />
            <Input
              placeholder="Price e.g. £12.99"
              value={newProduct.price}
              onChange={(e) => setNewProduct((p: any) => ({ ...p, price: e.target.value }))}
            />
          </div>
          <Button
            size="sm"
            className="bg-teal-500 hover:bg-teal-400"
            onClick={() => {
              if (!newProduct.name || !newProduct.price) return;
              updateProvider(providerId, {
                products: [...(profile.products ?? []), { ...newProduct, image: "/placeholder.svg" }],
              });
              setNewProduct({ name: "", price: "", image: "" });
              forceUpdate((n: number) => n + 1);
              showSaved();
            }}
          >
            Add Product
          </Button>
        </div>
      );

    default:
      return <p className="text-sm text-muted-foreground">Coming soon.</p>;
  }
}

export default ProviderDashboard;
