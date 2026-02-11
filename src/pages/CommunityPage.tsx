import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";

const CommunityPage = () => (
  <div className="py-12">
    <div className="container max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Community</h1>
      <p className="mb-8 text-muted-foreground">Connect with other SEND families, share experiences, and find local events.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-start gap-3 p-6">
            <Users className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">Parent Forums</h3>
              <p className="mt-1 text-sm text-muted-foreground">Share advice, ask questions, and connect with parents who understand. Coming soon.</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-6">
            <Calendar className="h-8 w-8 text-primary shrink-0" />
            <div>
              <h3 className="font-semibold">Local Events</h3>
              <p className="mt-1 text-sm text-muted-foreground">Discover SEND-friendly events and meetups near you. Coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default CommunityPage;
