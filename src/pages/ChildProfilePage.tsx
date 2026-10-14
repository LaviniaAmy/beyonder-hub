import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Heart, CircleOff, ClipboardList, Mountain, Sparkles, MessageCircle, Ear, School, ShieldCheck,
  Share2, Ellipsis, Pencil, Download, Trash2, FlaskConical, X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useIsMobileLayout } from "@/hooks/useIsMobileLayout";
import { enquiryStore } from "@/data/enquiryStore";
import { SECTIONS, type SectionId } from "@/data/childProfileOptions";
import {
  getChild, updateChild, deleteChild, setResearchConsent, dismissResearchReminder, shouldShowResearchReminder,
  ageText, completeness, sectionFilled, sectionPeek, exportChild, type ChildProfile,
} from "@/data/childProfileStore";
import StarlingAvatar from "@/components/child-profile/StarlingAvatar";
import AvatarBuilder from "@/components/child-profile/AvatarBuilder";
import SectionSheet from "@/components/child-profile/SectionSheet";
import ResearchConsent from "@/components/child-profile/ResearchConsent";
import Sheet from "@/components/child-profile/Sheet";
import { TestNote } from "./ChildSetupPage";
import "@/components/beyonder-app/beyonderApp.css";
import "@/components/child-profile/childProfile.css";

const ICONS: Record<SectionId, typeof Heart> = {
  love: Heart, dislikes: CircleOff, diagnosis: ClipboardList, hard: Mountain, helps: Sparkles,
  communication: MessageCircle, senses: Ear, school: School, safety: ShieldCheck,
};
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
);

type Panel = null | "look" | "share" | "menu" | "research";

/** The child's profile home: starling, nine tiles, panels for editing. Fits one screen on phone and desktop. */
const ChildProfilePage = () => {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const mobile = useIsMobileLayout();
  const parentId = user!.id;

  const [child, setChild] = useState<ChildProfile | undefined>(() => getChild(parentId, id));
  const [editing, setEditing] = useState<SectionId | null>(null);
  const [params] = useSearchParams();
  const [panel, setPanel] = useState<Panel>(params.get("panel") === "research" ? "research" : null);
  const [lookDraft, setLookDraft] = useState(child?.avatar);
  const [details, setDetails] = useState({ name: child?.firstName ?? "", month: child?.birthMonth ?? null, year: child?.birthYear ?? null });
  const closePanel = useCallback(() => setPanel(null), []);
  const closeSection = useCallback(() => setEditing(null), []);

  // Providers this parent has contacted — the only ones they can share with.
  const providers = useMemo(() => {
    const isTest = parentId === "parent-test";
    const seen = new Map<string, string>();
    enquiryStore
      .filter((e) => e.parentId === parentId || (isTest && e.parentId === "mock-parent"))
      .forEach((e) => seen.set(e.providerId, e.providerName));
    return [...seen.entries()].map(([pid, name]) => ({ id: pid, name }));
  }, [parentId]);

  if (!child) {
    return (
      <div className="cp-page">
        <div className="ba-root cp-app cp-narrow" style={{ justifyContent: "center", alignItems: "center", padding: 24, textAlign: "center" }}>
          <h2 style={{ fontSize: 24, marginBottom: 12 }}>Profile not found</h2>
          <Link to="/dashboard" className="cp-link">Back to your dashboard</Link>
        </div>
      </div>
    );
  }

  const save = (updates: Parameters<typeof updateChild>[2]) => setChild(updateChild(parentId, child.id, updates));
  const name = child.firstName;
  const pct = completeness(child.answers);
  const age = ageText(child);
  const avatarSize = mobile ? 84 : 156;
  const ring = avatarSize + 12;
  const circ = Math.PI * (ring - 6);
  const showReminder = shouldShowResearchReminder(child);
  const editingSection = editing ? SECTIONS.find((s) => s.id === editing)! : null;

  const download = () => {
    const blob = new Blob([exportChild(child)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "child"}-beyonder-profile.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const remove = () => {
    if (!window.confirm(`Delete ${name}'s profile? Everything in it will be removed and this can't be undone.`)) return;
    deleteChild(parentId, child.id);
    navigate("/dashboard", { replace: true });
  };
  const openLook = () => {
    setLookDraft(child.avatar);
    setDetails({ name: child.firstName, month: child.birthMonth, year: child.birthYear });
    setPanel("look");
  };
  const toggleShare = (providerId: string, s: SectionId) => {
    const cur = child.sharing[providerId] ?? [];
    save({ sharing: { ...child.sharing, [providerId]: cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s] } });
  };

  const reminder = showReminder && (
    <p className="cp-reminder">
      <FlaskConical size={15} aria-hidden="true" />
      <span>Help SEND research? <button className="cp-link" onClick={() => setPanel("research")}>Find out more</button></span>
      <button className="cp-x" aria-label="Hide for now" onClick={() => { dismissResearchReminder(parentId, child.id); setChild(getChild(parentId, child.id)); }}>
        <X aria-hidden="true" />
      </button>
    </p>
  );

  return (
    <div className="cp-page">
      <div className="ba-root cp-app cp-wide">
        <div className="ba-bar">
          <button className="ba-iconbtn" onClick={() => navigate("/dashboard")} aria-label="Back to dashboard"><BackIcon /></button>
          <div className="ba-bar-title">{name}'s profile</div>
          <button className="ba-iconbtn" onClick={() => setPanel("share")} aria-label="Sharing"><Share2 /></button>
          <button className="ba-iconbtn" onClick={() => setPanel("menu")} aria-label="More options"><Ellipsis /></button>
        </div>
        <TestNote />

        <div className="cp-body cp-home">
          <div className="cp-side cp-hero">
            <button className="cp-avatar-btn" onClick={openLook} aria-label={`Change ${name}'s starling and details`}>
              <svg className="cp-ring" width={ring} height={ring} viewBox={`0 0 ${ring} ${ring}`} aria-hidden="true">
                <circle cx={ring / 2} cy={ring / 2} r={(ring - 6) / 2} fill="none" stroke="#EAE6DF" strokeWidth="4" />
                <circle cx={ring / 2} cy={ring / 2} r={(ring - 6) / 2} fill="none" stroke="#D98A6A" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={`${(circ * pct) / 100} ${circ}`} transform={`rotate(-90 ${ring / 2} ${ring / 2})`} />
              </svg>
              <StarlingAvatar look={child.avatar} size={avatarSize} label={`${name}'s starling`} />
              <span className="cp-edit-dot" aria-hidden="true"><Pencil /></span>
            </button>
            <p className="cp-name">{name}</p>
            <p className="cp-sub">{age ? `Age ${age} · ` : ""}{pct}% complete</p>
            <div className="cp-actions">
              <button className="cp-pill" onClick={() => setPanel("share")}><Share2 aria-hidden="true" /> Sharing</button>
              <button className="cp-pill" onClick={download}><Download aria-hidden="true" /> Download my data</button>
            </div>
          </div>

          <div className="cp-main">
            <div className="cp-grid">
              {SECTIONS.map((s) => {
                const Icon = ICONS[s.id];
                const filled = sectionFilled(child.answers, s.id);
                return (
                  <button key={s.id} className="cp-tile" onClick={() => setEditing(s.id)} aria-label={`${s.title}${filled ? "" : " — add"}`}>
                    {filled && <span className="cp-tile-done" aria-hidden="true" />}
                    <span className="cp-tile-icon" aria-hidden="true"><Icon /></span>
                    <strong>{s.title}</strong>
                    {filled ? <small>{sectionPeek(child.answers, s.id)}</small> : <small className="cp-add">+ Add</small>}
                  </button>
                );
              })}
            </div>
            {reminder}
          </div>
        </div>
      </div>

      <SectionSheet
        section={editingSection}
        answers={child.answers}
        onClose={closeSection}
        onSave={(answers) => { save({ answers }); setEditing(null); }}
      />

      <Sheet open={panel === "look"} onClose={closePanel} title={`${name}'s starling`}
        footer={<>
          <button className="ba-btn ba-btn-ghost" style={{ flex: 1 }} onClick={closePanel}>Cancel</button>
          <button className="ba-btn ba-btn-primary" style={{ flex: 2 }} disabled={!details.name.trim()} onClick={() => {
            save({ avatar: lookDraft!, firstName: details.name.trim(), birthMonth: details.month, birthYear: details.year });
            closePanel();
          }}>Save</button>
        </>}
      >
        <AvatarBuilder look={lookDraft ?? child.avatar} onChange={setLookDraft} name={details.name} />
        <p className="cp-label">First name</p>
        <input className="ba-field" value={details.name} maxLength={30} aria-label="First name" onChange={(e) => setDetails({ ...details, name: e.target.value })} />
        <p className="cp-label">Born in</p>
        <div className="cp-row2">
          <select className="ba-field" aria-label="Birth month" value={details.month ?? ""} onChange={(e) => setDetails({ ...details, month: e.target.value ? Number(e.target.value) : null })}>
            <option value="">Month</option>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
          <select className="ba-field" aria-label="Birth year" value={details.year ?? ""} onChange={(e) => setDetails({ ...details, year: e.target.value ? Number(e.target.value) : null })}>
            <option value="">Year</option>
            {Array.from({ length: 26 }, (_, i) => new Date().getFullYear() - i).map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </Sheet>

      <Sheet open={panel === "share"} onClose={closePanel} title="Who can see what"
        hint={`Nothing is shared unless you switch it on. Choose what each provider can see of ${name}'s profile.`}
        footer={<button className="ba-btn ba-btn-primary" onClick={closePanel}>Done</button>}
      >
        {providers.length === 0 ? (
          <p className="ba-empty">When you contact a provider, they'll appear here so you can choose what they see.</p>
        ) : providers.map((p) => (
          <div key={p.id} className="cp-share-provider">
            <h3>{p.name}</h3>
            <div className="cp-chips" role="group" aria-label={`Shared with ${p.name}`}>
              {SECTIONS.map((s) => (
                <button key={s.id} className="ba-chip" aria-pressed={(child.sharing[p.id] ?? []).includes(s.id)} onClick={() => toggleShare(p.id, s.id)}>
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        ))}
        <p className="ba-note">Your choices are saved now. Providers will be able to view what you've shared once secure sharing goes live.</p>
      </Sheet>

      <Sheet open={panel === "menu"} onClose={closePanel} title={`${name}'s profile`}>
        <ul className="ba-menu">
          <li><button onClick={() => openLook()}><span>Change starling and details</span><Pencil size={18} aria-hidden="true" /></button></li>
          <li><button onClick={() => setPanel("share")}><span>Who can see what</span><Share2 size={18} aria-hidden="true" /></button></li>
          <li><button onClick={() => setPanel("research")}><span>Research <small>{child.researchConsent ? "Included" : "Not included"}</small></span><FlaskConical size={18} aria-hidden="true" /></button></li>
          <li><button onClick={download}><span>Download my data</span><Download size={18} aria-hidden="true" /></button></li>
          <li><button className="cp-menu-danger" onClick={remove}><span>Delete this profile</span><Trash2 size={18} aria-hidden="true" /></button></li>
        </ul>
        <p className="ba-proto">Read how we look after this information in our <Link to="/privacy" className="cp-link">privacy policy</Link>.</p>
      </Sheet>

      <Sheet open={panel === "research"} onClose={closePanel} title="SEND research"
        footer={<button className="ba-btn ba-btn-primary" onClick={closePanel}>Done</button>}
      >
        <ResearchConsent name={name} checked={!!child.researchConsent}
          onChange={(v) => { setResearchConsent(parentId, child.id, v); setChild(getChild(parentId, child.id)); }} />
        {!child.researchConsent && !child.researchReminder.neverAsk && (
          <button className="cp-link" style={{ display: "block", margin: "16px auto 0", fontSize: 14 }} onClick={() => {
            dismissResearchReminder(parentId, child.id, true); setChild(getChild(parentId, child.id)); closePanel();
          }}>Don't ask me again</button>
        )}
      </Sheet>
    </div>
  );
};

export default ChildProfilePage;
