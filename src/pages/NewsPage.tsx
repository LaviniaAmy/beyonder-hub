import { Card, CardContent } from "@/components/ui/card";

const articles = [
  { title: "New SEND Reforms Announced for 2026", date: "2026-02-01", summary: "The government has outlined new proposals for improving SEND provision across England and Wales." },
  { title: "Beyonder Launches in Bristol", date: "2026-01-15", summary: "Our platform is now live with providers across Bristol and the South West." },
  { title: "Tips for a Smooth School Transition", date: "2026-01-05", summary: "Practical advice for parents preparing their SEND child for a new school year." },
];

const NewsPage = () => (
  <div className="py-12">
    <div className="container max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">News & Updates</h1>
      <div className="space-y-4">
        {articles.map((a) => (
          <Card key={a.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <p className="text-xs text-muted-foreground">{a.date}</p>
              <h3 className="mt-1 font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default NewsPage;
