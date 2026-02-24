import { Card, CardContent } from "@/components/ui/card";

const articles = [
  { title: "New SEND Reforms Announced for 2026", date: "2026-02-01", summary: "The government has outlined new proposals for improving SEND provision across England and Wales." },
  { title: "Beyonder Launches in Bristol", date: "2026-01-15", summary: "Our platform is now live with providers across Bristol and the South West." },
  { title: "Tips for a Smooth School Transition", date: "2026-01-05", summary: "Practical advice for parents preparing their SEND child for a new school year." },
];

const NewsPage = () => (
  <div className="bg-navy-gradient min-h-screen py-16">
    <div className="container max-w-2xl animate-fade-in">
      <h1 className="mb-4 text-3xl font-bold text-accent-foreground">News & Updates</h1>
      <div className="space-y-4 mt-8">
        {articles.map((a) => (
          <Card key={a.title} className="cursor-pointer border-0 shadow-card card-hover-lift">
            <CardContent className="p-7">
              <p className="text-xs text-muted-foreground">{a.date}</p>
              <h3 className="mt-1 font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default NewsPage;
