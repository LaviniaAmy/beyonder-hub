import { researchConsentText } from "@/data/childProfileStore";

/** The optional research opt-in: one short paragraph and an unticked box. Never required, never pre-ticked. */
const ResearchConsent = ({ name, checked, onChange }: { name: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="cp-research">
    <p>
      <strong>Help change SEND support for every family.</strong> Nobody has the full picture of waiting lists, what
      actually helps and where support is missing. Adding {name || "your child"}'s answers to our anonymous statistics
      helps us show councils, schools and researchers what SEND families need. We never include names, documents or
      anything that could identify your child, and you can change your mind at any time.
    </p>
    <label className="ba-consent">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{researchConsentText(name)}</span>
    </label>
  </div>
);

export default ResearchConsent;
