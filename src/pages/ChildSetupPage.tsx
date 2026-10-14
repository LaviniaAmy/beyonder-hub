import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  createChild, readAppPrefill, setResearchConsent, DEFAULT_AVATAR, STORAGE_CONSENT_TEXT, type AvatarLook,
} from "@/data/childProfileStore";
import AvatarBuilder from "@/components/child-profile/AvatarBuilder";
import StarlingAvatar from "@/components/child-profile/StarlingAvatar";
import ResearchConsent from "@/components/child-profile/ResearchConsent";
import "@/components/beyonder-app/beyonderApp.css";
import "@/components/child-profile/childProfile.css";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const Back = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
);

export const TestNote = () => (
  <p className="cp-testnote">Test version: profiles are saved on this device only. Please use example details, not real information.</p>
);

/** First-time setup, straight after registering: consent → starling → name and birth month/year → done. */
const ChildSetupPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const prefill = useMemo(() => readAppPrefill(), []);
  const thisYear = new Date().getFullYear();

  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState(false);
  const [look, setLook] = useState<AvatarLook>(DEFAULT_AVATAR);
  const [name, setName] = useState(prefill.childName);
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(prefill.birthYear);
  const [childId, setChildId] = useState<string | null>(null);
  const [research, setResearch] = useState(false);

  const finishDetails = () => {
    const c = createChild({
      parentId: user!.id, firstName: name, birthMonth: month, birthYear: year, avatar: look,
      answers: prefill.answers, storageConsentGiven: consent,
    });
    setChildId(c.id);
    setStep(3);
  };
  const openProfile = () => {
    if (research && childId) setResearchConsent(user!.id, childId, true);
    navigate(`/dashboard/child/${childId}`, { replace: true });
  };
  const back = () => (step === 0 ? navigate("/dashboard") : setStep(step - 1));
  const shown = name.trim() || "your child";

  return (
    <div className="cp-page">
      <div className="ba-root cp-app cp-narrow">
        <TestNote />
        {step < 3 && (
          <div className="ba-qtop">
            <button className="ba-iconbtn" onClick={back} aria-label="Back"><Back /></button>
            <div className="ba-progress" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => <span key={i} className={`${i <= step ? "ba-done" : ""} ${i === step ? "ba-now" : ""}`} />)}
            </div>
            <button className="ba-skip" style={step === 1 ? undefined : { visibility: "hidden" }} onClick={() => setStep(2)}>Skip</button>
          </div>
        )}

        {step === 1 && (
          <div className="cp-look-head">
            <StarlingAvatar look={look} size={92} label={`${shown}'s starling`} />
            <div>
              <h2>Choose a starling</h2>
              <p className="ba-hint">Pick a colour, pose and extras that feel like your child.</p>
            </div>
          </div>
        )}

        <div className="ba-qbody" style={step === 1 ? { paddingTop: 4 } : undefined}>
          {step === 0 && (
            <>
              <h2>Before we start</h2>
              <p className="ba-hint">
                Your child's profile keeps everything in one place, so you only have to explain once. It's private to you,
                and you choose exactly what each provider can see.
              </p>
              <label className="ba-consent" style={{ fontSize: 15 }}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>{STORAGE_CONSENT_TEXT} <Link to="/privacy" className="cp-link" target="_blank">Privacy policy</Link></span>
              </label>
              <p className="ba-note" style={{ marginTop: 18 }}>
                Only add what you're comfortable with — every question is optional, and you can delete the profile at any time.
              </p>
            </>
          )}

          {step === 1 && <AvatarBuilder look={look} onChange={setLook} name={name} preview={false} />}

          {step === 2 && (
            <>
              <h2>About your child</h2>
              <p className="ba-hint">We only ask for the month and year they were born — never the full date.</p>
              <label className="ba-lbl" htmlFor="cp-name">First name</label>
              <input id="cp-name" className="ba-field" value={name} maxLength={30} autoComplete="off"
                onChange={(e) => setName(e.target.value)} style={{ marginBottom: 18 }} />
              <p className="ba-lbl">Born in</p>
              <div className="cp-row2">
                <select className="ba-field" aria-label="Birth month" value={month ?? ""} onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : null)}>
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </select>
                <select className="ba-field" aria-label="Birth year" value={year ?? ""} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : null)}>
                  <option value="">Year</option>
                  {Array.from({ length: 26 }, (_, i) => thisYear - i).map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              {prefill.ageLabel && prefill.birthYear && (
                <p className="ba-note">You told us earlier they're {prefill.ageLabel.toLowerCase()}, so we've picked a year — change it if it's not right.</p>
              )}
            </>
          )}

          {step === 3 && (
            <div className="cp-done">
              <div className="cp-preview"><StarlingAvatar look={look} size={104} label={`${shown}'s starling`} /></div>
              <h2>{name.trim() ? `${name.trim()}'s profile is ready` : "Your child's profile is ready"}</h2>
              <p className="ba-hint" style={{ marginBottom: 0 }}>
                {prefill.found ? "We've added what you told us earlier. " : ""}Fill in the rest whenever you like — a little at a time is fine.
              </p>
              <ResearchConsent name={name.trim()} checked={research} onChange={setResearch} />
            </div>
          )}
        </div>

        <div className="ba-qfoot">
          {step === 0 && <button className="ba-btn ba-btn-primary" disabled={!consent} onClick={() => setStep(1)}>Continue</button>}
          {step === 1 && <button className="ba-btn ba-btn-primary" onClick={() => setStep(2)}>Continue</button>}
          {step === 2 && <button className="ba-btn ba-btn-primary" disabled={!name.trim()} onClick={finishDetails}>Create profile</button>}
          {step === 3 && <button className="ba-btn ba-btn-primary" onClick={openProfile}>Open {name.trim() ? `${name.trim()}'s` : "the"} profile</button>}
        </div>
      </div>
    </div>
  );
};

export default ChildSetupPage;
