import { SECTIONS, type SectionId } from "@/data/childProfileOptions";
import { sectionPeek, type ChildProfile } from "@/data/childProfileStore";
import { filledSections } from "@/data/enquiryProfile";
import StarlingAvatar from "./StarlingAvatar";
import "@/components/beyonder-app/beyonderApp.css";
import "./childProfile.css";

export const SOMEONE_ELSE = "other";

interface Props {
  kids: ChildProfile[];
  /** A child's id, or SOMEONE_ELSE. */
  chosen: string;
  onChoose: (id: string) => void;
  share: SectionId[];
  onShare: (ids: SectionId[]) => void;
  /** Who it goes to, e.g. "Ruth" or "Splash Inclusive Swimming". */
  to: string;
}

/** "Who is this about?" plus "What would you like to share?" — used by both enquiry forms. */
const EnquiryChildPicker = ({ kids, chosen, onChoose, share, onShare, to }: Props) => {
  const kid = kids.find((k) => k.id === chosen);
  const offered = kid ? filledSections(kid) : [];
  const toggle = (id: SectionId) => onShare(share.includes(id) ? share.filter((x) => x !== id) : [...share, id]);

  return (
    <div className="cp-enq">
      <p className="ba-lbl">Who is this about?</p>
      <div className="cp-enq-kids" role="radiogroup" aria-label="Who is this about?">
        {kids.map((k) => (
          <button key={k.id} type="button" role="radio" aria-checked={chosen === k.id} className="cp-enq-kid" onClick={() => onChoose(k.id)}>
            <StarlingAvatar look={k.avatar} size={40} label="" />
            <span>{k.firstName}</span>
          </button>
        ))}
        <button type="button" role="radio" aria-checked={chosen === SOMEONE_ELSE} className="cp-enq-kid" onClick={() => onChoose(SOMEONE_ELSE)}>
          <span className="cp-enq-other" aria-hidden="true">+</span>
          <span>Someone else</span>
        </button>
      </div>

      {kid && offered.length > 0 && (
        <div className="cp-enq-share">
          <p className="ba-lbl" style={{ marginBottom: 2 }}>What would you like to share with {to}?</p>
          <p className="ba-note" style={{ marginTop: 0, marginBottom: 6 }}>From {kid.firstName}’s profile. Only ticked parts are sent.</p>
          {SECTIONS.filter((s) => offered.includes(s.id)).map((s) => (
            <label key={s.id} className="ba-consent cp-enq-row">
              <input type="checkbox" checked={share.includes(s.id)} onChange={() => toggle(s.id)} />
              <span><strong>{s.title}</strong><small>{sectionPeek(kid.answers, s.id)}</small></span>
            </label>
          ))}
        </div>
      )}
      {kid && offered.length === 0 && (
        <p className="ba-note">{kid.firstName}’s profile is empty so far, so there’s nothing extra to share yet.</p>
      )}
    </div>
  );
};

export default EnquiryChildPicker;
