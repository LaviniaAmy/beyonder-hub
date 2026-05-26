import { Card, CardContent } from "@/components/ui/card";
import PageBanner from "@/components/PageBanner";

const guides = [
  { title: "Understanding EHCPs", summary: "A plain-English guide to Education, Health and Care Plans — what they are, how to apply, and what to expect." },
  { title: "Navigating the Assessment Process", summary: "Step-by-step guidance on getting your child assessed for additional needs." },
  { title: "Choosing the Right Therapist", summary: "What to look for, what questions to ask, and how to know when you've found the right fit." },
  { title: "Sensory Processing: A Parent's Guide", summary: "Understanding sensory needs and practical strategies you can use at home and school." },
];

const GuidesPage = () => (
  <div className="bg-background min-h-screen">
    <PageBanner title="Guides & understanding" subtitle="Clear, jargon-free guides to help you navigate the SEND landscape." />
    <div className="container max-w-2xl animate-fade-in py-12">
      <div className="space-y-4">
        {guides.map((g) => (
          <Card key={g.title} className="cursor-pointer border-0 shadow-card card-hover-lift">
            <CardContent className="p-7">
              <h3 className="font-semibold">{g.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{g.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

export default GuidesPage;
