import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { providers, reviews } from "@/data/mockData";
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
import { getAllProviders, updateProvider } from "@/data/providerStore";
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

// ── Simplified to 3 plans only ──
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

  const [providerPlans, setProviderPlans] = useState<
    Record<string, { planType: string; planStatus: string; categoryType: string }>
  >(
    Object.fromEntries(
      providers.map((p) => [p.id, { planType: p.plan_type, planStatus: p.plan_status, categoryType: p.category_type }]),
    ),
  );
  const [savedRows, setSavedRows] = useState<Record<string, boolean>>({});
  const [claimList, setClaimList] = useState<PendingClaim[]>(pendingClaims);

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

  const sortedProviders = [...getAllProviders()].sort((a, b) => {
    const aActive = ["sent", "acknowledged"].includes(changeRequestState[a.id]?.status);
    const bActive = ["sent", "acknowledged"].includes(changeRequestState[b.id]?.status);
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return 0;
  });

  return (
    <div className="bg-navy-gradient min-h-screen py-10">
      <div className="container animate-fade-in">
        <h1 className="mb-6 text-3xl font-bold text-accent-foreground">Admin Panel</h1>

        <Tabs defaultValue="providers">
          <TabsList className="bg-navy-700 border-0">
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
              value="plans"
              className="data-[state=active]:bg-teal-500 data-[state=active]:text-primary-foreground"
            >
              Plans & Categories
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
          </TabsList>

          {/* ── Providers ── */}
          <TabsContent value="providers" className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Provider Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedProviders.map((p) => {
                    const isSuspended = moderationState[p.id] === "suspended";
                    const cr = changeRequestState[p.id];
                    const isComposing = cr?.status === "composing";
                    const isSent = cr?.status === "sent";
                    const isAcknowledged = cr?.status === "acknowledged";
                    const hasActiveRequest = isSent || isAcknowledged;

                    return (
                      <div
                        key={p.id}
                        className={`rounded-xl border p-4 transition-colors ${hasActiveRequest ? "border-orange-500/40 bg-orange-500/[0.04]" : "border-border/60"}`}
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div>
                            <p className="font-medium flex items-center gap-2 flex-wrap">
                              {p.businessName}
                              {isAcknowledged && (
                                <Badge className="bg-emerald-500/15 text-emerald-400 border-0 text-xs">
                                  Changes Confirmed
                                </Badge>
                              )}
                              {isSent && (
                                <Badge className="bg-orange-500/15 text-orange-400 border-0 text-xs">
                                  Awaiting Changes
                                </Badge>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {p.typeBadge} · {p.location}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-navy-600 text-accent-foreground border-0 text-xs">
                              {p.category_type}
                            </Badge>
                            <Badge className="bg-teal-500/20 text-teal-500 border-0 text-xs">{p.plan_type}</Badge>
                            {isSuspended ? (
                              <Badge className="bg-red-500/15 text-red-400 border-0 text-xs">Suspended</Badge>
                            ) : (
                              <Badge className="bg-emerald-500/15 text-emerald-600 border-0 text-xs">Active</Badge>
                            )}
                            {!hasActiveRequest && (
                              <Button
                                size="sm"
                                variant="outline"
                                className={isComposing ? "border-orange-500/60 text-orange-400" : ""}
                                onClick={() =>
                                  setChangeRequestState((prev) => ({
                                    ...prev,
                                    [p.id]: {
                                      status: isComposing ? "idle" : "composing",
                                      message: prev[p.id]?.message ?? "",
                                    },
                                  }))
                                }
                              >
                                {isComposing ? "Cancel" : "Request Changes"}
                              </Button>
                            )}
                            {isAcknowledged && (
                              <Button
                                size="sm"
                                className="bg-teal-500 hover:bg-teal-400"
                                onClick={() => handleMarkReviewed(p.id)}
                              >
                                Mark Reviewed
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant={isSuspended ? "outline" : "destructive"}
                              className={isSuspended ? "text-teal-400 border-teal-500/40" : ""}
                              onClick={() => handleToggleSuspend(p.id)}
                            >
                              {isSuspended ? "Reinstate" : "Suspend"}
                            </Button>
                          </div>
                        </div>
                        {isComposing && (
                          <div className="mt-3 space-y-2">
                            <Textarea
                              rows={3}
                              placeholder="Describe what needs to be updated..."
                              value={cr.message}
                              onChange={(e) =>
                                setChangeRequestState((prev) => ({
                                  ...prev,
                                  [p.id]: { ...prev[p.id], message: e.target.value },
                                }))
                              }
                              className="text-sm"
                            />
                            <Button
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-400"
                              disabled={!cr.message.trim()}
                              onClick={() => handleSendChangeRequest(p.id)}
                            >
                              Send Request
                            </Button>
                          </div>
                        )}
                        {(isSent || isAcknowledged) && (
                          <div className="mt-3 rounded-lg border border-orange-500/20 bg-orange-500/[0.08] px-3 py-2 text-sm text-orange-300">
                            <span className="font-medium text-orange-400">Your note: </span>
                            {cr.message}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
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
                      className="flex items-center justify-between rounded-xl border border-border/60 p-4"
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
                      className="flex items-center justify-between rounded-xl border border-border/60 p-4"
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

          {/* ── Plans & Categories ── */}
          <TabsContent value="plans" className="mt-6">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Provider Plans & Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providers.map((p) => {
                    const row = providerPlans[p.id];
                    return (
                      <div key={p.id} className="rounded-xl border border-border/60 p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-sm text-muted-foreground">{p.typeBadge}</p>
                          </div>
                          <div className="flex gap-2 flex-wrap justify-end">
                            <Badge className="bg-navy-600 text-accent-foreground border-0 text-xs">
                              {row.categoryType}
                            </Badge>
                            <Badge className="bg-teal-500/20 text-teal-500 border-0 text-xs">{row.planType}</Badge>
                            <Badge className="bg-emerald-500/15 text-emerald-600 border-0 text-xs">
                              {row.planStatus}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div>
                            <Label className="text-xs">Category Type</Label>
                            <Select
                              value={row.categoryType}
                              onValueChange={(v) => handlePlanChange(p.id, "categoryType", v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card">
                                {categoryTypes.map((ct) => (
                                  <SelectItem key={ct} value={ct}>
                                    {ct}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Plan Type</Label>
                            <Select value={row.planType} onValueChange={(v) => handlePlanChange(p.id, "planType", v)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card">
                                {planTypes.map((pt) => (
                                  <SelectItem key={pt} value={pt}>
                                    {pt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">Plan Status</Label>
                            <Select
                              value={row.planStatus}
                              onValueChange={(v) => handlePlanChange(p.id, "planStatus", v)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-card">
                                {planStatuses.map((ps) => (
                                  <SelectItem key={ps} value={ps}>
                                    {ps}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            className="bg-teal-500 hover:bg-teal-400"
                            onClick={() => handleSaveProviderPlan(p.id)}
                          >
                            {savedRows[p.id] ? "Saved ✓" : "Save Changes"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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
                      style={{ color: slotsLeft === 0 ? "#e8622a" : undefined }}
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
                        <div className="flex items-start justify-between gap-4">
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
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
