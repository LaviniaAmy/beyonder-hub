import { useState, useRef, useEffect } from "react";
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
  Upload,
  NotebookPen,
  ShieldCheck,
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
import { getEnquiriesForProvider, replyToEnquiry, updateProviderNotes, EnquiryRecord } from "@/data/enquiryStore";
import { getClaimForProvider } from "@/data/founderStore";
import { getProvider, updateProvider, AvailabilityStatus } from "@/data/providerStore";

const MAX_REPLY = 800;
const MAX_NOTES = 500;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_PRODUCT_IMAGE_SIZE = 1 * 1024 * 1024;
const MAX_SHORT_DESC = 120;

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

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; label: string; description: string }[] = [
  { value: "accepting", label: "Accepting Clients", description: "Open to new clients now" },
  {
    value: "waitlist",
    label: "Waitlist Only",
    description: "Not taking new clients directly, but accepting waitlist enquiries",
  },
  { value: "closed", label: "Closed", description: "Not accepting new clients or waitlist enquiries at this time" },
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

  const [selectedEnquiryId, setSelectedEnquiryId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [notesText, setNotesText] = useState("");
  const [, forceUpdate] = useState(0);

  const [newCert, setNewCert] = useState("");
  const [newTimetable, setNewTimetable] = useState({ day: "", time: "", activity: "" });
  // Text fields that mirror store values — useState alone only initialises once, so
  // useEffect re-syncs each field whenever forceUpdate causes storeProfile to change.
  const [spotlightMsg, setSpotlightMsg] = useState(storeProfile?.spotlightMessage ?? "");
  const [storeUrl, setStoreUrl] = useState(storeProfile?.storeUrl ?? "");
  const [ehcpAdmissionsText, setEhcpAdmissionsText] = useState(storeProfile?.ehcpAdmissionsInfo ?? "");
  const [volunteerText, setVolunteerText] = useState(storeProfile?.volunteerInfo ?? "");
  useEffect(() => {
    setSpotlightMsg(storeProfile?.spotlightMessage ?? "");
  }, [storeProfile?.spotlightMessage]);
  useEffect(() => {
    setStoreUrl(storeProfile?.storeUrl ?? "");
  }, [storeProfile?.storeUrl]);
  useEffect(() => {
    setEhcpAdmissionsText(storeProfile?.ehcpAdmissionsInfo ?? "");
  }, [storeProfile?.ehcpAdmissionsInfo]);
  useEffect(() => {
    setVolunteerText(storeProfile?.volunteerInfo ?? "");
  }, [storeProfile?.volunteerInfo]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    image: "/placeholder.svg",
    shortDescription: "",
  });
  const [newCaseStudy, setNewCaseStudy] = useState({ title: "", description: "" });
  const [savedMsg, setSavedMsg] = useState("");
  const [galleryError, setGalleryError] = useState("");
  const [changeRequestDone, setChangeRequestDone] = useState(false);
  const [productImageErrors, setProductImageErrors] = useState<Record<number, string>>({});
  const [newProductImageError, setNewProductImageError] = useState("");
  const newProductFileRef = useRef<HTMLInputElement | null>(null);
  const existingProductFileRefs = useRef<Record<number, HTMLInputElement | null>>({});
  // 3.1 Session types
  const [newSessionType, setNewSessionType] = useState({ name: "", duration: "", price: "" });
  // 3.2 Availability dates
  const [newAvailDate, setNewAvailDate] = useState("");
  // 4.1 Session capacity
  const [newCapacity, setNewCapacity] = useState({ session: "", capacity: "", spotsLeft: "" });
  // 4.2 Term programme
  const [newTerm, setNewTerm] = useState({ term: "", details: "" });
  // 5.1 Open days
  const [newOpenDay, setNewOpenDay] = useState({ title: "", date: "", description: "", rsvpLink: "" });
  // 5.3 Staff profiles
  const [newStaff, setNewStaff] = useState({ name: "", role: "", bio: "" });
  // 6.1 Events
  const [newEvent, setNewEvent] = useState<{
    title: string;
    date: string;
    type: "online" | "in-person";
    description: string;
  }>({ title: "", date: "", type: "in-person", description: "" });

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
          products: (fallback.products ?? []).map((p) => ({
            name: p.name,
            price: p.price,
            image: p.image ?? "/placeholder.svg",
            shortDescription: "",
          })),
          availabilityStatus: "accepting" as AvailabilityStatus,
          moderationStatus: "active" as const,
          suspendedMessage: "",
          changeRequest: null,
          isVerified: false,
          isFeatured: false,
          ehcpSupport: false,
          sessionTypes: [],
          availabilityDates: [],
          sessionCapacity: [],
          termProgramme: [],
          openDays: [],
          ehcpAdmissionsInfo: "",
          staffProfiles: [],
          events: [],
          volunteerInfo: "",
        }
      : null);

  if (!profile)
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Provider not found</h1>
      </div>
    );

  if (claimStatus === "pending_review") {
    return (
      <div className="bg-navy-gradient min-h-screen py-10">
        <div className="container max-w-xl animate-fade-in">
          <h1 className="mb-6 text-3xl font-bold text-accent-foreground">Provider Dashboard</h1>
          <div
            className="rounded-xl border p-6 text-center space-y-4"
            style={{ background: "rgba(232,98,42,0.08)", border: "1px solid rgba(232,98,42,0.25)" }}
          >
            <div className="flex justify-center">
              <Clock className="h-10 w-10 text-orange-400" />
            </div>
            <h2 className="text-xl font-semibold text-orange-400">Your claim is being reviewed</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We're verifying your connection to this listing. Our team will be in touch shortly.
            </p>
            <p className="text-xs text-muted-foreground">
              Contact <span className="text-teal-400">support@beyonder.com</span>
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

  const isTherapist = profile.category_type === "therapist";

  // ── Feature gating helpers ──
  const planGate = { plan_type: profile.plan_type as any, plan_status: profile.plan_status as any };

  const isFeatureEnabled = (featureKey?: string) => {
    if (!featureKey) return true;
    return hasFeature(planGate, featureKey as any);
  };

  const isPaidPlan = profile.plan_type === "founder" || profile.plan_type === "professional";

  const hasReferralNotes = isPaidPlan;
  const hasEhcpToggle = isPaidPlan && isTherapist;

  const showSaved = (msg = "Saved ✓") => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 2000);
  };

  const handleSaveProfile = () => {
    updateProvider(providerId, { ...editFields });
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

  const handleSendReply = () => {
    if (!selectedEnquiryId || !replyText.trim()) return;
    replyToEnquiry(selectedEnquiryId, replyText.trim(), profile.businessName);
    setReplyText("");
    forceUpdate((n) => n + 1);
  };

  const handleNotesSave = (enquiryId: string, notes: string) => {
    updateProviderNotes(enquiryId, notes);
  };

  const handleEhcpToggle = () => {
    updateProvider(providerId, { ehcpSupport: !profile.ehcpSupport });
    forceUpdate((n) => n + 1);
    showSaved(profile.ehcpSupport ? "EHCP support removed ✓" : "EHCP support enabled ✓");
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
      updateProvider(providerId, { gallery: [...(profile.gallery ?? []), reader.result as string] });
      forceUpdate((n) => n + 1);
      showSaved("Image added ✓");
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleExistingProductImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    setProductImageErrors((prev) => ({ ...prev, [index]: "" }));
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setProductImageErrors((prev) => ({ ...prev, [index]: "PNG or JPEG only." }));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
      setProductImageErrors((prev) => ({ ...prev, [index]: "Max file size is 1MB." }));
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const updated = [...(profile.products ?? [])];
      updated[index] = { ...updated[index], image: reader.result as string };
      updateProvider(providerId, { products: updated });
      forceUpdate((n) => n + 1);
      showSaved("Product image saved ✓");
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleExistingProductDescChange = (index: number, value: string) => {
    if (value.length > MAX_SHORT_DESC) return;
    const updated = [...(profile.products ?? [])];
    updated[index] = { ...updated[index], shortDescription: value };
    updateProvider(providerId, { products: updated });
    forceUpdate((n) => n + 1);
  };

  const handleNewProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProductImageError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setNewProductImageError("PNG or JPEG only.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PRODUCT_IMAGE_SIZE) {
      setNewProductImageError("Max file size is 1MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setNewProduct((p) => ({ ...p, image: reader.result as string }));
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleChangesMade = () => {
    if (changeRequest)
      updateProvider(providerId, { changeRequest: { message: changeRequest.message, status: "acknowledged" } });
    setChangeRequestDone(true);
    forceUpdate((n) => n + 1);
  };

  const handleAvailabilityChange = (value: AvailabilityStatus) => {
    updateProvider(providerId, { availabilityStatus: value });
    forceUpdate((n) => n + 1);
    showSaved("Availability updated ✓");
  };

  const providerEnquiries = getEnquiriesForProvider(providerId);
  const selectedEnquiry = providerEnquiries.find((e) => e.enquiryId === selectedEnquiryId) ?? null;

  const renderEnquiriesSection = () => {
    if (selectedEnquiry) {
      const atCap = (selectedEnquiry.messageCount ?? 0) >= 4;
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{selectedEnquiry.parentName}</p>
              <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground mt-0.5">
                <span>Age: {selectedEnquiry.childAge}</span>
                {selectedEnquiry.childName && <span>Name: {selectedEnquiry.childName}</span>}
                {selectedEnquiry.needs && <span>Needs: {selectedEnquiry.needs}</span>}
                <span>{selectedEnquiry.createdAt}</span>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedEnquiryId(null);
                setReplyText("");
                setNotesText("");
              }}
            >
              ← Back
            </Button>
          </div>

          <div className="space-y-2">
            {(selectedEnquiry.messages ?? []).length > 0 ? (
              selectedEnquiry.messages.map((msg) => (
                <div
                  key={msg.messageId}
                  className={`rounded-xl p-4 ${msg.senderId === "parent" ? "bg-muted/30 border border-border/40 mr-8 break-words" : "bg-teal-500/[0.06] border border-teal-500/20 ml-8 break-words"}`}
                >
                  <p
                    className={`text-xs mb-1 ${msg.senderId === "parent" ? "text-muted-foreground" : "text-teal-500"}`}
                  >
                    {msg.senderId === "parent" ? selectedEnquiry.parentName : "You"} · {msg.sentAt}
                  </p>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              ))
            ) : (
              <>
                <div className="rounded-xl bg-muted/30 border border-border/40 p-4 mr-8 break-words">
                  <p className="text-xs text-muted-foreground mb-1">{selectedEnquiry.parentName}</p>
                  <p className="text-sm leading-relaxed">{selectedEnquiry.message}</p>
                </div>
                {selectedEnquiry.reply && (
                  <div className="rounded-xl bg-teal-500/[0.06] border border-teal-500/20 p-4 ml-8 break-words">
                    <p className="text-xs text-teal-500 mb-1">You</p>
                    <p className="text-sm leading-relaxed">{selectedEnquiry.reply}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {atCap ? (
            <div className="rounded-xl border border-border/40 bg-muted/20 p-4 text-center">
              <p className="text-sm text-muted-foreground">This conversation has reached its limit.</p>
            </div>
          ) : (
            <div className="pt-2 space-y-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                {4 - (selectedEnquiry.messageCount ?? 0)} message
                {4 - (selectedEnquiry.messageCount ?? 0) !== 1 ? "s" : ""} remaining
              </p>
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value.slice(0, MAX_REPLY))}
                placeholder="Write your reply..."
                rows={4}
              />
              <div className="flex items-center justify-between">
                <span
                  className="text-xs text-muted-foreground"
                  style={{ color: MAX_REPLY - replyText.length < 100 ? "#f07840" : undefined }}
                >
                  {MAX_REPLY - replyText.length} remaining
                </span>
                <Button
                  size="sm"
                  className="bg-teal-500 hover:bg-teal-400"
                  disabled={!replyText.trim()}
                  onClick={handleSendReply}
                >
                  Send Reply
                </Button>
              </div>
            </div>
          )}

          {/* Referral Notes — paid plans only, never parent-facing */}
          {hasReferralNotes && (
            <div className="mt-4 rounded-xl border border-border/40 bg-muted/10 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Referral Notes</p>
                <Badge variant="outline" className="text-xs text-muted-foreground border-border/40 ml-auto">
                  Private — not visible to families
                </Badge>
              </div>
              <Textarea
                value={notesText || selectedEnquiry.providerNotes}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_NOTES) setNotesText(e.target.value);
                }}
                onBlur={() => handleNotesSave(selectedEnquiry.enquiryId, notesText || selectedEnquiry.providerNotes)}
                placeholder="Add private notes about this enquiry, referral source, next steps..."
                rows={3}
                className="text-sm bg-transparent"
              />
              <p className="text-right text-xs text-muted-foreground/50">
                {(notesText || selectedEnquiry.providerNotes).length}/{MAX_NOTES} · auto-saves on blur
              </p>
            </div>
          )}
        </div>
      );
    }

    return providerEnquiries.length === 0 ? (
      <p className="text-muted-foreground">No enquiries yet.</p>
    ) : (
      <div className="space-y-3">
        {providerEnquiries.map((e) => (
          <div
            key={e.enquiryId}
            className="flex items-center justify-between rounded-xl border border-border/60 p-4 cursor-pointer hover:bg-muted/10 transition-colors overflow-hidden"
            onClick={() => {
              setSelectedEnquiryId(e.enquiryId);
              setReplyText("");
              setNotesText(e.providerNotes ?? "");
            }}
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{e.parentName}</p>
              <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                {e.childName && <span>{e.childName}</span>}
                {e.needs && <span className="truncate max-w-[140px]">{e.needs}</span>}
                {!e.childName && !e.needs && <span className="truncate">{e.message}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={e.statusForProvider === "new" ? "destructive" : "secondary"}>
                {e.statusForProvider === "new" ? "New" : "Replied"}
              </Badge>
              <span className="text-xs text-muted-foreground">View →</span>
            </div>
          </div>
        ))}
      </div>
    );
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

        {isSuspended && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.08] p-4">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 text-sm">Your account has been suspended</p>
              <p className="text-sm text-muted-foreground mt-1">
                {profile.suspendedMessage || "Your listing has been suspended by Beyonder. Please contact support."}
              </p>
            </div>
          </div>
        )}

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

        {/* Profile Card */}
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

        {/* Category Sections */}
        {sections
          .filter((section) => section.key !== "referral_notes")
          .map((section) => {
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
                    section.key === "enquiries" ? (
                      renderEnquiriesSection()
                    ) : (
                      renderSectionContent(
                        section.key,
                        profile,
                        moduleProfile,
                        testimonials,
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
                          handleExistingProductImageUpload,
                          handleExistingProductDescChange,
                          handleNewProductImageUpload,
                          productImageErrors,
                          newProductImageError,
                          existingProductFileRefs,
                          newProductFileRef,
                          newSessionType,
                          setNewSessionType,
                          newAvailDate,
                          setNewAvailDate,
                          newCapacity,
                          setNewCapacity,
                          newTerm,
                          setNewTerm,
                          newOpenDay,
                          setNewOpenDay,
                          ehcpAdmissionsText,
                          setEhcpAdmissionsText,
                          newStaff,
                          setNewStaff,
                          newEvent,
                          setNewEvent,
                          volunteerText,
                          setVolunteerText,
                        },
                      )
                    )
                  ) : (
                    <p className="text-sm text-muted-foreground">Upgrade to access {section.label.toLowerCase()}.</p>
                  )}
                </CardContent>
              </Card>
            );
          })}

        {/* ── EHCP Support Card — therapists only, always visible, gated by plan ── */}
        {isTherapist && (
          <Card className={`mb-6 border-0 shadow-card ${!isPaidPlan ? "opacity-60" : ""}`}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-orange-400" />
                EHCP Support
                {!isPaidPlan && <Lock className="h-4 w-4 text-muted-foreground" />}
              </CardTitle>
              {!isPaidPlan ? (
                <Badge variant="outline" className="text-muted-foreground">
                  Upgrade to unlock
                </Badge>
              ) : profile.ehcpSupport ? (
                <Badge className="bg-orange-500/15 text-orange-400 border-0 text-xs">Active</Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground text-xs">
                  Inactive
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {isPaidPlan ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Enabling EHCP support adds an orange badge to your profile and listing, helping families with
                    Education, Health and Care Plans find you more easily.
                  </p>
                  <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/10 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {profile.ehcpSupport ? "EHCP support is enabled" : "EHCP support is disabled"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {profile.ehcpSupport
                          ? "Your profile shows the EHCP Supported badge"
                          : "Toggle on to show the EHCP Supported badge on your profile"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleEhcpToggle}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                        profile.ehcpSupport ? "bg-orange-400" : "bg-muted-foreground/30"
                      }`}
                      role="switch"
                      aria-checked={profile.ehcpSupport}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition-transform duration-200 ${
                          profile.ehcpSupport ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Upgrade to founder or professional to display the EHCP Supported badge on your profile.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── Referral Notes Card — always visible, gated by plan ── */}
        <Card className={`mb-6 border-0 shadow-card ${!hasReferralNotes ? "opacity-60" : ""}`}>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <NotebookPen className="h-4 w-4 text-teal-500" />
              Referral Notes
              {!hasReferralNotes && <Lock className="h-4 w-4 text-muted-foreground" />}
            </CardTitle>
            {!hasReferralNotes ? (
              <Badge variant="outline" className="text-muted-foreground">
                Upgrade to unlock
              </Badge>
            ) : (
              <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-xs">Active</Badge>
            )}
          </CardHeader>
          <CardContent>
            {hasReferralNotes ? (
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Referral notes are active within your message threads. Open any enquiry to add private notes — these
                  are never visible to families.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Upgrade to founder or professional to add private referral notes to your enquiry threads.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Plan Card */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Your Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const claim = getClaimForProvider(providerId);
              const livePlanType = getProvider(providerId)?.plan_type ?? claim?.planType ?? profile.plan_type;
              const planLabel =
                livePlanType === "founder"
                  ? "Founder Plan"
                  : livePlanType === "professional"
                    ? "Professional Plan"
                    : "Free Plan";
              return (
                <>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-teal-500/20 text-teal-400 border-0">{planLabel}</Badge>
                    <Badge className="bg-emerald-500/15 text-emerald-400 border-0">Active</Badge>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {livePlanType === "founder"
                      ? "You're a founding provider on Beyonder. Founder benefits stay with you after launch."
                      : livePlanType === "professional"
                        ? "You're on the Professional plan with full access to all Beyonder features."
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
                    className={`rounded-full px-3 py-1 text-xs border transition-colors ${editFields.needsSupported.includes(need) ? "bg-teal-500/20 border-teal-500/50 text-teal-400" : "border-border/60 text-muted-foreground"}`}
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
    session_types: <FileText className="h-4 w-4 text-teal-500" />,
    availability_dates: <Clock className="h-4 w-4 text-teal-500" />,
    session_capacity: <Users className="h-4 w-4 text-teal-500" />,
    term_programme: <FileText className="h-4 w-4 text-teal-500" />,
    open_days: <Clock className="h-4 w-4 text-orange-400" />,
    ehcp_admissions: <ShieldCheck className="h-4 w-4 text-orange-400" />,
    staff_profiles: <Users className="h-4 w-4 text-teal-500" />,
    events: <Star className="h-4 w-4 text-orange-400" />,
    volunteer_info: <CheckCircle className="h-4 w-4 text-teal-500" />,
  };
  return icons[key] ?? null;
}

function renderSectionContent(
  key: string,
  profile: any,
  moduleProfile: any,
  testimonials: any[],
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
    handleExistingProductImageUpload,
    handleExistingProductDescChange,
    handleNewProductImageUpload,
    productImageErrors,
    newProductImageError,
    existingProductFileRefs,
    newProductFileRef,
    newSessionType,
    setNewSessionType,
    newAvailDate,
    setNewAvailDate,
    newCapacity,
    setNewCapacity,
    newTerm,
    setNewTerm,
    newOpenDay,
    setNewOpenDay,
    ehcpAdmissionsText,
    setEhcpAdmissionsText,
    newStaff,
    setNewStaff,
    newEvent,
    setNewEvent,
    volunteerText,
    setVolunteerText,
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
              const colors =
                opt.value === "accepting"
                  ? {
                      border: isSelected ? "border-emerald-500 bg-emerald-500/10" : "border-border/60",
                      label: "text-emerald-400",
                    }
                  : opt.value === "waitlist"
                    ? {
                        border: isSelected ? "border-orange-400 bg-orange-400/10" : "border-border/60",
                        label: "text-orange-400",
                      }
                    : {
                        border: isSelected ? "border-red-400 bg-red-400/10" : "border-border/60",
                        label: "text-red-400",
                      };
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAvailabilityChange(opt.value)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${colors.border}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-medium text-sm ${isSelected ? colors.label : "text-foreground"}`}>
                      {opt.label}
                    </span>
                    {isSelected && <span className={`text-xs font-semibold ${colors.label}`}>● Active</span>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{opt.description}</p>
                </button>
              );
            })}
          </div>
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
        <div className="space-y-4">
          {(profile.products ?? []).map((p: any, i: number) => {
            const hasImage = p.image && p.image !== "/placeholder.svg";
            return (
              <div key={i} className="rounded-xl border border-border/60 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-sm">{p.name}</span>
                    <span className="text-teal-500 ml-2 text-sm">{p.price}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-400 h-6 px-2 shrink-0"
                    onClick={() => {
                      updateProvider(providerId, {
                        products: profile.products.filter((_: any, idx: number) => idx !== i),
                      });
                      forceUpdate((n: number) => n + 1);
                    }}
                  >
                    ✕
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  {hasImage ? (
                    <div
                      className="relative rounded-lg overflow-hidden bg-muted shrink-0"
                      style={{ width: 64, height: 64 }}
                    >
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-center rounded-lg bg-muted shrink-0 text-muted-foreground/30"
                      style={{ width: 64, height: 64 }}
                    >
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <label
                      htmlFor={`product-img-${i}`}
                      className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-border/60 bg-muted/30 px-3 py-2 hover:bg-muted/50 transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        {hasImage ? "Change image" : "Add image"} · PNG/JPEG · Max 1MB
                      </span>
                      <input
                        id={`product-img-${i}`}
                        type="file"
                        accept="image/png, image/jpeg"
                        className="hidden"
                        ref={(el) => {
                          existingProductFileRefs.current[i] = el;
                        }}
                        onChange={(e) => handleExistingProductImageUpload(i, e)}
                      />
                    </label>
                    {productImageErrors[i] && <p className="text-xs text-red-400">{productImageErrors[i]}</p>}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <textarea
                    value={p.shortDescription ?? ""}
                    onChange={(e) => handleExistingProductDescChange(i, e.target.value)}
                    rows={2}
                    maxLength={120}
                    placeholder="Short description (max 120 characters)..."
                    className="w-full resize-none rounded-lg border border-border/40 bg-muted/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-teal-500/50 transition-colors"
                  />
                  <p className="text-right text-xs text-muted-foreground/50">{(p.shortDescription ?? "").length}/120</p>
                </div>
              </div>
            );
          })}
          <div className="rounded-xl border border-dashed border-border/50 bg-muted/10 p-4 space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Add New Product</p>
            <div className="grid grid-cols-2 gap-2">
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
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {newProduct.image && newProduct.image !== "/placeholder.svg" && (
                  <div
                    className="relative rounded-lg overflow-hidden bg-muted shrink-0"
                    style={{ width: 56, height: 56 }}
                  >
                    <img src={newProduct.image} alt="preview" className="w-full h-full object-cover" />
                    <button
                      className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                      onClick={() => setNewProduct((p: any) => ({ ...p, image: "/placeholder.svg" }))}
                    >
                      ✕
                    </button>
                  </div>
                )}
                <label
                  htmlFor="new-product-img"
                  className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-border/60 bg-muted/30 px-3 py-2 hover:bg-muted/50 transition-colors flex-1"
                >
                  <Upload className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                  <span className="text-xs text-muted-foreground">
                    {newProduct.image && newProduct.image !== "/placeholder.svg" ? "Change image" : "Add product image"}{" "}
                    · PNG/JPEG · Max 1MB
                  </span>
                  <input
                    id="new-product-img"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    ref={newProductFileRef}
                    onChange={handleNewProductImageUpload}
                  />
                </label>
              </div>
              {newProductImageError && <p className="text-xs text-red-400">{newProductImageError}</p>}
            </div>
            <div className="space-y-0.5">
              <textarea
                value={newProduct.shortDescription}
                onChange={(e) => {
                  if (e.target.value.length <= 120)
                    setNewProduct((p: any) => ({ ...p, shortDescription: e.target.value }));
                }}
                rows={2}
                maxLength={120}
                placeholder="Short description (max 120 characters)..."
                className="w-full resize-none rounded-lg border border-border/40 bg-muted/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-teal-500/50 transition-colors"
              />
              <p className="text-right text-xs text-muted-foreground/50">{newProduct.shortDescription.length}/120</p>
            </div>
            <Button
              size="sm"
              className="bg-teal-500 hover:bg-teal-400"
              onClick={() => {
                if (!newProduct.name || !newProduct.price) return;
                updateProvider(providerId, { products: [...(profile.products ?? []), { ...newProduct }] });
                setNewProduct({ name: "", price: "", image: "/placeholder.svg", shortDescription: "" });
                forceUpdate((n: number) => n + 1);
                showSaved();
              }}
            >
              Add Product
            </Button>
          </div>
        </div>
      );

    case "session_types":
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            List the session types you offer so families know what to expect.
          </p>
          {(profile.sessionTypes ?? []).map((s: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm"
            >
              <div className="flex gap-4">
                <span className="font-medium">{s.name}</span>
                <span className="text-muted-foreground">{s.duration}</span>
                <span className="text-teal-500">{s.price}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-400 h-6 px-2"
                onClick={() => {
                  updateProvider(providerId, {
                    sessionTypes: profile.sessionTypes.filter((_: any, idx: number) => idx !== i),
                  });
                  forceUpdate((n: number) => n + 1);
                }}
              >
                ✕
              </Button>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Input
              placeholder="e.g. Initial Assessment"
              value={newSessionType.name}
              onChange={(e) => setNewSessionType((s: any) => ({ ...s, name: e.target.value }))}
            />
            <Input
              placeholder="e.g. 50 mins"
              value={newSessionType.duration}
              onChange={(e) => setNewSessionType((s: any) => ({ ...s, duration: e.target.value }))}
            />
            <Input
              placeholder="e.g. £75"
              value={newSessionType.price}
              onChange={(e) => setNewSessionType((s: any) => ({ ...s, price: e.target.value }))}
            />
          </div>
          <Button
            size="sm"
            className="bg-teal-500 hover:bg-teal-400"
            onClick={() => {
              if (!newSessionType.name || !newSessionType.duration || !newSessionType.price) return;
              updateProvider(providerId, { sessionTypes: [...(profile.sessionTypes ?? []), newSessionType] });
              setNewSessionType({ name: "", duration: "", price: "" });
              forceUpdate((n: number) => n + 1);
              showSaved();
            }}
          >
            Add Session Type
          </Button>
        </div>
      );

    case "availability_dates":
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Add specific dates you have availability so families know when to enquire.
          </p>
          {(profile.availabilityDates ?? []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.availabilityDates.map((d: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-1 rounded-full border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-xs text-teal-400"
                >
                  {new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  <button
                    onClick={() => {
                      updateProvider(providerId, {
                        availabilityDates: profile.availabilityDates.filter((_: any, idx: number) => idx !== i),
                      });
                      forceUpdate((n: number) => n + 1);
                    }}
                    className="ml-1 text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              type="date"
              value={newAvailDate}
              onChange={(e) => setNewAvailDate(e.target.value)}
              className="max-w-[200px]"
            />
            <Button
              size="sm"
              className="bg-teal-500 hover:bg-teal-400"
              disabled={!newAvailDate || (profile.availabilityDates ?? []).includes(newAvailDate)}
              onClick={() => {
                updateProvider(providerId, {
                  availabilityDates: [...(profile.availabilityDates ?? []), newAvailDate].sort(),
                });
                setNewAvailDate("");
                forceUpdate((n: number) => n + 1);
                showSaved();
              }}
            >
              Add Date
            </Button>
          </div>
        </div>
      );

    case "session_capacity":
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Show families how many spaces are available in each session.</p>
          {(profile.sessionCapacity ?? []).map((s: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm"
            >
              <div className="flex gap-4">
                <span className="font-medium">{s.session}</span>
                <span className="text-muted-foreground">Capacity: {s.capacity}</span>
                <span className={parseInt(s.spotsLeft) === 0 ? "text-red-400" : "text-emerald-400"}>
                  {parseInt(s.spotsLeft) === 0 ? "Full" : `${s.spotsLeft} spots left`}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-400 h-6 px-2"
                onClick={() => {
                  updateProvider(providerId, {
                    sessionCapacity: profile.sessionCapacity.filter((_: any, idx: number) => idx !== i),
                  });
                  forceUpdate((n: number) => n + 1);
                }}
              >
                ✕
              </Button>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-2 mt-2">
            <Input
              placeholder="Session name"
              value={newCapacity.session}
              onChange={(e) => setNewCapacity((c: any) => ({ ...c, session: e.target.value }))}
            />
            <Input
              placeholder="Total capacity"
              value={newCapacity.capacity}
              onChange={(e) => setNewCapacity((c: any) => ({ ...c, capacity: e.target.value }))}
            />
            <Input
              placeholder="Spots left"
              value={newCapacity.spotsLeft}
              onChange={(e) => setNewCapacity((c: any) => ({ ...c, spotsLeft: e.target.value }))}
            />
          </div>
          <Button
            size="sm"
            className="bg-teal-500 hover:bg-teal-400"
            onClick={() => {
              if (!newCapacity.session || !newCapacity.capacity || !newCapacity.spotsLeft) return;
              updateProvider(providerId, { sessionCapacity: [...(profile.sessionCapacity ?? []), newCapacity] });
              setNewCapacity({ session: "", capacity: "", spotsLeft: "" });
              forceUpdate((n: number) => n + 1);
              showSaved();
            }}
          >
            Add Session
          </Button>
        </div>
      );

    case "term_programme":
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Share your term-by-term programme so families can plan ahead.</p>
          {(profile.termProgramme ?? []).map((t: any, i: number) => (
            <div key={i} className="rounded-xl border border-border/60 p-4 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{t.term}</p>
                  <p className="text-muted-foreground mt-1 leading-relaxed">{t.details}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 h-6 px-2 shrink-0"
                  onClick={() => {
                    updateProvider(providerId, {
                      termProgramme: profile.termProgramme.filter((_: any, idx: number) => idx !== i),
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
              placeholder="Term name e.g. Autumn Term 2025"
              value={newTerm.term}
              onChange={(e) => setNewTerm((t: any) => ({ ...t, term: e.target.value }))}
            />
            <Textarea
              placeholder="Programme details..."
              rows={3}
              value={newTerm.details}
              onChange={(e) => setNewTerm((t: any) => ({ ...t, details: e.target.value }))}
            />
          </div>
          <Button
            size="sm"
            className="bg-teal-500 hover:bg-teal-400"
            onClick={() => {
              if (!newTerm.term || !newTerm.details) return;
              updateProvider(providerId, { termProgramme: [...(profile.termProgramme ?? []), newTerm] });
              setNewTerm({ term: "", details: "" });
              forceUpdate((n: number) => n + 1);
              showSaved();
            }}
          >
            Add Term
          </Button>
        </div>
      );

    case "open_days":
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Schedule open days so families can come and visit.</p>
          {(profile.openDays ?? []).map((o: any, i: number) => (
            <div key={i} className="rounded-xl border border-border/60 p-4 text-sm space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <p className="font-medium">{o.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.date
                      ? new Date(o.date).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                  {o.description && <p className="text-muted-foreground leading-relaxed">{o.description}</p>}
                  {o.rsvpLink && (
                    <a
                      href={o.rsvpLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 text-xs underline"
                    >
                      RSVP Link
                    </a>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 h-6 px-2 shrink-0"
                  onClick={() => {
                    updateProvider(providerId, {
                      openDays: profile.openDays.filter((_: any, idx: number) => idx !== i),
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
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Event title"
                value={newOpenDay.title}
                onChange={(e) => setNewOpenDay((o: any) => ({ ...o, title: e.target.value }))}
              />
              <Input
                type="date"
                value={newOpenDay.date}
                onChange={(e) => setNewOpenDay((o: any) => ({ ...o, date: e.target.value }))}
              />
            </div>
            <Textarea
              placeholder="Brief description..."
              rows={2}
              value={newOpenDay.description}
              onChange={(e) => setNewOpenDay((o: any) => ({ ...o, description: e.target.value }))}
            />
            <Input
              placeholder="RSVP link (optional)"
              value={newOpenDay.rsvpLink}
              onChange={(e) => setNewOpenDay((o: any) => ({ ...o, rsvpLink: e.target.value }))}
            />
          </div>
          <Button
            size="sm"
            className="bg-teal-500 hover:bg-teal-400"
            onClick={() => {
              if (!newOpenDay.title || !newOpenDay.date) return;
              updateProvider(providerId, { openDays: [...(profile.openDays ?? []), newOpenDay] });
              setNewOpenDay({ title: "", date: "", description: "", rsvpLink: "" });
              forceUpdate((n: number) => n + 1);
              showSaved();
            }}
          >
            Add Open Day
          </Button>
        </div>
      );

    case "ehcp_admissions":
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Share information about your EHCP process and admissions criteria to help families understand how to apply.
          </p>
          <Textarea
            rows={6}
            placeholder="e.g. We welcome children with EHCPs. Our admissions process begins with an informal visit, followed by a formal application to the Local Authority..."
            value={ehcpAdmissionsText}
            onChange={(e) => setEhcpAdmissionsText(e.target.value)}
          />
          <Button
            size="sm"
            className="bg-teal-500 hover:bg-teal-400"
            onClick={() => {
              updateProvider(providerId, { ehcpAdmissionsInfo: ehcpAdmissionsText });
              forceUpdate((n: number) => n + 1);
              showSaved();
            }}
          >
            Save
          </Button>
        </div>
      );

    case "staff_profiles":
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Introduce your team so families can feel confident about who will be supporting their child.
          </p>
          {(profile.staffProfiles ?? []).map((s: any, i: number) => (
            <div key={i} className="rounded-xl border border-border/60 p-4 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-teal-400 mt-0.5">{s.role}</p>
                  <p className="text-muted-foreground mt-1 leading-relaxed">{s.bio}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 h-6 px-2 shrink-0"
                  onClick={() => {
                    updateProvider(providerId, {
                      staffProfiles: profile.staffProfiles.filter((_: any, idx: number) => idx !== i),
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
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Full name"
                value={newStaff.name}
                onChange={(e) => setNewStaff((s: any) => ({ ...s, name: e.target.value }))}
              />
              <Input
                placeholder="Role e.g. SENCO"
                value={newStaff.role}
                onChange={(e) => setNewStaff((s: any) => ({ ...s, role: e.target.value }))}
              />
            </div>
            <Textarea
              placeholder="Short bio..."
              rows={2}
              value={newStaff.bio}
              onChange={(e) => setNewStaff((s: any) => ({ ...s, bio: e.target.value }))}
            />
          </div>
          <Button
            size="sm"
            className="bg-teal-500 hover:bg-teal-400"
            onClick={() => {
              if (!newStaff.name || !newStaff.role) return;
              updateProvider(providerId, { staffProfiles: [...(profile.staffProfiles ?? []), newStaff] });
              setNewStaff({ name: "", role: "", bio: "" });
              forceUpdate((n: number) => n + 1);
              showSaved();
            }}
          >
            Add Staff Member
          </Button>
        </div>
      );

    case "events":
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">List upcoming events so families know how to get involved.</p>
          {(profile.events ?? []).map((ev: any, i: number) => (
            <div key={i} className="rounded-xl border border-border/60 p-4 text-sm space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{ev.title}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${ev.type === "online" ? "border-teal-500/40 text-teal-400" : "border-orange-400/40 text-orange-400"}`}
                    >
                      {ev.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ev.date
                      ? new Date(ev.date).toLocaleDateString("en-GB", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                  {ev.description && <p className="text-muted-foreground leading-relaxed">{ev.description}</p>}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 h-6 px-2 shrink-0"
                  onClick={() => {
                    updateProvider(providerId, { events: profile.events.filter((_: any, idx: number) => idx !== i) });
                    forceUpdate((n: number) => n + 1);
                  }}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent((ev: any) => ({ ...ev, title: e.target.value }))}
              />
              <Input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent((ev: any) => ({ ...ev, date: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setNewEvent((ev: any) => ({ ...ev, type: "in-person" }))}
                className={`rounded-full px-3 py-1 text-xs border transition-colors ${newEvent.type === "in-person" ? "bg-orange-400/15 border-orange-400/50 text-orange-400" : "border-border/60 text-muted-foreground"}`}
              >
                In-person
              </button>
              <button
                type="button"
                onClick={() => setNewEvent((ev: any) => ({ ...ev, type: "online" }))}
                className={`rounded-full px-3 py-1 text-xs border transition-colors ${newEvent.type === "online" ? "bg-teal-500/15 border-teal-500/50 text-teal-400" : "border-border/60 text-muted-foreground"}`}
              >
                Online
              </button>
            </div>
            <Textarea
              placeholder="Event description..."
              rows={2}
              value={newEvent.description}
              onChange={(e) => setNewEvent((ev: any) => ({ ...ev, description: e.target.value }))}
            />
          </div>
          <Button
            size="sm"
            className="bg-teal-500 hover:bg-teal-400"
            onClick={() => {
              if (!newEvent.title || !newEvent.date) return;
              updateProvider(providerId, { events: [...(profile.events ?? []), newEvent] });
              setNewEvent({ title: "", date: "", type: "in-person", description: "" });
              forceUpdate((n: number) => n + 1);
              showSaved();
            }}
          >
            Add Event
          </Button>
        </div>
      );

    case "volunteer_info":
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Tell families how they or their community can volunteer or get involved with your charity.
          </p>
          <Textarea
            rows={6}
            placeholder="e.g. We're always looking for volunteers to help at our weekly sessions. No experience needed — just a passion for supporting children with SEND..."
            value={volunteerText}
            onChange={(e) => setVolunteerText(e.target.value)}
          />
          <Button
            size="sm"
            className="bg-teal-500 hover:bg-teal-400"
            onClick={() => {
              updateProvider(providerId, { volunteerInfo: volunteerText });
              forceUpdate((n: number) => n + 1);
              showSaved();
            }}
          >
            Save
          </Button>
        </div>
      );

    default:
      return <p className="text-sm text-muted-foreground">Coming soon.</p>;
  }
}

export default ProviderDashboard;
