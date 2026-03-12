import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { mockParent } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import {
  enquiryStore,
  getEnquiriesForParent,
  unlockEnquiry,
  parentReplyToEnquiry,
  messagesRemaining,
  isAtCap,
  isParentTurn,
} from "@/data/enquiryStore";

const MAX_CHARS = 500;

const ParentDashboard = () => {
  const { user } = useAuth();
  const parentId = user?.id ?? "mock-parent";

  // Only show enquiries for the logged-in parent.
  // Test parent merges both seeded IDs so demo data is visible.
  const getParentEnquiries = () => {
    const isTestParent = parentId === "mock-parent" || parentId === "parent-test";
    if (isTestParent) {
      const seen = new Set<string>();
      return [...getEnquiriesForParent("mock-parent"), ...getEnquiriesForParent("parent-test")].filter((e) => {
        if (seen.has(e.enquiryId)) return false;
        seen.add(e.enquiryId);
        return true;
      });
    }
    return getEnquiriesForParent(parentId);
  };

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [paywallEnquiryId, setPaywallEnquiryId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [, forceUpdate] = useState(0);

  const parentEnquiries = getParentEnquiries();
  const selectedRecord = selectedId ? (enquiryStore.find((e) => e.enquiryId === selectedId) ?? null) : null;

  const handleViewThread = (enquiryId: string) => {
    const record = parentEnquiries.find((e) => e.enquiryId === enquiryId);
    if (!record) return;

    // Provider has replied but not yet unlocked — show paywall
    if (record.statusForParent === "replied" && !record.isUnlocked) {
      setPaywallEnquiryId(enquiryId);
      setUpgradeOpen(true);
      return;
    }

    // Otherwise open thread (read-only if no reply yet, or not parent's turn)
    setSelectedId(enquiryId);
  };

  const handleCheckout = () => {
    if (paywallEnquiryId) {
      unlockEnquiry(paywallEnquiryId);
      setSelectedId(paywallEnquiryId);
      setPaywallEnquiryId(null);
      forceUpdate((n) => n + 1);
    }
    setUpgradeOpen(false);
  };

  const handleSendReply = () => {
    if (!selectedRecord || !replyText.trim()) return;
    parentReplyToEnquiry(selectedRecord.enquiryId, replyText.trim(), user?.name ?? "Parent");
    setReplyText("");
    forceUpdate((n) => n + 1);
  };

  const atCap = selectedRecord ? isAtCap(selectedRecord) : false;
  const remaining = selectedRecord ? messagesRemaining(selectedRecord) : 0;
  // Show reply box only when: thread unlocked AND it's parent's turn AND not at cap
  const showReplyBox = selectedRecord?.isUnlocked && !atCap && isParentTurn(selectedRecord);

  return (
    <div className="bg-navy-gradient min-h-screen py-10">
      <div className="container max-w-3xl animate-fade-in">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-accent-foreground">Your Dashboard</h1>
          <Badge className="bg-navy-600 text-accent-foreground border-0">
            {mockParent.subscriptionTier === "free" ? "Free Tier" : "Subscribed"}
          </Badge>
        </div>

        {/* ── Thread view ── */}
        {selectedRecord ? (
          <Card className="mb-6 border-0 shadow-card">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">{selectedRecord.providerName}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Started {selectedRecord.createdAt}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedId(null);
                  setReplyText("");
                }}
              >
                ← Back
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Message thread */}
              {selectedRecord.messages.map((msg) => (
                <div
                  key={msg.messageId}
                  className={`rounded-xl p-4 ${
                    msg.senderId === "parent"
                      ? "bg-muted/30 border border-border/40 mr-8"
                      : "bg-teal-500/[0.06] border border-teal-500/20 ml-8"
                  }`}
                >
                  <p
                    className={`text-xs mb-1 ${msg.senderId === "parent" ? "text-muted-foreground" : "text-teal-500"}`}
                  >
                    {msg.senderId === "parent" ? "You" : selectedRecord.providerName} · {msg.sentAt}
                  </p>
                  <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                </div>
              ))}

              {/* Status notices — mutually exclusive, no stacking */}
              {atCap ? (
                <div className="rounded-xl border border-border/40 bg-muted/20 p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    This conversation has reached its 6-message limit. Please contact {selectedRecord.providerName}{" "}
                    directly to continue.
                  </p>
                </div>
              ) : !selectedRecord.isUnlocked && selectedRecord.statusForParent === "sent" ? (
                // No reply yet — read-only, show remaining info
                <div className="rounded-xl border border-border/40 bg-muted/20 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Awaiting a reply from {selectedRecord.providerName}.</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {remaining} message{remaining !== 1 ? "s" : ""} remaining in this thread
                  </p>
                </div>
              ) : !selectedRecord.isUnlocked ? null : !isParentTurn(selectedRecord) ? (
                // Unlocked but waiting for provider to reply
                <div className="rounded-xl border border-border/40 bg-muted/20 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Awaiting a reply from {selectedRecord.providerName}.</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {remaining} message{remaining !== 1 ? "s" : ""} remaining in this thread
                  </p>
                </div>
              ) : showReplyBox ? (
                // It's parent's turn — show reply input ONCE only
                <div className="pt-2 space-y-2 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    {remaining} message{remaining !== 1 ? "s" : ""} remaining in this thread
                  </p>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value.slice(0, MAX_CHARS))}
                    placeholder="Write a follow-up message..."
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {MAX_CHARS - replyText.length} characters remaining
                    </span>
                    <Button
                      size="sm"
                      className="bg-teal-500 hover:bg-teal-400"
                      disabled={!replyText.trim()}
                      onClick={handleSendReply}
                    >
                      Send Message
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          /* ── Enquiry list ── */
          <Card className="mb-8 border-0 shadow-card">
            <CardHeader>
              <CardTitle>Your Enquiries</CardTitle>
            </CardHeader>
            <CardContent>
              {parentEnquiries.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-4 text-muted-foreground">You haven't sent any enquiries yet.</p>
                  <Button className="bg-teal-500 hover:bg-teal-400" asChild>
                    <Link to="/explore">Explore Services</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {parentEnquiries.map((e) => (
                    <div
                      key={e.enquiryId}
                      className="flex items-center justify-between rounded-xl border border-border/60 p-4"
                    >
                      <div>
                        <p className="font-medium">{e.providerName}</p>
                        <p className="text-sm text-muted-foreground">{e.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={e.statusForParent === "replied" ? "default" : "secondary"}
                          className={e.statusForParent === "replied" ? "bg-teal-500/20 text-teal-400 border-0" : ""}
                        >
                          {e.statusForParent === "replied" ? "Reply Received" : "Sent"}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => handleViewThread(e.enquiryId)}>
                          {e.statusForParent === "replied"
                            ? e.isUnlocked
                              ? "View Thread"
                              : "Unlock Reply"
                            : "View Sent"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Profile */}
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong className="text-foreground">Name:</strong>{" "}
              <span className="text-muted-foreground">{user?.name ?? mockParent.name}</span>
            </p>
            <p>
              <strong className="text-foreground">Email:</strong>{" "}
              <span className="text-muted-foreground">{user?.email ?? mockParent.email}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Unlock / Upgrade Modal */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Provider Response</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            To read the provider's reply and continue the conversation, choose a plan below.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-2 border-border/60 cursor-pointer card-hover-lift hover:ring-2 hover:ring-teal-500">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-teal-500">£4.95</p>
                <p className="text-sm text-muted-foreground">One-off unlock</p>
                <p className="mt-2 text-xs text-muted-foreground">Read replies from one provider</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-border/60 cursor-pointer card-hover-lift hover:ring-2 hover:ring-teal-500">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-teal-500">
                  £9.95<span className="text-sm font-normal">/month</span>
                </p>
                <p className="text-sm text-muted-foreground">Unlimited access</p>
                <p className="mt-2 text-xs text-muted-foreground">Read all provider replies</p>
              </CardContent>
            </Card>
          </div>
          <Button className="mt-4 w-full bg-teal-500 hover:bg-teal-400" onClick={handleCheckout}>
            Continue to Checkout
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentDashboard;
