import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Star,
  ShieldCheck,
  Award,
  Clock,
  Mail,
  Phone,
  Globe,
  AlertTriangle,
  CheckCircle,
  Clock3,
  XCircle,
  ShoppingBag,
  Heart,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { reviews } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { attemptClaim, isProviderClaimed } from "@/data/founderStore";
import { getProvider } from "@/data/providerStore";
import { hasFeature } from "@/lib/featureGating";
import type { AvailabilityStatus } from "@/data/providerStore";

const availabilityConfig: Record<
  AvailabilityStatus,
  { label: string; message: string; icon: React.ReactNode; bg: string; border: string; text: string; iconColor: string }
> = {
  accepting: {
    label: "Accepting New Clients",
    message: "This provider is currently taking new referrals. Send an enquiry to get started.",
    icon: <CheckCircle className="h-6 w-6" />,
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.30)",
    text: "#34d399",
    iconColor: "#34d399",
  },
  waitlist: {
    label: "Waitlist Only",
    message: "This provider isn't taking new clients right now but you can join their waitlist by sending an enquiry.",
    icon: <Clock3 className="h-6 w-6" />,
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.30)",
    text: "#fb923c",
    iconColor: "#fb923c",
  },
  closed: {
    label: "Not Accepting Clients",
    message: "This provider is currently closed to new enquiries. Check back later or explore other providers.",
    icon: <XCircle className="h-6 w-6" />,
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.30)",
    text: "#f87171",
    iconColor: "#f87171",
  },
};

const ProviderPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // Track which events are expanded
  const [expandedEvents, setExpandedEvents] = useState<Record<number, boolean>>({});
  const toggleEvent = (i: number) => setExpandedEvents((prev) => ({ ...prev, [i]: !prev[i] }));

  // Claim blocked state — shown when a logged-in user tries to claim
  const [claimBlocked, setClaimBlocked] = useState(false);

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
  const isClub = provider.category_type === "club";
  const isEducation = provider.category_type === "education";
  const isCharity = provider.category_type === "charity";
  const availStatus = provider.availabilityStatus ?? "accepting";
  const availInfo = availabilityConfig[availStatus];

  // ── Plan gate — paid features only show publicly when provider is on a paid plan ──
  const planGate = { plan_type: provider.plan_type as any, plan_status: provider.plan_status as any };
  const canShow = (featureKey: string) => hasFeature(planGate, featureKey as any);

  const handleClaim = () => {
    // Any logged-in user (parent, provider, or admin) — block with inline message
    if (isAuthenticated) {
      setClaimBlocked(true);
      return;
    }
    // Logged-out user — send to signup/claim flow as before
    navigate(`/for-providers?claimProviderId=${provider.id}`);
  };

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="bg-navy-gradient py-12">
        <div className="container animate-fade-in">
          {isSuspended && (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/25 bg-red-500/08 p-4 mb-6">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-400">This listing is currently unavailable.</p>
            </div>
          )}

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-navy-600 text-accent-foreground border-0">
                  {provider.typeBadge}
                </Badge>
                <Badge className="bg-teal-500/20 text-teal-400 border-0 capitalize">{provider.plan_type}</Badge>
                {provider.isVerified && (
                  <Badge className="bg-teal-500/20 text-teal-400 border-0 gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified Provider
                  </Badge>
                )}
                {isTherapist && provider.ehcpSupport && (
                  <Badge className="bg-orange-500/15 text-orange-400 border-0 gap-1">
                    <Heart className="h-3.5 w-3.5" /> EHCP Supported
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
                {provider.foundingProvider && (
                  <span className="flex items-center gap-1 text-orange-300">
                    <Award className="h-4 w-4" /> Founding Provider
                  </span>
                )}
              </div>

              {/* Availability banner — therapists only */}
              {isTherapist && !isSuspended && (
                <div
                  className="mt-5 flex items-center gap-4 rounded-xl px-5 py-4"
                  style={{ background: availInfo.bg, border: `1.5px solid ${availInfo.border}` }}
                >
                  <span style={{ color: availInfo.iconColor, flexShrink: 0 }}>{availInfo.icon}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: availInfo.text }}>
                      {availInfo.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>
                      {availInfo.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Claim this profile — hidden once claimed or suspended */}
              {!alreadyClaimed && !isSuspended && (
                <div className="mt-4">
                  {claimBlocked ? (
                    <div className="rounded-xl border border-orange-500/25 bg-orange-500/[0.08] px-4 py-3 max-w-sm">
                      <p className="text-sm font-semibold text-orange-400">Account already exists</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        You're currently logged in. To claim a profile, please use a new provider account linked to your
                        organisation's email address.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
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
              )}
            </div>

            {!isSuspended && (
              <Button size="lg" className="bg-teal-500 hover:bg-teal-400 shadow-lg shrink-0" asChild>
                <Link to={`/enquiry/${provider.id}`}>Send Enquiry</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="container mt-10 grid gap-8 lg:grid-cols-3">
        {/* ── Main column ── */}
        <div className="space-y-6 lg:col-span-2">
          {/* Overview — always visible */}
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

          {/* Spotlight — paid */}
          {canShow("spotlight") && provider.spotlightMessage && (
            <Card className="border-0 shadow-card border-l-4 border-l-teal-500">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-teal-500 mb-2">From the team</p>
                <p className="text-muted-foreground leading-relaxed">{provider.spotlightMessage}</p>
              </CardContent>
            </Card>
          )}

          {/* 3.1 Session Types — therapist, paid */}
          {isTherapist && canShow("session_types") && provider.sessionTypes && provider.sessionTypes.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Session Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {provider.sessionTypes.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm"
                    >
                      <span className="font-medium">{s.name}</span>
                      <div className="flex gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {s.duration}
                        </span>
                        <span className="text-teal-500 font-medium">{s.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3.2 Availability Dates — therapist, paid */}
          {isTherapist &&
            canShow("availability_dates") &&
            provider.availabilityDates &&
            provider.availabilityDates.length > 0 && (
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Available Dates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {provider.availabilityDates.map((d, i) => (
                      <Badge key={i} className="bg-teal-500/10 text-teal-400 border border-teal-500/30 gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Credentials — paid */}
          {canShow("certifications") && provider.credentials && provider.credentials.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Credentials & Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {provider.credentials.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-sm">
                      <ShieldCheck className="h-4 w-4 text-teal-500 shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Timetable — paid */}
          {canShow("timetable") && provider.timetable && provider.timetable.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Timetable</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {provider.timetable.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-teal-500 shrink-0" />
                      <span className="font-medium w-24">{t.day}</span>
                      <span className="text-muted-foreground">{t.time}</span>
                      <span>{t.activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4.1 Session Capacity — club, paid */}
          {isClub && canShow("session_capacity") && provider.sessionCapacity && provider.sessionCapacity.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Session Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {provider.sessionCapacity.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm"
                    >
                      <span className="font-medium">{s.session}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" /> {s.capacity} total
                        </span>
                        <span
                          className={`font-medium ${parseInt(s.spotsLeft) === 0 ? "text-red-400" : "text-emerald-400"}`}
                        >
                          {parseInt(s.spotsLeft) === 0 ? "Full" : `${s.spotsLeft} spots left`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4.2 / 5.x Term Programme — club + education, paid */}
          {(isClub || isEducation) &&
            canShow("term_programme") &&
            provider.termProgramme &&
            provider.termProgramme.length > 0 && (
              <Card className="border-0 shadow-card">
                <CardHeader>
                  <CardTitle>Term Programme</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {provider.termProgramme.map((t, i) => (
                    <div key={i} className="border-l-2 border-teal-500 pl-4">
                      <p className="font-medium text-sm">{t.term}</p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{t.details}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

          {/* 5.1 Open Days — education, paid */}
          {isEducation && canShow("open_days") && provider.openDays && provider.openDays.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Open Days</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {provider.openDays.map((o, i) => (
                  <div key={i} className="rounded-xl border border-border/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{o.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Calendar className="h-3 w-3 shrink-0" />
                          {o.date
                            ? new Date(o.date).toLocaleDateString("en-GB", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : ""}
                        </p>
                        {o.description && (
                          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{o.description}</p>
                        )}
                      </div>
                      {o.rsvpLink && (
                        <a
                          href={o.rsvpLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-lg bg-teal-500/10 border border-teal-500/30 px-3 py-1.5 text.xs text-teal-400 hover:bg-teal-500/20 transition-colors"
                        >
                          RSVP
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 5.2 EHCP & Admissions — education, paid */}
          {isEducation && canShow("ehcp_admissions") && provider.ehcpAdmissionsInfo && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-orange-400" /> EHCP & Admissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {provider.ehcpAdmissionsInfo}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 5.3 Staff Profiles — education, paid */}
          {isEducation && canShow("staff_profiles") && provider.staffProfiles && provider.staffProfiles.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-teal-500" /> Our Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.staffProfiles.map((s, i) => (
                  <div key={i} className="flex gap-4 rounded-xl border border-border/60 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500/15 text-teal-400 font-semibold text-sm">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-teal-400 mt-0.5">{s.role}</p>
                      {s.bio && (
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed break-words">{s.bio}</p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Case Studies — paid */}
          {canShow("case_studies") && provider.caseStudies && provider.caseStudies.length > 0 && (
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

          {/* Gallery — paid */}
          {canShow("gallery") && provider.gallery && provider.gallery.length > 0 && (
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

          {/* 6.1 Events — charity, paid. Collapsed list, click to expand */}
          {isCharity && canShow("events") && provider.events && provider.events.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-400" /> Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {provider.events.map((ev, i) => {
                  const isOpen = !!expandedEvents[i];
                  return (
                    <div key={i} className="rounded-xl border border-border/60 overflow-hidden">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/10 transition-colors"
                        onClick={() => toggleEvent(i)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`shrink-0 text-xs px-2 py-0.5 rounded-full border ${ev.type === "online" ? "border-teal-500/40 text-teal-400" : "border-orange-400/40 text-orange-400"}`}
                          >
                            {ev.type}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{ev.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {ev.date
                                ? new Date(ev.date).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : ""}
                            </p>
                          </div>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </button>
                      {isOpen && ev.description && (
                        <div className="px-4 pb-4 pt-1 border-t border-border/40">
                          <p className="text-sm text-muted-foreground leading-relaxed">{ev.description}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* 6.2 Volunteer Info — charity, paid */}
          {isCharity && canShow("volunteer_info") && provider.volunteerInfo && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-orange-400" /> Volunteering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {provider.volunteerInfo}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Products — paid */}
          {canShow("products") && provider.products && provider.products.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {provider.products.map((p, i) => {
                    const hasImage = p.image && p.image !== "/placeholder.svg";
                    return (
                      <div key={i} className="rounded-xl border border-border/60 overflow-hidden card-hover-lift">
                        <div className="bg-muted" style={{ aspectRatio: "4/3" }}>
                          {hasImage ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <div className="p-3 text-center space-y-1">
                          <p className="text-sm font-medium leading-snug">{p.name}</p>
                          {p.shortDescription && (
                            <p className="text-xs text-muted-foreground leading-relaxed">{p.shortDescription}</p>
                          )}
                          <p className="text-sm text-teal-500 font-semibold">{p.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews — always visible */}
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

        {/* ── Sidebar ── */}
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
                  <Mail className="h-4 w-4 text-teal-500 shrink-0" />
                  <span>{provider.email}</span>
                </div>
              )}
              {provider.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-teal-500 shrink-0" />
                  <span>{provider.phone}</span>
                </div>
              )}
              {provider.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-teal-500 shrink-0" />
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline break-all"
                  >
                    {provider.website}
                  </a>
                </div>
              )}
              {canShow("store_link") && provider.storeUrl && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-teal-500 shrink-0" />
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

          {/* Sidebar: Next open day — education, paid */}
          {isEducation && canShow("open_days") && provider.openDays && provider.openDays.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardContent className="p-4 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Next Open Day</p>
                <p className="text-sm font-medium">{provider.openDays[0].title}</p>
                <p className="text-xs text-teal-400">
                  {provider.openDays[0].date
                    ? new Date(provider.openDays[0].date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : ""}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Sidebar: Staff count — education, paid */}
          {isEducation && canShow("staff_profiles") && provider.staffProfiles && provider.staffProfiles.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <Users className="h-5 w-5 text-teal-500 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{provider.staffProfiles.length}</span> staff member
                  {provider.staffProfiles.length !== 1 ? "s" : ""} listed
                </p>
              </CardContent>
            </Card>
          )}

          {/* Sidebar: Event count — charity, paid */}
          {isCharity && canShow("events") && provider.events && provider.events.length > 0 && (
            <Card className="border-0 shadow-card">
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-orange-400 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{provider.events.length}</span> upcoming event
                  {provider.events.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          )}
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
