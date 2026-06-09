import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Star, Heart, Upload, Link2, Copy, Check, Download, AlertCircle, X, MessageSquare, Ban } from "lucide-react";
import { reviews } from "@/data/mockData";
import {
  adminSettings,
  getFounderCount,
  updateAdminSettings,
  applyPlanOverride,
  pendingClaims,
  approvePendingClaim,
  rejectPendingClaim,
  PendingClaim,
} from "@/data/founderStore";
import { getAllProviders, updateProvider, importProvider } from "@/data/providerStore";
import { createInviteToken, getInviteStatus, getTokenForProvider, inviteTokens } from "@/data/inviteTokenStore";
import { parseCSV, generateCSVTemplate, ParsedProviderRow } from "@/data/csvImport";
import type { PlanType, PlanStatus, CategoryType } from "@/lib/featureGating";

const mockParents = [
  { id: "p1", name: "Jane Smith", email: "jane@example.com", status: "active" },
  { id: "p2", name: "Mark Johnson", email: "mark@example.com", status: "active" },
];

const defaultStrings: Record<string, string> = {
  heroCta: "Explore Services",
  paywallTitle: "Unlock Provider Responses",
  paywallBody: "To read responses from providers, choose a plan that works for you.",
  emptyEnquiries: "You haven't sent any enquiries yet.",
  confirmationMessage: "Your message has been sent. They'll get back to you soon.",
};

const planTypes: PlanType[] = ["free", "founder", "professional"];
const planStatuses: PlanStatus[] = ["active", "trial", "expired"];
const categoryTypes: CategoryType[] = ["therapist", "club", "education", "charity", "product"];

const AdminPanel = () => {
  const [strings, setStrings] = useState(defaultStrings);
  const [founderLimit, setFounderLimit] = useState(adminSettings.founderLimit);
  const [limitSaved, setLimitSaved] = useState(false);

  const [moderationState, setModerationState] = useState<Record<string, "active" | "suspended">>(
    Object.fromEntries(getAllProviders().map((p) => [p.id, p.moderationStatus])),
  );

  // 1.1 / 1.2 / 1.3 toggle state
  const [verifiedState, setVerifiedState] = useState<Record<string, boolean>>(
    Object.fromEntries(getAllProviders().map((p) => [p.id, p.isVerified])),
  );
  const [featuredState, setFeaturedState] = useState<Record<string, boolean>>(
    Object.fromEntries(getAllProviders().map((p) => [p.id, p.isFeatured])),
  );
  const [ehcpState, setEhcpState] = useState<Record<string, boolean>>(
    Object.fromEntries(getAllProviders().map((p) => [p.id, p.ehcpSupport])),
  );

  const [changeRequestState, setChangeRequestState] = useState<
    Record<string, { status: "idle" | "composing" | "sent" | "acknowledged"; message: string }>
  >(
    Object.fromEntries(
      getAllProviders().map((p) => [
        p.id,
        p.changeRequest
          ? {
              status: p.changeRequest.status === "acknowledged" ? "acknowledged" : "sent",
              message: p.changeRequest.message,
            }
          : { status: "idle", message: "" },
      ]),
    ),
  );

  // ── FIX: seed from providerStore (live in-memory state), not mockData ──
  // mockData is the seeded snapshot; providerStore holds all runtime changes.
  // Seeding from mockData caused plan changes to revert when re-entering admin.
  const [providerPlans, setProviderPlans] = useState<
    Record<string, { planType: string; planStatus: string; categoryType: string }>
  >(
    Object.fromEntries(
      getAllProviders().map((p) => [
        p.id,
        { planType: p.plan_type, planStatus: p.plan_status, categoryType: p.category_type },
      ]),
    ),
  );
  const [savedRows, setSavedRows] = useState<Record<string, boolean>>({});
  const [claimList, setClaimList] = useState<PendingClaim[]>(pendingClaims);
  const [activeTab, setActiveTab] = useState("providers");

  // ── Import & Invites state ──
  const [csvText, setCsvText] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedProviderRow[] | null>(null);
  const [importDone, setImportDone] = useState(false);
  const [importCount, setImportCount] = useState(0);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState<Record<string, string>>({});
  const [inviteState, setInviteState] = useState<Record<string, "idle" | "generated">>({});
  const [generatedLinks, setGeneratedLinks] = useState<Record<string, string>>({});
  const [providerList, setProviderList] = useState(getAllProviders());

  // ── Provider list filters ──
  const [filterSearch, setFilterSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterMessage, setFilterMessage] = useState("all");
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  const handleApproveClaim = (id: string) => {
    approvePendingClaim(id);
    setClaimList([...pendingClaims]);
  };

  const handleRejectClaim = (id: string) => {
    rejectPendingClaim(id);
    setClaimList([...pendingClaims]);
  };

  const founderCount = getFounderCount();
  const slotsLeft = Math.max(0, founderLimit - founderCount);

  const handleSaveFounderLimit = () => {
    updateAdminSettings(founderLimit);
    setLimitSaved(true);
    setTimeout(() => setLimitSaved(false), 2000);
  };

  const handleToggleSuspend = (id: string) => {
    const next = moderationState[id] === "suspended" ? "active" : "suspended";
    updateProvider(id, {
      moderationStatus: next,
      suspendedMessage:
        next === "suspended" ? "Your listing has been suspended by Beyonder. Please contact support." : "",
    });
    setModerationState((prev) => ({ ...prev, [id]: next }));
  };

  // 1.1 — Verification toggle (admin only)
  const handleToggleVerified = (id: string) => {
    const next = !verifiedState[id];
    updateProvider(id, { isVerified: next });
    setVerifiedState((prev) => ({ ...prev, [id]: next }));
  };

  // 1.2 — Featured toggle
  const handleToggleFeatured = (id: string) => {
    const next = !featuredState[id];
    updateProvider(id, { isFeatured: next });
    setFeaturedState((prev) => ({ ...prev, [id]: next }));
  };

  // 1.3 — EHCP toggle (therapist only)
  const handleToggleEhcp = (id: string) => {
    const next = !ehcpState[id];
    updateProvider(id, { ehcpSupport: next });
    setEhcpState((prev) => ({ ...prev, [id]: next }));
  };

  const handleSendChangeRequest = (id: string) => {
    const msg = changeRequestState[id]?.message?.trim();
    if (!msg) return;
    updateProvider(id, { changeRequest: { message: msg, status: "pending" } });
    setChangeRequestState((prev) => ({ ...prev, [id]: { status: "sent", message: msg } }));
  };

  const handleMarkReviewed = (id: string) => {
    updateProvider(id, { changeRequest: null });
    setChangeRequestState((prev) => ({ ...prev, [id]: { status: "idle", message: "" } }));
  };

  const handlePlanChange = (providerId: string, field: string, value: string) => {
    setProviderPlans((prev) => ({
      ...prev,
      [providerId]: { ...prev[providerId], [field]: value },
    }));
    setSavedRows((prev) => ({ ...prev, [providerId]: false }));
  };

  const handleSaveProviderPlan = (providerId: string) => {
    const row = providerPlans[providerId];
    updateProvider(providerId, {
      plan_type: row.planType,
      plan_status: row.planStatus,
      category_type: row.categoryType,
    });
    applyPlanOverride(providerId, row.planType, row.planStatus, row.categoryType);
    setSavedRows((prev) => ({ ...prev, [providerId]: true }));
    setTimeout(() => setSavedRows((prev) => ({ ...prev, [providerId]: false })), 2000);
  };

  const handleInlinePlanChange = (providerId: string, field: "planType" | "planStatus", value: string) => {
    const current = providerPlans[providerId];
    if (!current) return;
    const updated = { ...current, [field]: value };
    setProviderPlans((prev) => ({ ...prev, [providerId]: updated }));
    updateProvider(providerId, { plan_type: updated.planType, plan_status: updated.planStatus, category_type: updated.categoryType });
    applyPlanOverride(providerId, updated.planType, updated.planStatus, updated.categoryType);
  };

  // ── Import handlers ──
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    setImportDone(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setCsvText(text);
      setParsedRows(parseCSV(text));
    };
    reader.readAsText(file);
    // Reset input so the same file can be re-uploaded if needed
    e.target.value = "";
  };

  const handleConfirmImport = () => {
    if (!parsedRows) return;
    const valid = parsedRows.filter((r) => r.errors.length === 0);
    valid.forEach((r) => importProvider(r));
    setImportCount(valid.length);
    setImportDone(true);
    setParsedRows(null);
    setCsvText("");
    setCsvFileName("");
    setProviderList(getAllProviders());
  };

  const handleDownloadTemplate = () => {
    const csv = generateCSVTemplate();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "beyonder_provider_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateInvite = (providerId: string, providerName: string) => {
    const email = inviteEmail[providerId] ?? "";
    const tokenRecord = createInviteToken(providerId, providerName, email);
    const link = `${window.location.origin}/claim?token=${tokenRecord.token}`;
    setGeneratedLinks((prev) => ({ ...prev, [providerId]: link }));
    setInviteState((prev) => ({ ...prev, [providerId]: "generated" }));
  };

  const handleCopyLink = (providerId: string) => {
    const link = generatedLinks[providerId];
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedToken(providerId);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleCopyEmailTemplate = (providerId: string, providerName: string) => {
    const link = generatedLinks[providerId];
    if (!link) return;
    const template = `Hi there,\n\nWe've created a profile for ${providerName} on Beyonder Hub — a directory helping SEND families find trusted local support.\n\nYour listing is ready and waiting for you. Click the link below to claim your profile and start connecting with families who need your services:\n\n${link}\n\nThis link is personal to you and expires in 30 days.\n\nIf you have any questions, just reply to this email — we'd love to help you get set up.\n\nWarm wishes,\nThe Beyonder Team`;
    navigator.clipboard.writeText(template);
    setCopiedToken(`email-${providerId}`);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  const allRegions = useMemo(
    () => [...new Set(getAllProviders().map((p) => p.region).filter(Boolean))].sort() as string[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [providerList],
  );

  const filteredProviders = useMemo(() => {
    const q = filterSearch.toLowerCase();
    return [...getAllProviders()]
      .sort((a, b) => {
        const aA = ["sent", "acknowledged"].includes(changeRequestState[a.id]?.status);
        const bA = ["sent", "acknowledged"].includes(changeRequestState[b.id]?.status);
        if (aA && !bA) return -1;
        if (!aA && bA) return 1;
        return 0;
      })
      .filter((p) => {
        if (q && !p.businessName.toLowerCase().includes(q) && !(p.contactName ?? "").toLowerCase().includes(q)) return false;
        if (filterCategory !== "all" && p.category_type !== filterCategory) return false;
        if (filterRegion !== "all" && p.region !== filterRegion) return false;
        if (filterStatus === "active" && moderationState[p.id] === "suspended") return false;
        if (filterStatus === "suspended" && moderationState[p.id] !== "suspended") return false;
        if (filterPlan !== "all" && providerPlans[p.id]?.planType !== filterPlan) return false;
        if (filterMessage === "pending" && !["sent", "acknowledged"].includes(changeRequestState[p.id]?.status)) return false;
        return true;
      });
  }, [providerList, filterSearch, filterCategory, filterRegion, filterStatus, filterPlan, filterMessage, moderationState, changeRequestState, providerPlans]);

  return (
    <div className="bg-background min-h-screen">
      <PageBanner title="Admin panel" />
      <div className="container animate-fade-in py-10">


        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Mobile: dropdown selector */}
          <div className="md:hidden mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="providers">Providers</SelectItem>
                <SelectItem value="parents">Parents</SelectItem>
                <SelectItem value="reviews">Reviews</SelectItem>
                <SelectItem value="founder">Founder Settings</SelectItem>
                <SelectItem value="claims">
                  Claim Requests{claimList.filter((c) => c.status === "pending_review").length > 0
                    ? ` (${claimList.filter((c) => c.status === "pending_review").length})`
                    : ""}
                </SelectItem>
                <SelectItem value="content">Content Strings</SelectItem>
                <SelectItem value="import">Import & Invites</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop: tab bar */}
          <TabsList className="bg-muted border-0 hidden md:flex flex-wrap h-auto gap-1">
            <TabsTrigger
              value="providers"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-primary-foreground"
            >
              Providers
            </TabsTrigger>
            <TabsTrigger
              value="parents"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-primary-foreground"
            >
              Parents
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-primary-foreground"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="founder"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-primary-foreground"
            >
              Founder Settings
            </TabsTrigger>
            <TabsTrigger
              value="claims"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-primary-foreground"
            >
              Claim Requests{" "}
              {claimList.filter((c) => c.status === "pending_review").length > 0 && (
                <span className="ml-1 rounded-full bg-orange-500 px-1.5 py-0.5 text-xs text-white">
                  {claimList.filter((c) => c.status === "pending_review").length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-primary-foreground"
            >
              Content Strings
            </TabsTrigger>
            <TabsTrigger
              value="import"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-primary-foreground"
            >
              Import & Invites
            </TabsTrigger>
          </TabsList>

          {/* ── Providers ── */}
          <TabsContent value="providers" className="mt-6 space-y-3">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <Input
                placeholder="Search name or contact…"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                className="h-8 text-xs w-full sm:w-48"
              />
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all">All categories</SelectItem>
                  {categoryTypes.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="h-8 text-xs w-40"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all">All regions</SelectItem>
                  {allRegions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPlan} onValueChange={setFilterPlan}>
                <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all">All plans</SelectItem>
                  {planTypes.map((pt) => <SelectItem key={pt} value={pt} className="capitalize">{pt}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterMessage} onValueChange={setFilterMessage}>
                <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all">All messages</SelectItem>
                  <SelectItem value="pending">Pending message</SelectItem>
                </SelectContent>
              </Select>
              <span className="ml-auto text-xs text-muted-foreground">
                {filteredProviders.length} / {getAllProviders().length}
              </span>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "72vh" }}>
                <table className="w-full text-sm" style={{ minWidth: 960 }}>
                  <thead className="sticky top-0 z-10 bg-card border-b border-border/60">
                    <tr className="text-xs text-muted-foreground">
                      <th className="py-2 px-3 text-left font-medium">Business</th>
                      <th className="py-2 px-3 text-left font-medium w-24">Category</th>
                      <th className="py-2 px-3 text-left font-medium w-28">Region</th>
                      <th className="py-2 px-3 text-left font-medium w-28">Plan</th>
                      <th className="py-2 px-3 text-left font-medium w-24">P. Status</th>
                      <th className="py-2 px-3 text-left font-medium w-24">Status</th>
                      <th className="py-2 px-3 text-left font-medium w-28">Contact</th>
                      <th className="py-2 px-3 text-left font-medium w-44">Contact Info</th>
                      <th className="py-2 px-3 text-left font-medium w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredProviders.map((p) => {
                      const isSuspended = moderationState[p.id] === "suspended";
                      const cr = changeRequestState[p.id];
                      const isSent = cr?.status === "sent";
                      const isAcknowledged = cr?.status === "acknowledged";
                      const hasActiveRequest = isSent || isAcknowledged;
                      const isTherapist = p.category_type === "therapist";
                      const plan = providerPlans[p.id];
                      const isExpanded = expandedMessage === p.id;

                      return (
                        <React.Fragment key={p.id}>
                          <tr className={`hover:bg-muted/20 transition-colors ${hasActiveRequest ? "bg-orange-500/[0.03]" : ""}`}>
                            {/* Business Name */}
                            <td className="py-2 px-3 max-w-[180px]">
                              <div className="flex items-center gap-1.5">
                                <Link
                                  to={`/providers/${p.id}`}
                                  className="font-medium hover:text-teal-400 transition-colors truncate max-w-[140px] block"
                                  title={p.businessName}
                                >
                                  {p.businessName}
                                </Link>
                                {verifiedState[p.id] && <ShieldCheck className="h-3 w-3 text-teal-400 shrink-0" />}
                                {featuredState[p.id] && <Star className="h-3 w-3 text-orange-400 shrink-0" />}
                                {hasActiveRequest && <MessageSquare className="h-3 w-3 text-orange-400 shrink-0" />}
                              </div>
                            </td>
                            {/* Category */}
                            <td className="py-2 px-3">
                              <Badge className="bg-muted text-foreground border-0 text-xs capitalize">{p.category_type}</Badge>
                            </td>
                            {/* Region */}
                            <td className="py-2 px-3 text-xs text-muted-foreground">{p.region || "—"}</td>
                            {/* Plan type */}
                            <td className="py-2 px-3">
                              {plan && (
                                <Select value={plan.planType} onValueChange={(v) => handleInlinePlanChange(p.id, "planType", v)}>
                                  <SelectTrigger className="h-7 text-xs w-[100px] px-2 border-border/40">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-card">
                                    {planTypes.map((pt) => (
                                      <SelectItem key={pt} value={pt} className="text-xs capitalize">{pt}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </td>
                            {/* Plan status */}
                            <td className="py-2 px-3">
                              {plan && (
                                <Select value={plan.planStatus} onValueChange={(v) => handleInlinePlanChange(p.id, "planStatus", v)}>
                                  <SelectTrigger className="h-7 text-xs w-[88px] px-2 border-border/40">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-card">
                                    {planStatuses.map((ps) => (
                                      <SelectItem key={ps} value={ps} className="text-xs capitalize">{ps}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </td>
                            {/* Status */}
                            <td className="py-2 px-3">
                              {isSuspended
                                ? <Badge className="bg-red-500/15 text-red-400 border-0 text-xs">Suspended</Badge>
                                : <Badge className="bg-emerald-500/15 text-emerald-600 border-0 text-xs">Active</Badge>}
                            </td>
                            {/* Contact name */}
                            <td className="py-2 px-3 text-xs text-muted-foreground">{p.contactName || "—"}</td>
                            {/* Contact links */}
                            <td className="py-2 px-3 text-xs text-muted-foreground max-w-[176px]">
                              <span className="truncate block" title={p.contactLinks || ""}>{p.contactLinks || "—"}</span>
                            </td>
                            {/* Actions */}
                            <td className="py-2 px-3">
                              <div className="flex items-center gap-0.5">
                                <Button
                                  size="sm" variant="ghost"
                                  className={`h-7 w-7 p-0 ${verifiedState[p.id] ? "text-teal-400" : "text-muted-foreground hover:text-foreground"}`}
                                  title={verifiedState[p.id] ? "Unverify" : "Verify"}
                                  onClick={() => handleToggleVerified(p.id)}
                                >
                                  <ShieldCheck className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="sm" variant="ghost"
                                  className={`h-7 w-7 p-0 ${featuredState[p.id] ? "text-orange-400" : "text-muted-foreground hover:text-foreground"}`}
                                  title={featuredState[p.id] ? "Unfeature" : "Feature"}
                                  onClick={() => handleToggleFeatured(p.id)}
                                >
                                  <Star className="h-3.5 w-3.5" />
                                </Button>
                                {isTherapist && (
                                  <Button
                                    size="sm" variant="ghost"
                                    className={`h-7 w-7 p-0 ${ehcpState[p.id] ? "text-orange-400" : "text-muted-foreground hover:text-foreground"}`}
                                    title={ehcpState[p.id] ? "Remove EHCP" : "Add EHCP"}
                                    onClick={() => handleToggleEhcp(p.id)}
                                  >
                                    <Heart className="h-3.5 w-3.5" />
                                  </Button>
                                )}
                                <Button
                                  size="sm" variant="ghost"
                                  className={`h-7 w-7 p-0 ${hasActiveRequest || isExpanded ? "text-orange-400" : "text-muted-foreground hover:text-foreground"}`}
                                  title="Message provider"
                                  onClick={() => setExpandedMessage(isExpanded ? null : p.id)}
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="sm" variant="ghost"
                                  className={`h-7 w-7 p-0 ${isSuspended ? "text-teal-400" : "text-red-400 hover:text-red-300"}`}
                                  title={isSuspended ? "Reinstate" : "Suspend"}
                                  onClick={() => handleToggleSuspend(p.id)}
                                >
                                  <Ban className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {/* Expanded message row */}
                          {isExpanded && (
                            <tr className="bg-muted/30">
                              <td colSpan={9} className="px-4 py-3">
                                <div className="space-y-2 max-w-lg">
                                  {(isSent || isAcknowledged) && (
                                    <div className="flex items-start gap-3 rounded-lg border border-orange-500/20 bg-orange-500/[0.08] px-3 py-2 text-xs text-orange-300">
                                      <span className="flex-1"><span className="font-medium text-orange-400">Sent: </span>{cr.message}</span>
                                      {isAcknowledged && (
                                        <Button size="sm" className="h-6 text-xs shrink-0 bg-teal-500 hover:bg-teal-400" onClick={() => handleMarkReviewed(p.id)}>
                                          Mark Reviewed
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                  {!hasActiveRequest && (
                                    <div className="flex gap-2">
                                      <Textarea
                                        rows={2}
                                        placeholder="Type a message to this provider…"
                                        value={cr?.message ?? ""}
                                        onChange={(e) =>
                                          setChangeRequestState((prev) => ({
                                            ...prev,
                                            [p.id]: { status: "composing", message: e.target.value },
                                          }))
                                        }
                                        className="text-xs resize-none"
                                      />
                                      <Button
                                        size="sm"
                                        className="bg-orange-500 hover:bg-orange-400 self-end shrink-0"
                                        disabled={!cr?.message?.trim()}
                                        onClick={() => handleSendChangeRequest(p.id)}
                                      >
                                        Send
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* ── Parents ── */}
          <TabsContent value="parents" className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Parent Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockParents.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/60 p-4 gap-3"
                    >
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm text-muted-foreground">{p.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-emerald-500/15 text-emerald-600 border-0 text-xs">{p.status}</Badge>
                        <Button size="sm" variant="destructive">
                          Suspend
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Reviews ── */}
          <TabsContent value="reviews" className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Review Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/60 p-4 gap-3"
                    >
                      <div>
                        <p className="font-medium">
                          {r.authorName} — <span className="text-orange-400">{r.rating}★</span>
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{r.text}</p>
                      </div>
                      <Button size="sm" variant="destructive">
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Founder Settings ── */}
          <TabsContent value="founder" className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Founder Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <Label>Founder Limit</Label>
                    <Input
                      type="number"
                      value={founderLimit}
                      onChange={(e) => setFounderLimit(Number(e.target.value))}
                      min={0}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Max number of founding providers</p>
                  </div>
                  <div>
                    <Label>Current Founder Count</Label>
                    <Input value={founderCount} readOnly className="bg-muted cursor-not-allowed" />
                    <p className="mt-1 text-xs text-muted-foreground">Active founder plans claimed</p>
                  </div>
                  <div>
                    <Label>Remaining Slots</Label>
                    <Input
                      value={Math.max(0, founderLimit - founderCount)}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                      style={{ color: slotsLeft === 0 ? "#c87060" : undefined }}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Available for new claims</p>
                  </div>
                </div>
                <Button className="bg-teal-500 hover:bg-teal-400" onClick={handleSaveFounderLimit}>
                  {limitSaved ? "Saved ✓" : "Save Founder Limit"}
                </Button>
                <div className="rounded-xl border border-border/60 p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">How founder assignment works</p>
                  <p>
                    When a provider claims a listing, the system checks the current founder count against this limit. If
                    slots remain, the provider is automatically assigned Founder plan. Once full, new claims receive the
                    Free plan. Admins can override individual plans in the Plans & Categories tab.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Claim Requests ── */}
          <TabsContent value="claims" className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Provider Claim Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {claimList.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No claim requests yet.</p>
                ) : (
                  <div className="space-y-3">
                    {claimList.map((claim) => (
                      <div key={claim.id} className="rounded-xl border border-border/60 p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="space-y-1">
                            <p className="font-medium">{claim.providerName}</p>
                            <p className="text-sm text-muted-foreground">
                              <span className="text-foreground/60">Claiming email:</span> {claim.claimantEmail}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="text-foreground/60">Listing domain:</span>{" "}
                              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                {claim.websiteDomain}
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="text-foreground/60">Email domain:</span>{" "}
                              <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                                {claim.claimantDomain}
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">Submitted: {claim.submittedAt}</p>
                          </div>
                          <Badge
                            className={
                              claim.status === "pending_review"
                                ? "bg-orange-500/15 text-orange-400 border-0 shrink-0"
                                : claim.status === "approved"
                                  ? "bg-emerald-500/15 text-emerald-400 border-0 shrink-0"
                                  : "bg-red-500/15 text-red-400 border-0 shrink-0"
                            }
                          >
                            {claim.status === "pending_review"
                              ? "Pending"
                              : claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                          </Badge>
                        </div>
                        {claim.status === "pending_review" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-teal-500 hover:bg-teal-400"
                              onClick={() => handleApproveClaim(claim.id)}
                            >
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRejectClaim(claim.id)}>
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Content Strings ── */}
          <TabsContent value="content" className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Content Strings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(strings).map(([key, value]) => (
                  <div key={key}>
                    <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                    {value.length > 60 ? (
                      <Textarea value={value} onChange={(e) => setStrings((s) => ({ ...s, [key]: e.target.value }))} />
                    ) : (
                      <Input value={value} onChange={(e) => setStrings((s) => ({ ...s, [key]: e.target.value }))} />
                    )}
                  </div>
                ))}
                <Button className="bg-teal-500 hover:bg-teal-400">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          {/* ── Import & Invites ── */}
          <TabsContent value="import" className="mt-6 space-y-6">

            {/* CSV Import */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-teal-400" /> Bulk Import Providers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <Button variant="outline" className="gap-2 shrink-0" onClick={handleDownloadTemplate}>
                    <Download className="h-4 w-4" /> Download CSV Template
                  </Button>
                  <p className="text-sm text-muted-foreground self-center">
                    Fill in the template in Excel or Google Sheets, save as CSV, then upload below.
                  </p>
                </div>

                {/* File upload zone */}
                <label
                  htmlFor="csv-file-input"
                  className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/60 hover:border-teal-500/50 hover:bg-teal-500/[0.03] transition-colors cursor-pointer p-8 text-center"
                >
                  <Upload className="h-8 w-8 text-muted-foreground/50" />
                  {csvFileName ? (
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground">{csvFileName}</p>
                      <p className="text-xs text-muted-foreground">Click to upload a different file</p>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground">Click to upload your CSV</p>
                      <p className="text-xs text-muted-foreground">Saved from Excel or Google Sheets as .csv</p>
                    </div>
                  )}
                  <input
                    id="csv-file-input"
                    type="file"
                    accept=".csv,text/csv"
                    className="sr-only"
                    onChange={handleFileUpload}
                  />
                </label>

                {importDone && (
                  <div className="flex items-center gap-2 rounded-lg bg-teal-500/10 border border-teal-500/20 px-4 py-3 text-sm text-teal-400">
                    <Check className="h-4 w-4 shrink-0" />
                    {importCount} provider{importCount !== 1 ? "s" : ""} imported successfully. They are in Draft status.
                  </div>
                )}

                {parsedRows && parsedRows.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {parsedRows.length} row{parsedRows.length !== 1 ? "s" : ""} found —{" "}
                        <span className="text-teal-400">{parsedRows.filter((r) => r.errors.length === 0).length} valid</span>
                        {parsedRows.some((r) => r.errors.length > 0) && (
                          <span className="text-red-400 ml-1">
                            · {parsedRows.filter((r) => r.errors.length > 0).length} with errors
                          </span>
                        )}
                      </p>
                      <Button
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-400"
                        disabled={parsedRows.filter((r) => r.errors.length === 0).length === 0}
                        onClick={handleConfirmImport}
                      >
                        Confirm Import ({parsedRows.filter((r) => r.errors.length === 0).length} valid)
                      </Button>
                    </div>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {parsedRows.map((row, i) => (
                        <div
                          key={i}
                          className={`rounded-lg border px-4 py-3 text-sm ${
                            row.errors.length > 0
                              ? "border-red-500/30 bg-red-500/5"
                              : "border-teal-500/20 bg-teal-500/5"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-medium">{row.businessName || `Row ${i + 2}`}</span>
                            <div className="flex gap-1.5 flex-wrap">
                              {row.category_type && (
                                <Badge className="bg-muted text-foreground border-0 text-xs">{row.category_type}</Badge>
                              )}
                              {row.region && (
                                <Badge className="bg-muted text-foreground border-0 text-xs">{row.region}</Badge>
                              )}
                              {row.errors.length === 0 ? (
                                <Badge className="bg-teal-500/15 text-teal-400 border-0 text-xs gap-1">
                                  <Check className="h-3 w-3" /> Valid
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500/15 text-red-400 border-0 text-xs gap-1">
                                  <AlertCircle className="h-3 w-3" /> {row.errors.length} error{row.errors.length !== 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {/* Contact method summary */}
                          {(row.contactMethodType !== "unknown" || row.contactLinks) && (
                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                              {row.contactMethodType && row.contactMethodType !== "unknown" && (
                                <span className="capitalize text-foreground/60">{row.contactMethodType.replace("_", " ")}</span>
                              )}
                              {row.contactLinks && <span className="text-foreground/50">{row.contactLinks}</span>}
                            </div>
                          )}
                          {row.errors.length > 0 && (
                            <ul className="mt-2 space-y-0.5">
                              {row.errors.map((err, j) => (
                                <li key={j} className="text-xs text-red-400 flex items-start gap-1.5">
                                  <X className="h-3 w-3 shrink-0 mt-0.5" /> {err}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invite Links */}
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-teal-400" /> Provider Invite Links
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Generate a personalised invite link for each provider. The link auto-approves their profile claim — no domain verification needed.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {providerList.map((p) => {
                    const status = getInviteStatus(p.id);
                    const tokenRecord = getTokenForProvider(p.id);
                    const isGenerated = inviteState[p.id] === "generated";
                    const link = generatedLinks[p.id];

                    return (
                      <div key={p.id} className="rounded-xl border border-border/60 p-4 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-medium">{p.businessName}</p>
                            <p className="text-xs text-muted-foreground">{p.typeBadge} · {p.location}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Claim/invite status badge */}
                            {status === "none" && (
                              <Badge className="bg-muted text-muted-foreground border-0 text-xs">No invite sent</Badge>
                            )}
                            {status === "pending" && tokenRecord && (
                              <Badge className="bg-orange-500/15 text-orange-400 border-0 text-xs">
                                Invited · {new Date(tokenRecord.createdAt).toLocaleDateString("en-GB")}
                              </Badge>
                            )}
                            {status === "claimed" && tokenRecord && (
                              <Badge className="bg-teal-500/15 text-teal-400 border-0 text-xs">
                                Claimed · {tokenRecord.claimedAt ? new Date(tokenRecord.claimedAt).toLocaleDateString("en-GB") : ""}
                              </Badge>
                            )}
                            {status === "expired" && (
                              <Badge className="bg-red-500/15 text-red-400 border-0 text-xs">Expired</Badge>
                            )}
                          </div>
                        </div>

                        {!isGenerated ? (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                              placeholder="Provider email address (optional)"
                              value={inviteEmail[p.id] ?? ""}
                              onChange={(e) => setInviteEmail((prev) => ({ ...prev, [p.id]: e.target.value }))}
                              className="text-sm"
                            />
                            <Button
                              size="sm"
                              className="bg-teal-500 hover:bg-teal-400 shrink-0"
                              onClick={() => handleGenerateInvite(p.id, p.businessName)}
                            >
                              <Link2 className="h-3.5 w-3.5 mr-1.5" />
                              Generate Link
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                              <code className="text-xs flex-1 truncate text-teal-400">{link}</code>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="shrink-0 h-7 px-2"
                                onClick={() => handleCopyLink(p.id)}
                              >
                                {copiedToken === p.id ? (
                                  <Check className="h-3.5 w-3.5 text-teal-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-xs"
                                onClick={() => handleCopyEmailTemplate(p.id, p.businessName)}
                              >
                                {copiedToken === `email-${p.id}` ? (
                                  <><Check className="h-3 w-3 text-teal-400" /> Copied!</>
                                ) : (
                                  <><Copy className="h-3 w-3" /> Copy email template</>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs text-muted-foreground"
                                onClick={() => {
                                  setInviteState((prev) => ({ ...prev, [p.id]: "idle" }));
                                  setGeneratedLinks((prev) => { const n = {...prev}; delete n[p.id]; return n; });
                                }}
                              >
                                Generate new link
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
