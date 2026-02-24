import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";

const CommunityPage = () => (
  <div className="bg-navy-gradient min-h-screen py-16">
    <div className="container max-w-2xl animate-fade-in">
      <h1 className="mb-4 text-3xl font-bold text-accent-foreground">Community</h1>
      <p className="mb-10 text-accent-foreground/70 leading-relaxed">Connect with other SEND families, share experiences, and find local events.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <Card className="border-0 shadow-card card-hover-lift">
          <CardContent className="flex items-start gap-4 p-7">
            <div className="rounded-xl bg-teal-500/10 p-3 shrink-0">
              <Users className="h-6 w-6 text-teal-500" />
            </div>
            <div>
              <h3 className="font-semibold">Parent Forums</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">Share advice, ask questions, and connect with parents who understand. Coming soon.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card card-hover-lift">
          <CardContent className="flex items-start gap-4 p-7">
            <div className="rounded-xl bg-orange-400/10 p-3 shrink-0">
              <Calendar className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h3 className="font-semibold">Local Events</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">Discover SEND-friendly events and meetups near you. Coming soon.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default CommunityPage;
