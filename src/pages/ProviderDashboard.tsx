import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { enquiries, mockProvider, providers } from "@/data/mockData";

const tiers = [
  { name: "Free Listing", price: "Free", features: ["Basic profile listing", "Receive enquiries", "Category placement"], current: true },
  { name: "Premium", price: "£19.95/mo", features: ["Everything in Free", "Priority placement", "Detailed analytics", "Verified badge", "Photo gallery"], current: false },
];

const ProviderDashboard = () => {
  const providerEnquiries = enquiries.filter((e) => e.providerId === mockProvider.id);
  const profile = providers.find((p) => p.id === mockProvider.id);
  const [selectedPlan, setSelectedPlan] = useState("Free Listing");

  return (
    <div className="py-8">
      <div className="container max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">Provider Dashboard</h1>

        <Card className="mb-8">
          <CardHeader><CardTitle>Enquiries</CardTitle></CardHeader>
          <CardContent>
            {providerEnquiries.length === 0 ? (
              <p className="text-muted-foreground">No enquiries yet.</p>
            ) : (
              <div className="space-y-3">
                {providerEnquiries.map((e) => (
                  <div key={e.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-medium">{e.parentName}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{e.message}</p>
                    </div>
                    <Badge variant={e.status === "sent" ? "destructive" : "secondary"}>{e.status === "sent" ? "New" : e.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {profile && (
          <Card className="mb-8">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Your Profile</CardTitle>
              <Button size="sm" variant="outline">Edit Profile</Button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Type:</strong> {profile.typeBadge}</p>
              <p><strong>Location:</strong> {profile.location}</p>
              <p><strong>Delivery:</strong> {profile.deliveryFormat}</p>
            </CardContent>
          </Card>
        )}

        {/* Upgrade Plan Section */}
        <Card>
          <CardHeader><CardTitle>Upgrade Plan</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {tiers.map((t) => (
                <div
                  key={t.name}
                  className={`rounded-lg border p-5 ${
                    t.name === "Premium" ? "border-primary border-2" : ""
                  } ${selectedPlan === t.name ? "bg-primary/5" : ""}`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold">{t.name}</h3>
                    {t.current && <Badge variant="secondary">Current</Badge>}
                  </div>
                  <p className="mb-4 text-2xl font-bold text-primary">{t.price}</p>
                  <ul className="mb-4 space-y-2">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={t.current ? "outline" : "default"}
                    disabled={t.current}
                    onClick={() => setSelectedPlan(t.name)}
                  >
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

export default ProviderDashboard;
