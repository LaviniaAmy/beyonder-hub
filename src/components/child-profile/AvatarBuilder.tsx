import type { AvatarLook, EarExtra, HeadExtra } from "@/data/childProfileStore";
import StarlingAvatar from "./StarlingAvatar";
import { STARLING_COLOURS, POSES } from "./starlingLooks";

const HEADS: { id: HeadExtra; label: string }[] = [
  { id: "none", label: "Nothing" }, { id: "hat", label: "Woolly hat" }, { id: "bow", label: "Bow" },
];
const EARS: { id: EarExtra; label: string }[] = [
  { id: "none", label: "Nothing" }, { id: "ear_defenders", label: "Ear defenders" },
  { id: "headphones", label: "Headphones" }, { id: "hearing_aids", label: "Hearing aids" },
];
const TOGGLES: { key: "glasses" | "necklace" | "toy"; label: string }[] = [
  { key: "glasses", label: "Glasses" }, { key: "necklace", label: "Chewy necklace" }, { key: "toy", label: "Comfort toy" },
];

interface Props {
  look: AvatarLook;
  onChange: (look: AvatarLook) => void;
  name?: string;
  /** Show the big live preview (hidden where the page already shows the avatar). */
  preview?: boolean;
}

/** Pick a starling: colour, pose and extras like ear defenders and glasses. */
const AvatarBuilder = ({ look, onChange, name, preview = true }: Props) => {
  const set = (p: Partial<AvatarLook>) => onChange({ ...look, ...p });
  return (
    <div>
      {preview && (
        <div className="cp-preview">
          <StarlingAvatar look={look} size={124} label={`${name || "Your child"}'s starling`} />
        </div>
      )}

      <p className="cp-label">Colour</p>
      <div className="cp-swatches" role="group" aria-label="Colour">
        {STARLING_COLOURS.map((c) => (
          <button key={c.id} className="cp-swatch" style={{ background: c.body }} aria-label={c.label}
            aria-pressed={look.colour === c.id} onClick={() => set({ colour: c.id })} />
        ))}
      </div>

      <p className="cp-label">Pose</p>
      <div className="cp-poses" role="group" aria-label="Pose">
        {POSES.map((p) => (
          <button key={p.id} className="cp-pose" aria-pressed={look.pose === p.id} onClick={() => set({ pose: p.id })}>
            <StarlingAvatar look={{ ...look, pose: p.id, toy: false }} size={52} background={false} label="" />
            {p.label}
          </button>
        ))}
      </div>

      <p className="cp-label">Extras</p>
      <div className="cp-chips cp-small" role="group" aria-label="Extras">
        {HEADS.filter((h) => h.id !== "none").map((h) => (
          <button key={h.id} className="ba-chip" aria-pressed={look.head === h.id}
            onClick={() => set({ head: look.head === h.id ? "none" : h.id })}>{h.label}</button>
        ))}
        {EARS.filter((e) => e.id !== "none").map((e) => (
          <button key={e.id} className="ba-chip" aria-pressed={look.ears === e.id}
            onClick={() => set({ ears: look.ears === e.id ? "none" : e.id })}>{e.label}</button>
        ))}
        {TOGGLES.map((t) => (
          <button key={t.key} className="ba-chip" aria-pressed={look[t.key]} onClick={() => set({ [t.key]: !look[t.key] })}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvatarBuilder;
