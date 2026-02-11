import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { enquiries, mockProvider, providers } from "@/data/mockData";

const ProviderDashboard = () => {
  const providerEnquiries = enquiries.filter((e) => e.providerId === mockProvider.id);
  const profile = providers.find((p) => p.id === mockProvider.id);

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

        <Card>
          <CardHeader><CardTitle>Plan</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You are on the <strong>Free listing</strong> plan.</p>
            <Button size="sm" className="mt-3">Upgrade Plan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderDashboard;
