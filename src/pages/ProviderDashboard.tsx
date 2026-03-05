import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockParent } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { getEnquiriesForParent } from "@/data/enquiryStore";

const ParentDashboard = () => {
  const { user } = useAuth();
  const parentId = user?.id ?? "mock-parent";

  // Load enquiries for this parent — falls back to mock-parent seed data
  const parentEnquiries =
    getEnquiriesForParent(parentId).length > 0 ? getEnquiriesForParent(parentId) : getEnquiriesForParent("mock-parent");

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<string | null>(null);

  const handleViewReply = (enquiryId: string, statusForParent: string) => {
    if (statusForParent !== "replied") return;
    if (mockParent.subscriptionTier === "free") {
      setUpgradeOpen(true);
    } else {
      setSelectedEnquiry(enquiryId);
    }
  };

  return (
    <div className="bg-navy-gradient min-h-screen py-10">
      <div className="container max-w-3xl animate-fade-in">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-accent-foreground">Your Dashboard</h1>
          <Badge
            className={
              mockParent.subscriptionTier === "free"
                ? "bg-navy-600 text-accent-foreground border-0"
                : "bg-teal-500/20 text-teal-400 border-0"
            }
          >
            {mockParent.subscriptionTier === "free" ? "Free Tier" : "Subscribed"}
          </Badge>
        </div>

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
                      <Badge variant={e.statusForParent === "replied" ? "default" : "secondary"}>
                        {e.statusForParent === "replied" ? "Replied" : "Sent"}
                      </Badge>
                      {e.statusForParent === "replied" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewReply(e.enquiryId, e.statusForParent)}
                        >
                          View Reply
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled className="text-muted-foreground cursor-not-allowed">
                          Waiting for reply
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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

      {/* Upgrade Modal — kept as-is per spec */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Provider Responses</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            To read responses from providers, choose a plan that works for you. No pressure — pick what suits your
            family.
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
          <Button className="mt-4 w-full bg-teal-500 hover:bg-teal-400" onClick={() => setUpgradeOpen(false)}>
            Continue to Checkout
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentDashboard;
