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

const planTypes: PlanType[] = ["founder", "free", "professional", "growth", "featured"];
const planStatuses: PlanStatus[] = ["active", "trial", "expired"];
const categoryTypes: CategoryType[] = ["therapist", "club", "education", "charity", "product"];

const AdminPanel = () => {
  const [strings, setStrings] = useState(defaultStrings);

  return (
    <div className="py-8">
      <div className="container">
        <h1 className="mb-6 text-3xl font-bold">Admin Panel</h1>
        <Tabs defaultValue="providers">
          <TabsList>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="parents">Parents</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="plans">Plans & Categories</TabsTrigger>
            <TabsTrigger value="content">Content Strings</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Provider Moderation</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {providers.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm text-muted-foreground">{p.typeBadge} · {p.location}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{p.category_type}</Badge>
                        <Badge variant="outline">{p.plan_type.charAt(0).toUpperCase() + p.plan_type.slice(1)}</Badge>
                        <Badge className="bg-green-100 text-green-800">{p.plan_status}</Badge>
                        <Button size="sm" variant="outline">Request Changes</Button>
                        <Button size="sm" variant="destructive">Suspend</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parents" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Parent Moderation</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockParents.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-sm text-muted-foreground">{p.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{p.status}</Badge>
                        <Button size="sm" variant="destructive">Suspend</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Review Moderation</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium">{r.authorName} — {r.rating}★</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{r.text}</p>
                      </div>
                      <Button size="sm" variant="destructive">Remove</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Plans & Categories Tab */}
          <TabsContent value="plans" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Provider Plans & Categories</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providers.map((p) => (
                    <div key={p.id} className="rounded-lg border p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{p.name}</p>
                          <p className="text-sm text-muted-foreground">{p.typeBadge}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{p.category_type}</Badge>
                          <Badge variant="outline">{p.plan_type}</Badge>
                          <Badge className="bg-green-100 text-green-800">{p.plan_status}</Badge>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <Label className="text-xs">Category Type</Label>
                          <Select defaultValue={p.category_type}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {categoryTypes.map((ct) => <SelectItem key={ct} value={ct}>{ct}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Plan Type</Label>
                          <Select defaultValue={p.plan_type}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {planTypes.map((pt) => <SelectItem key={pt} value={pt}>{pt}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Plan Status</Label>
                          <Select defaultValue={p.plan_status}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {planStatuses.map((ps) => <SelectItem key={ps} value={ps}>{ps}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Content Strings</CardTitle></CardHeader>
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
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
