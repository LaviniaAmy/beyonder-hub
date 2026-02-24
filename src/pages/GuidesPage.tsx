import { Card, CardContent } from "@/components/ui/card";

const guides = [
  { title: "Understanding EHCPs", summary: "A plain-English guide to Education, Health and Care Plans — what they are, how to apply, and what to expect." },
  { title: "Navigating the Assessment Process", summary: "Step-by-step guidance on getting your child assessed for additional needs." },
  { title: "Choosing the Right Therapist", summary: "What to look for, what questions to ask, and how to know when you've found the right fit." },
  { title: "Sensory Processing: A Parent's Guide", summary: "Understanding sensory needs and practical strategies you can use at home and school." },
];

const GuidesPage = () => (
  <div className="bg-navy-gradient min-h-screen py-16">
    <div className="container max-w-2xl animate-fade-in">
      <h1 className="mb-4 text-3xl font-bold text-accent-foreground">Guides & Understanding</h1>
      <p className="mb-10 text-accent-foreground/70 leading-relaxed">Clear, jargon-free guides to help you navigate the SEND landscape.</p>
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
