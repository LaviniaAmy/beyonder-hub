import type { SharedProfile } from "@/data/enquiryStore";

interface Props {
  shared?: SharedProfile;
  childName: string;
  /** "provider" sees "Shared with you", the parent sees "You shared". */
  viewer: "provider" | "parent";
}

/** The parts of a child's profile the parent chose to send with an enquiry or booking. */
const SharedProfileBlock = ({ shared, childName, viewer }: Props) => {
  if (!shared?.sections.length) return null;
  const who = childName || "the child";
  return (
    <details className="rounded-xl border border-border/40 bg-muted/15 p-3.5 text-sm" open={viewer === "provider"}>
      <summary className="cursor-pointer text-xs font-semibold text-foreground/80">
        {viewer === "provider" ? `Shared with you from ${who}'s profile` : `You shared from ${who}'s profile`}
        <span className="font-normal text-muted-foreground"> · {shared.sections.map((s) => s.title).join(", ")}</span>
      </summary>
      <dl className="mt-3 space-y-2.5">
        {shared.sections.map((s) => (
          <div key={s.id}>
            <dt className="text-xs font-semibold text-foreground/70">{s.title}</dt>
            {s.items.map((it, i) => <dd key={i} className="text-foreground/80 leading-relaxed">{it}</dd>)}
          </div>
        ))}
      </dl>
    </details>
  );
};

export default SharedProfileBlock;
