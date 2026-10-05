import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import PageBanner from "@/components/PageBanner";
import { getArticles, articlePath } from "@/data/articles";

const GuidesPage = () => (
  <div className="bg-background min-h-screen">
    <PageBanner title="Guides & understanding" subtitle="Clear, jargon-free guides to help you navigate the SEND landscape." />
    <div className="container max-w-2xl animate-fade-in py-12">
      <div className="space-y-4">
        {getArticles("guide").map((g) => (
          <Link key={g.slug} to={articlePath(g)} className="block">
            <Card className="border-0 shadow-card card-hover-lift">
              <CardContent className="p-7">
                <h3 className="font-semibold">{g.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{g.summary}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-muted-foreground">
        Want the latest SEND news?{" "}
        <Link to="/news" className="text-teal-500 hover:underline">Read news & updates</Link>
      </p>
    </div>
  </div>
);

export default GuidesPage;
