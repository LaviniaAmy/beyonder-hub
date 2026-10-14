import type { AvatarLook, Pose } from "@/data/childProfileStore";
import { STARLING_COLOURS } from "./starlingLooks";

const colourOf = (id: string) => STARLING_COLOURS.find((c) => c.id === id) ?? STARLING_COLOURS[1];

// Head centre for each pose — accessories are drawn for a head at (76, 46) and moved to fit.
const HEAD: Record<Pose, [number, number]> = { perched: [76, 46], waving: [76, 46], flying: [78, 44], snuggled: [74, 52] };

interface Props {
  look: AvatarLook;
  size?: number;
  /** Soft round background behind the bird. */
  background?: boolean;
  label?: string;
}

/** A friendly starling avatar in the child's chosen colour, pose and extras. Drawn, never a photo. */
const StarlingAvatar = ({ look, size = 96, background = true, label }: Props) => {
  const c = colourOf(look.colour);
  const accent = c.warm ? "#2B4C7E" : "#D98A6A";
  const accentLight = c.warm ? "#BCD3EE" : "#F8DCCD";
  const [hx, hy] = HEAD[look.pose];
  const snug = look.pose === "snuggled";
  const ink = "#1B1A35";

  const head = (
    <g transform={`translate(${hx - 76} ${hy - 46})`}>
      <circle cx="76" cy="46" r="20" fill={c.body} />
      <path d="M94 44 L108 49 L94 53 Z" fill="#F4C542" />
      {snug
        ? <path d="M80 43 Q83.5 46.5 87 43" stroke={ink} strokeWidth="2" fill="none" strokeLinecap="round" />
        : <>
            <circle cx="83" cy="42" r="4.2" fill={ink} />
            <circle cx="84.6" cy="40.4" r="1.4" fill="#fff" />
          </>}
      <ellipse cx="86" cy="52" rx="4" ry="2.6" fill="#F49B9B" opacity=".55" />
      <circle cx="68" cy="36" r="1.3" fill="#fff" opacity=".45" />
      <circle cx="72" cy="31" r="1.1" fill="#fff" opacity=".45" />

      {/* Head extras */}
      {look.head === "hat" && <>
        <path d="M57 38 Q59 19 76 19 Q93 19 95 36 Q76 30 57 38 Z" fill={accent} />
        <path d="M56 38 Q76 30 96 36 L96 41 Q76 35 56 43 Z" fill={accentLight} />
        <circle cx="76" cy="17" r="4.2" fill="#F6F3EE" />
      </>}
      {look.head === "bow" && <>
        <path d="M66 27 L55 20 L56 35 Z" fill={accent} />
        <path d="M66 27 L77 20 L76 35 Z" fill={accent} />
        <circle cx="66" cy="27.5" r="3.2" fill={accentLight} stroke={accent} strokeWidth="1" />
      </>}

      {/* Ear extras */}
      {look.ears === "ear_defenders" && <>
        <path d="M61 39 Q73 15 92 31" stroke={ink} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        <rect x="55" y="37" width="13" height="18" rx="6.5" fill={accent} stroke={ink} strokeWidth="1.2" />
      </>}
      {look.ears === "headphones" && <>
        <path d="M62 40 Q73 17 91 31" stroke={ink} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="62" cy="46" r="6.5" fill={accent} stroke={ink} strokeWidth="1.2" />
        <circle cx="62" cy="46" r="2.4" fill={accentLight} />
      </>}
      {look.ears === "hearing_aids" && <>
        <path d="M65 38 q-6 2 -5.5 9 q.6 5 5.5 6.5" stroke={accent} strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <circle cx="65.5" cy="54" r="1.8" fill={accent} />
      </>}

      {look.glasses && <>
        <line x1="77" y1="41" x2="66" y2="39.5" stroke={ink} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="84" cy="42" r="6.6" fill="#fff" fillOpacity=".18" stroke={ink} strokeWidth="1.8" />
        <circle cx="95.5" cy="43" r="4.4" fill="#fff" fillOpacity=".18" stroke={ink} strokeWidth="1.6" />
        <line x1="90.6" y1="42.4" x2="91.2" y2="42.6" stroke={ink} strokeWidth="1.6" />
      </>}

      {look.necklace && <>
        <path d="M63 61 Q77 70 90 58" stroke={accent} strokeWidth="1.8" fill="none" />
        <path d="M78.5 64.5 l2 4.2 4.6.6 -3.3 3.2 .8 4.6 -4.1-2.2 -4.1 2.2 .8-4.6 -3.3-3.2 4.6-.6z" fill="#7FC8A9" stroke="#4E9C7C" strokeWidth=".8" />
      </>}
    </g>
  );

  let bird;
  if (look.pose === "snuggled") {
    bird = (
      <g>
        <path d="M30 80 L12 74 L16 86 L12 94 L34 88 Z" fill={c.wing} />
        <ellipse cx="58" cy="78" rx="32" ry="28" fill={c.body} />
        <ellipse cx="64" cy="86" rx="19" ry="15" fill={c.belly} />
        {head}
        <ellipse cx="62" cy="84" rx="20" ry="12" transform="rotate(12 62 84)" fill={c.wing} />
        <path d="M98 22 c-2-3.5-7-2.5-6 1.5 c.7 2.6 6 5.5 6 5.5 s5.3-2.9 6-5.5 c1-4 -4-5 -6-1.5z" fill="#F49B9B" />
      </g>
    );
  } else if (look.pose === "flying") {
    bird = (
      <g transform="rotate(-8 60 70)">
        <path d="M14 58 h10 M10 70 h12 M16 82 h8" stroke={c.belly} strokeWidth="2.4" strokeLinecap="round" />
        <path d="M34 74 L12 68 L17 80 L12 90 L36 84 Z" fill={c.wing} />
        <ellipse cx="57" cy="74" rx="30" ry="22" fill={c.body} />
        <ellipse cx="65" cy="80" rx="18" ry="12" fill={c.belly} />
        <circle cx="44" cy="70" r="1.3" fill="#fff" opacity=".45" />
        <circle cx="52" cy="80" r="1.3" fill="#fff" opacity=".45" />
        <path d="M40 70 Q20 32 50 30 Q58 50 54 72 Z" fill={c.wing} />
        {head}
      </g>
    );
  } else {
    const waving = look.pose === "waving";
    bird = (
      <g>
        {waving
          ? <ellipse cx="58" cy="106" rx="30" ry="4" fill="#1B1A35" opacity=".08" />
          : <>
              <path d="M14 104 Q60 98 106 106" stroke="#8B6B4A" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M96 103 q6-9 13-6 q-5 8 -13 6z" fill="#7FB07A" />
            </>}
        <path d="M51 95 L49 104 M49 104 l-4 1 M49 104 l3 2 M62 95 L62 104 M62 104 l-4 1 M62 104 l3 2" stroke="#E89A4F" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M34 74 L12 66 L16 80 L10 90 L36 84 Z" fill={c.wing} />
        <ellipse cx="56" cy="74" rx="30" ry="24" fill={c.body} />
        <ellipse cx="64" cy="80" rx="18" ry="14" fill={c.belly} />
        <circle cx="44" cy="66" r="1.3" fill="#fff" opacity=".45" />
        <circle cx="40" cy="78" r="1.3" fill="#fff" opacity=".45" />
        <circle cx="50" cy="86" r="1.1" fill="#fff" opacity=".45" />
        {waving && <>
          <path d="M44 74 Q30 44 42 24 Q51 25 52 44 Q54 62 58 74 Z" fill={c.wing} />
          <path d="M33 20 q3 -4 8 -3 M28 27 q1 -4 5 -5" stroke={c.wing} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </>}
        {head}
        {!waving && <ellipse cx="49" cy="74" rx="17" ry="11" transform="rotate(-15 49 74)" fill={c.wing} />}
      </g>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={label ?? "Starling avatar"}>
      {background && <circle cx="60" cy="60" r="60" fill={c.warm ? "#E8F4FF" : "#FBEDE6"} />}
      {bird}
      {look.toy && (
        <g>
          <circle cx="96" cy="85" r="3.2" fill="#B98B63" />
          <circle cx="108" cy="85" r="3.2" fill="#B98B63" />
          <circle cx="102" cy="91" r="7" fill="#C9A27E" />
          <ellipse cx="102" cy="104" rx="8" ry="8.5" fill="#C9A27E" />
          <circle cx="99.5" cy="90" r="1" fill={ink} />
          <circle cx="104.5" cy="90" r="1" fill={ink} />
          <ellipse cx="102" cy="93.5" rx="2" ry="1.4" fill="#8B6B4A" />
        </g>
      )}
    </svg>
  );
};

export default StarlingAvatar;
