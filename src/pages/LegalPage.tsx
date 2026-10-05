import PageBanner from "@/components/PageBanner";
import { legalDocs, type LegalDocId } from "@/data/legal";

const LegalPage = ({ doc }: { doc: LegalDocId }) => {
  const d = legalDocs[doc];
  return (
    <div className="bg-background min-h-screen">
      <PageBanner title={d.title} />
      <div className="container max-w-2xl animate-fade-in py-12">
        <div className="rounded-xl bg-card p-8 shadow-card space-y-6 leading-relaxed">
          {d.draft && (
            <p className="rounded-lg border border-orange-500/25 bg-orange-500/[0.08] px-4 py-3 text-sm text-orange-500">
              This page is a draft and will be finalised before launch.
            </p>
          )}
          <p className="text-xs text-muted-foreground">Last updated: {d.lastUpdated}</p>
          {d.sections.map((s) => (
            <section key={s.heading} className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">{s.heading}</h2>
              {s.paras.map((p, i) => (
                <p key={i} className="text-muted-foreground">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
