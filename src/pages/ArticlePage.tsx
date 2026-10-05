import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { Card, CardContent } from "@/components/ui/card";
import { type ArticleKind, getArticle, getArticles, articlePath, formatArticleDate } from "@/data/articles";

const SECTION: Record<ArticleKind, { label: string; path: string; more: string }> = {
  news: { label: "News & updates", path: "/news", more: "More news" },
  guide: { label: "Guides & understanding", path: "/guides", more: "More guides" },
};

const ArticlePage = ({ kind }: { kind: ArticleKind }) => {
  const { slug } = useParams();
  const article = getArticle(kind, slug ?? "");
  const section = SECTION[kind];

  if (!article) {
    return (
      <div className="bg-background min-h-screen">
        <PageBanner title="Article not found" />
        <div className="container max-w-2xl py-12 text-center">
          <Link to={section.path} className="text-teal-500 hover:underline">Back to {section.label.toLowerCase()}</Link>
        </div>
      </div>
    );
  }

  const more = getArticles(kind).filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <div className="bg-background min-h-screen">
      <PageBanner title={article.title} subtitle={[article.tag, formatArticleDate(article.date)].filter(Boolean).join(" · ")} />
      <div className="container max-w-2xl animate-fade-in py-12 space-y-8">
        <Link to={section.path} className="inline-flex items-center gap-1.5 text-sm text-teal-500 hover:underline">
          <ArrowLeft className="h-4 w-4" /> {section.label}
        </Link>

        <article className="rounded-xl bg-card p-8 shadow-card space-y-4 leading-relaxed">
          <p className="text-lg text-foreground">{article.summary}</p>
          {article.placeholder ? (
            <p className="text-muted-foreground">The full article is being written and will be published here soon.</p>
          ) : (
            article.body.map((para, i) =>
              para.startsWith("## ") ? (
                <h2 key={i} className="pt-2 text-xl font-semibold text-foreground">{para.slice(3)}</h2>
              ) : (
                <p key={i} className="text-muted-foreground">{para}</p>
              ),
            )
          )}
        </article>

        {more.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-semibold text-foreground">{section.more}</h2>
            {more.map((a) => (
              <Link key={a.slug} to={articlePath(a)} className="block">
                <Card className="border-0 shadow-card card-hover-lift">
                  <CardContent className="p-5">
                    <h3 className="font-medium">{a.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{a.summary}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default ArticlePage;
