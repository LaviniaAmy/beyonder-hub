import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import PageBanner from "@/components/PageBanner";
import { getArticles, articlePath, formatArticleDate } from "@/data/articles";

const NewsPage = () => (
  <div className="bg-background min-h-screen">
    <PageBanner title="News & updates" />
    <div className="container max-w-2xl animate-fade-in py-12">
      <div className="space-y-4">
        {getArticles("news").map((a) => (
          <Link key={a.slug} to={articlePath(a)} className="block">
            <Card className="border-0 shadow-card card-hover-lift">
              <CardContent className="p-7">
                <p className="text-xs text-muted-foreground">
                  {[a.tag, formatArticleDate(a.date)].filter(Boolean).join(" · ")}
                </p>
                <h3 className="mt-1 font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{a.summary}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <p className="mt-10 text-center text-sm text-muted-foreground">
        Looking for practical help?{" "}
        <Link to="/guides" className="text-teal-500 hover:underline">Read our guides</Link>
      </p>
    </div>
  </div>
);

export default NewsPage;
