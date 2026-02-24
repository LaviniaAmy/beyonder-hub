import { useParams, Link } from "react-router-dom";
import { MapPin, Star, ShieldCheck, Award, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { providers, reviews } from "@/data/mockData";

const ProviderPage = () => {
  const { id } = useParams();
  const provider = providers.find((p) => p.id === id);
  const providerReviews = reviews.filter((r) => r.providerId === id);

  if (!provider) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Provider not found</h1>
        <Button asChild className="mt-4"><Link to="/providers">Back to Directory</Link></Button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Hero — navy gradient */}
      <section className="bg-navy-gradient py-12">
        <div className="container animate-fade-in">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-navy-600 text-accent-foreground border-0">{provider.typeBadge}</Badge>
                <Badge className="bg-teal-500/20 text-teal-400 border-0 capitalize">{provider.plan_type}</Badge>
                <Badge className="bg-emerald-500/15 text-emerald-400 border-0 capitalize">{provider.plan_status}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-accent-foreground">{provider.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-accent-foreground/70">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{provider.location}</span>
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-orange-400 text-orange-400" />{provider.rating} ({provider.reviewCount} reviews)</span>
                {provider.verified && <span className="flex items-center gap-1 text-teal-400"><ShieldCheck className="h-4 w-4" />Verified</span>}
                {provider.foundingProvider && <span className="flex items-center gap-1 text-orange-300"><Award className="h-4 w-4" />Founding Provider</span>}
              </div>
            </div>
            <Button size="lg" className="bg-teal-500 hover:bg-teal-400 shadow-lg" asChild>
              <Link to={`/enquiry/${provider.id}`}>Send Enquiry</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mt-10 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Overview */}
          <Card className="border-0 shadow-card">
            <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{provider.description}</p>
              <div className="flex flex-wrap gap-2">
                {provider.needsSupported.map((n) => <Badge key={n} variant="outline" className="border-border/60">{n}</Badge>)}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span><strong className="text-foreground">Age Range:</strong> {provider.ageRange}</span>
                <span><strong className="text-foreground">Format:</strong> {provider.deliveryFormat}</span>
              </div>
            </CardContent>
          </Card>

          {/* Conditional Modules */}
          {provider.credentials && (
            <Card className="border-0 shadow-card">
              <CardHeader><CardTitle>Credentials & Qualifications</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {provider.credentials.map((c) => <li key={c} className="flex items-center gap-2 text-sm"><ShieldCheck className="h-4 w-4 text-teal-500" />{c}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {provider.timetable && (
            <Card className="border-0 shadow-card">
              <CardHeader><CardTitle>Timetable</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {provider.timetable.map((t, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <Clock className="h-4 w-4 text-teal-500" />
                      <span className="font-medium w-24">{t.day}</span>
                      <span className="text-muted-foreground">{t.time}</span>
                      <span>{t.activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {provider.products && (
            <Card className="border-0 shadow-card">
              <CardHeader><CardTitle>Products</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {provider.products.map((p) => (
                    <div key={p.name} className="rounded-xl border border-border/60 p-4 text-center card-hover-lift">
                      <div className="mb-2 h-20 rounded-lg bg-muted" />
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-sm text-teal-500 font-semibold">{p.price}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {provider.educationDetails && (
            <Card className="border-0 shadow-card">
              <CardHeader><CardTitle>Education Details</CardTitle></CardHeader>
              <CardContent><p className="text-muted-foreground leading-relaxed">{provider.educationDetails}</p></CardContent>
            </Card>
          )}

          {/* Reviews */}
          <Card className="border-0 shadow-card">
            <CardHeader><CardTitle>Reviews</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {providerReviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet.</p>
              ) : providerReviews.map((r) => (
                <div key={r.id} className="border-b border-border/40 pb-4 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="flex">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-400" />)}</div>
                    <span className="text-sm font-medium">{r.authorName}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-0 shadow-card">
            <CardHeader><CardTitle>Practical Info</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><strong className="text-foreground">Coverage Area</strong><p className="text-muted-foreground">{provider.coverageArea}</p></div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-teal-500" /><span>{provider.contactMethod}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-navy-900 p-4 shadow-lg border-t border-navy-700">
        <div className="container flex items-center justify-between">
          <span className="font-semibold text-accent-foreground">{provider.name}</span>
          <Button className="bg-teal-500 hover:bg-teal-400" asChild><Link to={`/enquiry/${provider.id}`}>Send Enquiry</Link></Button>
        </div>
      </div>
    </div>
  );
};

export default ProviderPage;
