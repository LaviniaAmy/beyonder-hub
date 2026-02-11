import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { enquiries, mockParent } from "@/data/mockData";

const ParentDashboard = () => {
  const parentEnquiries = enquiries.filter((e) => e.parentName === mockParent.name);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<string | null>(null);

  const handleViewReply = (enquiryId: string) => {
    if (mockParent.subscriptionTier === "free") {
      setUpgradeOpen(true);
    } else {
      setSelectedEnquiry(enquiryId);
    }
  };

  return (
    <div className="py-8">
      <div className="container max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <Badge variant={mockParent.subscriptionTier === "free" ? "secondary" : "default"}>
            {mockParent.subscriptionTier === "free" ? "Free Tier" : "Subscribed"}
          </Badge>
        </div>

        <Card className="mb-8">
          <CardHeader><CardTitle>Your Enquiries</CardTitle></CardHeader>
          <CardContent>
            {parentEnquiries.length === 0 ? (
              <div className="py-8 text-center">
                <p className="mb-4 text-muted-foreground">You haven't sent any enquiries yet.</p>
                <Button asChild><Link to="/explore">Explore Services</Link></Button>
              </div>
            ) : (
              <div className="space-y-3">
                {parentEnquiries.map((e) => (
                  <div key={e.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{e.providerName}</p>
                      <p className="text-sm text-muted-foreground">{e.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={e.status === "replied" ? "default" : "secondary"}>{e.status}</Badge>
                      {e.status === "replied" && (
                        <Button size="sm" variant="outline" onClick={() => handleViewReply(e.id)}>View Reply</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Profile Settings</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Name:</strong> {mockParent.name}</p>
            <p><strong>Email:</strong> {mockParent.email}</p>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Modal */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Provider Responses</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            To read responses from providers, choose a plan that works for you. No pressure — pick what suits your family.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-2 cursor-pointer hover:border-primary">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">£4.95</p>
                <p className="text-sm text-muted-foreground">One-off unlock</p>
                <p className="mt-2 text-xs text-muted-foreground">Read replies from one provider</p>
              </CardContent>
            </Card>
            <Card className="border-2 cursor-pointer hover:border-primary">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">£9.95<span className="text-sm font-normal">/month</span></p>
                <p className="text-sm text-muted-foreground">Unlimited access</p>
                <p className="mt-2 text-xs text-muted-foreground">Read all provider replies</p>
              </CardContent>
            </Card>
          </div>
          <Button className="mt-4 w-full" onClick={() => setUpgradeOpen(false)}>Continue to Checkout</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentDashboard;
