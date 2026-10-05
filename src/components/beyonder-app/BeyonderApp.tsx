import { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BirdCanvas from "@/components/BirdCanvas";
import { useAuth } from "@/context/AuthContext";
import { getActiveProviders, getProvider, type EditableProvider } from "@/data/providerStore";
import { addEnquiry } from "@/data/enquiryStore";
import {
  AGES, NEEDS, HELP, Q, FLOW, REGIONS, CATCARDS, SPECS, CATS, CAT_TYPE, REGION_DIRECTORY_NAME, NEED_KEYWORDS,
  type QKey, type Path, type Fmt, type Specialist,
} from "./data";
import { MAP } from "./ukMap";
import AboutSheet from "./AboutSheet";
import MenuSheet from "./MenuSheet";
import AppNav, { type Tab } from "./AppNav";
import StarlingTip from "./StarlingTip";
import "./beyonderApp.css";

type ScreenId = "home" | "q" | "consult" | "areas" | "find" | "enquiry" | "sent" | "profile";

interface State {
  path: Path; step: number; editKey: QKey | null;
  age: string | null; needs: string[]; help: string | null;
  area: string; region: string | null; fmt: Fmt; cat: string;
  child: string; msg: string; msgEdited: boolean; saved: boolean;
  target: { kind: "book" | "enq"; id: string } | null;
}

const STORE_KEY = "beyonder-app-state";
const freshState = (): State => ({
  path: "consult", step: 0, editKey: null, age: null, needs: [], help: null, area: "", region: null,
  fmt: "video", cat: "all", child: "", msg: "", msgEdited: false, saved: false, target: null,
});
// Answers are kept for this browser tab so leaving (e.g. to Community) and coming back keeps them.
const loadState = (): State => {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (raw) {
      const s: State = { ...freshState(), ...JSON.parse(raw) };
      if (s.region && !REGIONS[s.region]) s.region = null; // map is England only
      return s;
    }
  } catch { /* unavailable */ }
  return freshState();
};
const saveState = (s: State) => { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch { /* unavailable */ } };

// The England map is stretched slightly wider so it fills the phone screen.
const SX = 1.12;

const listText = (a: string[]) => (a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]);
const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const Chevron = ({ d = "M9 6l6 6-6 6" }: { d?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);

interface Props {
  /** Rendered inside the normal page layout (the /start page) instead of full screen. */
  embedded?: boolean;
}

const BeyonderApp = ({ embedded = false }: Props) => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [findQ, setFindQ] = useState("");

  const S = useRef<State>(loadState()).current;
  const [, force] = useReducer((x: number) => x + 1, 0);
  const update = () => { saveState(S); force(); };

  const screens = useRef<Partial<Record<ScreenId, HTMLElement | null>>>({});
  const setScreen = (id: ScreenId) => (el: HTMLElement | null) => { screens.current[id] = el; };
  const current = useRef<ScreenId>("home");
  const hist = useRef<ScreenId[]>(["home"]);
  const reveal = useRef(false);

  const [active, setActive] = useState<ScreenId>("home");
  const [sheet, setSheet] = useState<null | "about" | "menu">(null);
  const [intro, setIntro] = useState(true);
  const [enqKey, setEnqKey] = useState(0);
  const [enqErr, setEnqErr] = useState("");
  const [sent, setSent] = useState<{ book: boolean; title: string; body: string } | null>(null);
  const [addChildLabel, setAddChildLabel] = useState("Add another child");

  const qBodyRef = useRef<HTMLDivElement>(null);
  const areasScroll = useRef<HTMLDivElement>(null);
  const catsecRef = useRef<HTMLDivElement>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLInputElement>(null);
  const saveRef = useRef<HTMLInputElement>(null);

  // ── Browser history: the phone's back button steps back through screens ──
  const pushed = useRef(0);
  const skipPops = useRef(0);
  const initialising = useRef(true);
  const mountPath = useRef(typeof window !== "undefined" ? window.location.pathname : "/");
  const syncHistory = () => {
    const want = hist.current.length - 1;
    // The first screen of /start is the page itself, not an extra history step.
    if (initialising.current && embedded) { pushed.current = want; return; }
    if (pushed.current > want) {
      skipPops.current++;
      window.history.go(want - pushed.current);
      pushed.current = want;
    }
    while (pushed.current < want) {
      window.history.pushState(window.history.state, "");
      pushed.current++;
    }
  };

  // ── Navigation ─────────────────────────────────────────────────────────
  function afterShow(id: ScreenId, next: HTMLElement, dir: number) {
    setActive(id);
    const sc = next.querySelector<HTMLElement>(".ba-scroll");
    if (sc && dir > 0) sc.scrollTop = 0;
  }
  function show(id: ScreenId, dir = 1, instant = false) {
    if (embedded && id === "home") { navigate("/"); return; }
    const next = screens.current[id];
    if (!next || id === current.current) return;
    const prev = screens.current[current.current];
    current.current = id;
    if (instant || !prev) {
      reveal.current = false;
      prev?.classList.remove("ba-on");
      next.classList.add("ba-on");
      afterShow(id, next, dir);
      return;
    }
    if (reveal.current && !reduce) {
      // Slow, gentle fade from the home screen
      reveal.current = false;
      next.style.transition = "none"; next.style.transform = "none"; next.style.opacity = "0"; next.style.zIndex = "3";
      next.classList.add("ba-on"); void next.offsetWidth;
      next.style.transition = "opacity 1.1s cubic-bezier(.4,0,.2,1)"; next.style.opacity = "1";
      prev.style.transition = "opacity .9s cubic-bezier(.4,0,.2,1)"; prev.style.opacity = "0";
      const sc = next.querySelector<HTMLElement>(".ba-scroll"); if (sc) sc.scrollTop = 0;
      setTimeout(() => {
        prev.classList.remove("ba-on"); prev.style.transition = ""; prev.style.opacity = "";
        next.style.transition = ""; next.style.zIndex = "";
        afterShow(id, next, 1);
      }, 1150);
      return;
    }
    reveal.current = false;
    // Calm crossfade with a slight drift
    next.style.transition = "none"; next.style.transform = `translateX(${dir * 14}px)`; next.style.opacity = "0";
    next.classList.add("ba-on"); void next.offsetWidth; next.style.transition = "";
    next.style.transform = "none"; next.style.opacity = "1";
    prev.style.transform = `translateX(${-dir * 14}px)`; prev.style.opacity = "0";
    setTimeout(() => { prev.classList.remove("ba-on"); prev.style.transform = ""; prev.style.opacity = ""; }, reduce ? 0 : 700);
    afterShow(id, next, dir);
  }
  function go(id: ScreenId) { hist.current.push(id); syncHistory(); show(id, 1); }
  function back(fromBrowser = false) {
    if (embedded && hist.current.length <= 2) { navigate("/"); return; }
    if (hist.current.length > 1) {
      hist.current.pop();
      if (!fromBrowser) syncHistory();
      show(hist.current[hist.current.length - 1], -1);
    }
  }
  function tab(id: Tab, instant = false) {
    if (id === "community") { navigate("/community"); return; }
    if (embedded && id === "home") { navigate("/"); return; }
    if (id === "home") { hist.current = ["home"]; syncHistory(); show("home", -1, instant); return; }
    if (id === "find" && !S.region) { hist.current = ["home", "areas"]; syncHistory(); show("areas", 1, instant); return; }
    if (id === "profile") setAddChildLabel("Add another child");
    hist.current = ["home", id]; syncHistory(); show(id, 1, instant);
  }

  // ── Questionnaire ──────────────────────────────────────────────────────
  const answered = (p: Path) => FLOW[p].every((k) => (k === "needs" ? S.needs.length : k === "area" ? true : S[k]));
  function start(path: Path, instant = false) {
    S.path = path; S.step = 0; S.editKey = null; update();
    const push = (id: ScreenId) => { hist.current.push(id); syncHistory(); show(id, 1, instant); };
    // The map always opens with nothing selected.
    if (path === "find") { S.region = null; S.area = ""; update(); push("areas"); return; }
    if (answered(path)) { push(path); return; }
    push("q");
  }
  const curKey = (): QKey => S.editKey || FLOW[S.path][S.step];
  function pick(v: string) {
    const k = curKey(), q = Q[k];
    if (q.type === "multi") {
      if (v === "unsure") S.needs = S.needs.includes("unsure") ? [] : ["unsure"];
      else { S.needs = S.needs.filter((n) => n !== "unsure"); S.needs = S.needs.includes(v) ? S.needs.filter((n) => n !== v) : [...S.needs, v]; }
      update(); return;
    }
    (S as unknown as Record<string, string>)[k] = v;
    update();
    if (!S.editKey) setTimeout(qNext, reduce ? 0 : 450);
  }
  function renderEnquiry() { setEnqKey((n) => n + 1); setEnqErr(""); }
  function qNext() {
    if (S.editKey) { S.editKey = null; update(); renderEnquiry(); back(); return; }
    if (S.step < FLOW[S.path].length - 1) { S.step++; update(); return; }
    finishQ();
  }
  function finishQ() {
    hist.current.pop();
    if (hist.current[hist.current.length - 1] === S.path) { syncHistory(); show(S.path, -1); }
    else go(S.path);
  }
  function qBack() {
    if (S.editKey || S.step === 0) { S.editKey = null; update(); back(); return; }
    S.step--; update();
  }
  useLayoutEffect(() => { if (qBodyRef.current) qBodyRef.current.scrollTop = 0; }, [S.path, S.step, S.editKey]);

  // ── Shared helpers ─────────────────────────────────────────────────────
  const needText = () => listText(S.needs.filter((n) => n !== "unsure").map((n) => NEEDS[n].toLowerCase()));
  const score = (p: { tags: string[] }) => p.tags.filter((t) => S.needs.includes(t)).length;
  const providerScore = (p: EditableProvider) => {
    const text = [...p.needsSupported, ...p.searchTags, p.description, p.shortDescription, p.typeBadge].join(" ").toLowerCase();
    return S.needs.filter((n) => (NEED_KEYWORDS[n] || []).some((w) => text.includes(w))).length;
  };
  const placeName = () => S.area.trim() || (S.region ? REGIONS[S.region][0] : "");
  const toggleNeed = (n: string) => {
    S.needs = S.needs.filter((x) => x !== "unsure");
    S.needs = S.needs.includes(n) ? S.needs.filter((x) => x !== n) : [...S.needs, n];
    update();
  };

  // ── Area picker ────────────────────────────────────────────────────────
  function glideTo(el: HTMLElement | null) {
    const sc = areasScroll.current; if (!sc || !el) return;
    const from = sc.scrollTop, to = el.offsetTop - sc.offsetTop, dist = to - from;
    if (reduce || !dist) { sc.scrollTop = to; return; }
    // Short ease-out: moves immediately, settles gently.
    const dur = 420, t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => { const t = Math.min(1, (now - t0) / dur); sc.scrollTop = from + dist * ease(t); if (t < 1) requestAnimationFrame(step); };
    step(t0);
  }
  function pickRegion(k: string) {
    S.region = k; S.area = ""; update();
    requestAnimationFrame(() => glideTo(catsecRef.current));
  }

  // ── Enquiry ────────────────────────────────────────────────────────────
  type Target = { first: string; name: string; spec?: Specialist; prov?: EditableProvider };
  const target = (): Target | null => {
    if (!S.target) return null;
    if (S.target.kind === "book") {
      const spec = SPECS.find((sp) => sp.id === S.target!.id);
      return spec ? { first: spec.first, name: spec.name, spec } : null;
    }
    const prov = getProvider(S.target.id);
    return prov ? { first: prov.businessName, name: prov.businessName, prov } : null;
  };
  function draftMsg() {
    const t = target()!, who = S.child.trim() || "my child", nt = needText();
    let m = `Hi ${t.first},\n\nI’m looking for support for ${who}${S.age ? `, who is ${AGES[S.age].toLowerCase()}` : ""}.`;
    if (nt) m += ` The main areas we’re finding hard at the moment are ${S.needs.filter((n) => n !== "unsure").map((n) => NEEDS[n].toLowerCase()).join(", ")}.`;
    else if (S.needs.includes("unsure")) m += ` We’re not sure yet what’s behind the difficulties.`;
    if (S.target?.kind === "book" && S.help) m += ` I’m hoping for: ${HELP[S.help].toLowerCase()}.`;
    if (S.target?.kind === "enq") m += ` Could you tell me more about what you offer and whether you have space?`;
    return m + `\n\nThank you.`;
  }
  function openTarget(kind: "book" | "enq", id: string) {
    S.target = { kind, id }; S.msgEdited = false; update(); renderEnquiry(); go("enquiry");
  }
  function send() {
    const t = target()!, book = S.target?.kind === "book";
    // Enquiries go to the real provider, so they follow the directory's rules: parents only, signed in.
    if (!book && !isAuthenticated) {
      setEnqErr("Please sign in with your parent account to send this enquiry. Your answers will be kept.");
      return;
    }
    if (!book && user?.role !== "parent") {
      setEnqErr("Enquiries are for families. Provider and admin accounts can’t send enquiries.");
      return;
    }
    if (!shareRef.current?.checked) {
      setEnqErr(`Tick the first box to share these details with ${t.first}, then ${book ? "request the booking" : "send"} again.`);
      return;
    }
    S.saved = !!saveRef.current?.checked; update();
    if (!book && t.prov) {
      const today = new Date().toISOString().split("T")[0];
      const ageText = S.age ? AGES[S.age] : "";
      addEnquiry({
        enquiryId: crypto.randomUUID(),
        providerId: t.prov.id,
        providerName: t.prov.businessName,
        parentId: user?.id ?? "parent-test",
        parentName: user?.name ?? "Guest",
        childAge: ageText,
        childName: S.child.trim(),
        needs: S.needs.map((n) => NEEDS[n]).join(", "),
        message: S.msg.trim(),
        reply: null,
        messages: [{ messageId: crypto.randomUUID(), senderId: "parent", senderName: user?.name ?? "Guest", text: S.msg.trim(), sentAt: today }],
        statusForParent: "sent",
        statusForProvider: "new",
        createdAt: today,
        isUnlocked: false,
        messageCount: 1,
        providerNotes: "",
        customAnswers: [],
      });
    }
    const slot = t.spec?.slot ?? "";
    setSent({
      book,
      title: book ? "Booking requested" : "Enquiry sent",
      body: `${book ? `${t.first} will confirm your ${slot.toLowerCase()} call shortly.` : `${t.name} usually replies within two working days.`} You’ll get a message in Beyonder and by email.${S.saved ? " Your child’s details are saved to your profile." : ""}`,
    });
    hist.current = ["home", "sent"]; syncHistory(); show("sent", 1);
  }

  // ── Sheets ─────────────────────────────────────────────────────────────
  const openSheet = (n: "about" | "menu") => setSheet(n);
  const closeSheets = () => setSheet(null);

  // ── Effects ────────────────────────────────────────────────────────────
  useLayoutEffect(() => {
    // Initial screen. Deep links: ?start=consult|find runs a flow, ?tab=consult|find|profile opens a tab.
    const startParam = params.get("start");
    const tabParam = params.get("tab");
    if (startParam || tabParam) {
      const next = new URLSearchParams(params); next.delete("start"); next.delete("tab");
      setParams(next, { replace: true });
    }
    if (!embedded) { screens.current.home?.classList.add("ba-on"); }
    if (startParam === "consult" || startParam === "find") start(startParam, true);
    else if (tabParam === "consult" || tabParam === "find" || tabParam === "profile") tab(tabParam, true);
    else if (embedded) start("consult", true);
    initialising.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onPop = () => {
      // Ignore history moves that leave this page; the router handles those.
      if (window.location.pathname !== mountPath.current) return;
      if (skipPops.current > 0) { skipPops.current--; return; }
      if (pushed.current > 0) pushed.current--;
      setSheet(null);
      if (hist.current.length > 1) back(true);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeSheets(); };
    window.addEventListener("popstate", onPop);
    document.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("popstate", onPop); document.removeEventListener("keydown", onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render pieces ──────────────────────────────────────────────────────
  const tabId = active === "areas" ? "find" : active;
  const navShown = ["consult", "find", "profile"].includes(tabId);
  const menuBtn = (
    <button className="ba-iconbtn" onClick={() => { closeSheets(); openSheet("menu"); }} aria-label="Open menu"><MenuIcon /></button>
  );
  const logoBar = (<div className="ba-bar"><div className="ba-logo"><i />Beyonder</div>{menuBtn}</div>);

  // Questionnaire
  const k = curKey(), q = Q[k], flow = FLOW[S.path], edit = !!S.editKey;
  const needBtn = q.type !== "single" || edit;

  // Consult results
  const nt = needText();
  const specList = SPECS.filter((s) => s.fmt.includes(S.fmt)).sort((a, b) => score(b) - score(a));

  // Find results
  // Same rules as the directory (ProviderDirectory): region match, but online services and product sellers
  // show everywhere; category by provider type; search across name, type, needs and descriptions.
  const regionName = S.region ? REGION_DIRECTORY_NAME[S.region].toLowerCase() : "";
  const fq = findQ.trim().toLowerCase();
  const provList = getActiveProviders()
    .filter((p) => !regionName || p.category_type === "product" || p.deliveryFormat === "online" || !!p.region?.toLowerCase().includes(regionName))
    .filter((p) => S.cat === "all" || p.type === CAT_TYPE[S.cat])
    .filter((p) => !fq || [p.businessName, p.description, p.shortDescription, p.typeBadge, ...p.needsSupported, ...p.searchTags]
      .some((x) => x.toLowerCase().includes(fq)))
    .map((p, i) => ({ p, i, sc: providerScore(p) }))
    .sort((a, b) => b.sc - a.sc || a.i - b.i)
    .map((x) => x.p);
  const where = placeName();

  // Enquiry
  const t = target();
  const hasTarget = !!t;
  const book = S.target?.kind === "book";
  if (hasTarget && !S.msgEdited) S.msg = draftMsg();
  const enqRows: [string, string, string][] = [
    ["age", "Age", S.age ? AGES[S.age] : "Not added"],
    ["needs", "Finding hard", S.needs.length ? S.needs.map((n) => NEEDS[n]).join(", ") : "Not added"],
    book ? ["help", "Looking for", S.help ? HELP[S.help] : "Not added"] : ["", "Area", placeName() || "Not added"],
  ];

  return (
    <div className={`ba-root ba-app${embedded ? " ba-embedded" : ""}`}>

      {/* HOME: one screen, one decision */}
      {!embedded && (
        <section className="ba-screen ba-home" ref={setScreen("home")} aria-label="Home">
          <BirdCanvas />
          <div className="ba-home-overlay" />
          <div className="ba-bar ba-clear">
            <div className="ba-logo"><i />Beyonder</div>
            <button className="ba-iconbtn" onClick={() => openSheet("menu")} aria-label="Open menu"><MenuIcon /></button>
          </div>
          <div className="ba-hero">
            <h1>Talk to someone who understands.</h1>
            <p>SEND specialists by video, phone or chat, and trusted support close to home.</p>
            <div
              className={`ba-choices${intro ? " ba-intro" : ""}`}
              onAnimationEnd={(e) => { if ((e.target as HTMLElement).classList.contains("ba-choice-alt")) setIntro(false); }}
            >
              <button className="ba-choice ba-choice-main" onClick={() => { reveal.current = true; start("consult"); }}>
                <span><strong>Live consultation</strong><small>Speak to a specialist at a time that suits you</small></span>
                <Chevron />
              </button>
              <button className="ba-choice ba-choice-alt" onClick={() => { reveal.current = true; start("find"); }}>
                <span><strong>Find local support</strong><small>Therapists, clubs and services near you</small></span>
                <Chevron />
              </button>
            </div>
            <button className="ba-howlink" onClick={() => openSheet("about")}>Built by SEND parents. See how Beyonder works</button>
          </div>
        </section>
      )}

      {/* QUESTIONNAIRE */}
      <section className="ba-screen" ref={setScreen("q")} aria-label="A few questions">
        <div className="ba-qtop">
          <button className="ba-iconbtn" onClick={qBack} aria-label="Back"><Chevron d="M15 6l-6 6 6 6" /></button>
          <div className="ba-progress">
            {!edit && flow.map((_, i) => (
              <span key={i} className={`${i <= S.step ? "ba-done" : ""} ${i === S.step ? "ba-now" : ""}`} />
            ))}
          </div>
          <button className="ba-skip" style={edit ? { visibility: "hidden" } : undefined} onClick={finishQ}>Skip</button>
        </div>
        <div className="ba-qbody" ref={qBodyRef}>
          {!edit && <p className="ba-qcount">Question {S.step + 1} of {flow.length}</p>}
          <h2 id="ba-qh">{q.title}</h2>
          <p className="ba-hint">{q.hint}</p>
          {q.type === "area" ? (
            <input
              className="ba-field" placeholder="For example, Southampton or SO14" value={S.area}
              aria-labelledby="ba-qh" autoComplete="postal-code"
              onChange={(e) => { S.area = e.target.value; update(); }}
              onKeyDown={(e) => { if (e.key === "Enter") qNext(); }}
            />
          ) : (
            <div className={`ba-opts${q.grid ? " ba-grid" : ""}`} role="group" aria-labelledby="ba-qh">
              {Object.entries(q.opts!).map(([v, l]) => {
                const on = q.type === "multi" ? S.needs.includes(v) : (S as unknown as Record<string, string | null>)[k] === v;
                return (
                  <button key={v} className="ba-opt" aria-pressed={on} onClick={() => pick(v)}>
                    <span>{l}</span><span className="ba-tick" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="ba-qfoot">
          {needBtn && (
            <button className="ba-btn ba-btn-primary" onClick={qNext} disabled={k === "needs" && !S.needs.length}>
              {edit ? "Save" : "Continue"}
            </button>
          )}
        </div>
      </section>

      {/* CONSULT RESULTS */}
      <section className="ba-screen" ref={setScreen("consult")} aria-label="Live consultations">
        {logoBar}
        <div className="ba-scroll"><div className="ba-pad">
          <div className="ba-lead">
            <h2>{S.needs.length && nt ? `Specialists for ${nt}` : "Specialists available this week"}</h2>
            <p>{S.age ? `For a child aged ${AGES[S.age].toLowerCase()}. ` : ""}Choose how you’d like to talk.</p>
          </div>
          <div className="ba-chips" role="group" aria-label="Filter by need">
            {Object.entries(NEEDS).filter(([key]) => key !== "unsure").map(([key, l]) => (
              <button key={key} className="ba-chip" aria-pressed={S.needs.includes(key)} onClick={() => toggleNeed(key)}>{l}</button>
            ))}
          </div>
          <div className="ba-seg" role="group" aria-label="How you’d like to talk">
            {(["video", "phone", "chat"] as Fmt[]).map((f) => (
              <button key={f} aria-pressed={S.fmt === f} onClick={() => { S.fmt = f; update(); }}>{f[0].toUpperCase() + f.slice(1)}</button>
            ))}
          </div>
          {!S.age && !S.needs.length && (
            <div className="ba-empty" style={{ marginBottom: 14 }}>
              Answer three quick questions and we’ll show the best matches first.<br /><br />
              <button className="ba-btn ba-btn-primary ba-btn-small" style={{ margin: "0 auto" }} onClick={() => { closeSheets(); start("consult"); }}>Start</button>
            </div>
          )}
          <div className="ba-list">
            {specList.length ? specList.map((s) => {
              const fit = s.tags.filter((tg) => S.needs.includes(tg)).map((tg) => NEEDS[tg].toLowerCase());
              return (
                <article key={s.id} className="ba-spec">
                  <div className="ba-spec-top">
                    <div className="ba-av" aria-hidden="true">{s.ini}</div>
                    <div><h3>{s.name}</h3><p className="ba-role">{s.role}</p></div>
                  </div>
                  <p className="ba-focus">{s.focus}</p>
                  {fit.length > 0 && <span className="ba-fit">Good fit for {listText(fit)}</span>}
                  <div className="ba-slot">
                    <div><b>Next free: {s.slot}</b><span>{s.price}</span></div>
                    <button className="ba-btn ba-btn-primary ba-btn-small" onClick={() => openTarget("book", s.id)}>Book this time</button>
                  </div>
                </article>
              );
            }) : <div className="ba-empty">No specialists offer {S.fmt} this week. Try video or phone.</div>}
          </div>
        </div></div>
      </section>

      {/* AREA + CATEGORY PICKER */}
      <section className="ba-screen" ref={setScreen("areas")} aria-label="Find local support">
        <div className="ba-bar">
          <button className="ba-iconbtn" onClick={() => back()} aria-label="Back"><Chevron d="M15 6l-6 6 6 6" /></button>
          <div className="ba-bar-title">Find local support</div>
        </div>
        <div className="ba-scroll" ref={areasScroll}><div className="ba-pad">
          <div className="ba-mapview">
            <div className="ba-lead"><h2>Where are you looking?</h2></div>
            <div className="ba-mapbox" ref={mapBoxRef}>
              <svg viewBox={`${MAP.box.x * SX - 4} ${MAP.box.y - 4} ${MAP.box.w * SX + 8} ${MAP.box.h + 8}`} role="group" aria-label="Map of England regions">
                <g transform={`scale(${SX} 1)`}>
                {Object.keys(MAP.d).map((rk) => (
                  <path
                    key={rk} className="ba-rg" d={MAP.d[rk]} style={{ ["--c" as string]: MAP.tone[rk] }}
                    role="button" tabIndex={0} aria-label={REGIONS[rk][0]} aria-pressed={S.region === rk}
                    onClick={() => pickRegion(rk)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickRegion(rk); } }}
                  />
                ))}
                <circle cx="245" cy="409" r="6" fill="transparent" style={{ cursor: "pointer" }} aria-hidden="true" onClick={() => pickRegion("lo")} />
                </g>
                {Object.keys(MAP.d).map((rk) => {
                  const [x, y] = MAP.lab[rk];
                  return (
                    <text key={rk} className={`ba-mlabel${S.region === rk ? " ba-on" : ""}`} x={x * SX} y={y}
                      {...(rk === "lo" ? { textAnchor: "start", style: { textAnchor: "start" } } : {})}>
                      {REGIONS[rk][1]}
                    </text>
                  );
                })}
              </svg>
            </div>
            <div className="ba-maprow">
              {S.region
                ? <span><span className="ba-dot" /><b>{REGIONS[S.region][0]}</b></span>
                : <span style={{ color: "var(--ba-muted)" }}>Tap your region on the map</span>}
              <button className="ba-uselocation" onClick={() => { pickRegion("se"); S.area = "Southampton"; update(); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /><circle cx="12" cy="12" r="7" /></svg>
                Use my location
              </button>
            </div>
            <button className="ba-allengland" onClick={() => { S.region = null; S.area = ""; S.cat = "all"; update(); go("find"); }}>
              Show all of England
            </button>
            <button className="ba-more" onClick={() => glideTo(catsecRef.current)}>
              Choose the kind of support
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          </div>
          <div className="ba-catsec" ref={catsecRef}>
            <div className="ba-lead">
              <h2 style={{ fontSize: 23 }}>What kind of support?</h2>
              {S.region && <p>Looking in {REGIONS[S.region][0]}.</p>}
            </div>
            <div className="ba-cats">
              {CATCARDS.map((c) => (
                <button key={c.k} className={`ba-cat${c.wide ? " ba-wide" : ""}`} onClick={() => { S.cat = c.k; update(); go("find"); }}>
                  <div className="ba-cat-icon" aria-hidden="true"><object data={c.icon} type="image/svg+xml" tabIndex={-1} aria-hidden="true" /></div>
                  <strong>{c.t}</strong><small>{c.d}</small>
                </button>
              ))}
            </div>
            <button className="ba-browse" onClick={() => { S.cat = "all"; update(); go("find"); }}>
              Browse all support{S.region ? ` in ${REGIONS[S.region][0]}` : ""}
            </button>
            <p className="ba-credit">Map contains National Statistics data © Crown copyright and database right.</p>
          </div>
        </div></div>
        <StarlingTip
          id="map" text="Choose your location — tap your area on the map." active={active === "areas" && !S.region}
          container={() => screens.current.areas ?? null} target={() => mapBoxRef.current} yAt={0.32} dismissKey={S.region}
        />
      </section>

      {/* FIND RESULTS */}
      <section className="ba-screen" ref={setScreen("find")} aria-label="Find local support">
        {logoBar}
        <div className="ba-searchhead">
          <div className="ba-sbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4-4" /></svg>
            <input type="search" placeholder="OT, speech therapy, clubs" aria-label="Search support" value={findQ} onChange={(e) => setFindQ(e.target.value)} />
            <button className="ba-region" onClick={() => {
              if (hist.current[hist.current.length - 2] === "areas") back();
              else { hist.current = ["home", "areas"]; syncHistory(); show("areas", -1); }
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21s-6-5.5-6-11a6 6 0 1112 0c0 5.5-6 11-6 11z" /><circle cx="12" cy="10" r="2" /></svg>
              <span>{S.area.trim() || (S.region ? REGIONS[S.region][1] : "All England")}</span>
            </button>
            {(S.region || S.area.trim()) && (
              <button className="ba-region-clear" aria-label="Clear region and show all of England" onClick={() => { S.region = null; S.area = ""; update(); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            )}
          </div>
        </div>
        <div className="ba-scroll"><div className="ba-pad" style={{ paddingTop: 4 }}>
          <div className="ba-chips" role="group" aria-label="Type of support">
            {Object.entries(CATS).map(([ck, l]) => (
              <button key={ck} className="ba-chip" aria-pressed={S.cat === ck} onClick={() => { S.cat = ck; update(); }}>{l}</button>
            ))}
          </div>
          <div className="ba-lead" style={{ marginBottom: 16 }}>
            <h2 style={{ fontSize: 23 }}>
              {S.cat !== "all" ? CATS[S.cat] + " " : "Support "}{where ? `${S.area.trim() ? "near" : "in"} ${where}` : "across England"}
            </h2>
            {nt && <p>Best matches for {nt} first.</p>}
          </div>
          {!S.age && !S.needs.length && (
            <div className="ba-nudge">
              <p>Tell us your child’s age and what they find hard, and we’ll put the best matches first.</p>
              <button className="ba-btn ba-btn-primary ba-btn-small" onClick={() => { S.path = "find"; S.step = 0; S.editKey = null; update(); go("q"); }}>Answer 2 questions</button>
            </div>
          )}
          <div className="ba-list">
            {provList.length ? provList.map((p) => (
              <article key={p.id} className="ba-prov">
                <p className="ba-prov-type">{p.typeBadge}</p>
                <h3><button className="ba-prov-name" onClick={() => navigate(`/provider/${p.id}`)}>{p.businessName}</button></h3>
                <p>{p.shortDescription}</p>
                <div className="ba-meta">
                  <span>{p.deliveryFormat === "online" ? "Online" : p.location}</span>
                  <button className="ba-btn ba-btn-outline" onClick={() => openTarget("enq", p.id)}>Enquire</button>
                </div>
              </article>
            )) : <div className="ba-empty">Nothing listed here yet. Try another type of support or region.</div>}
          </div>
        </div></div>
        {provList.length > 0 && (
          <StarlingTip
            id="provider-name" text="Tap a name to see their full profile." active={active === "find"} align="start"
            container={() => screens.current.find ?? null}
            target={() => screens.current.find?.querySelector<HTMLElement>(".ba-prov-name") ?? null}
          />
        )}
      </section>

      {/* ENQUIRY / BOOKING */}
      <section className="ba-screen" ref={setScreen("enquiry")} aria-label="Enquiry">
        <div className="ba-bar">
          <button className="ba-iconbtn" onClick={() => back()} aria-label="Back"><Chevron d="M15 6l-6 6 6 6" /></button>
          <div className="ba-bar-title">{t ? (book ? `Book a call with ${t.first}` : `Enquire with ${t.name}`) : ""}</div>
        </div>
        <div className="ba-scroll"><div className="ba-pad" style={{ paddingBottom: 40 }} key={enqKey}>
          {t && (
            <>
              {book && t.spec && (
                <div className="ba-card" style={{ padding: "16px 18px" }}>
                  <dt className="ba-role">Your call</dt>
                  <dd style={{ fontWeight: 700, marginTop: 3, marginLeft: 0 }}>{t.spec.slot}, by {S.fmt}</dd>
                  <p className="ba-role" style={{ marginTop: 3 }}>{t.spec.price}</p>
                </div>
              )}
              <div className="ba-card"><h3>About your child</h3><dl>
                {enqRows.map(([ek, l, v]) => (
                  <div className="ba-row" key={l}>
                    <div><dt>{l}</dt><dd>{v}</dd></div>
                    {ek && <button className="ba-change" aria-label={`Change ${l.toLowerCase()}`} onClick={() => { S.editKey = ek as QKey; update(); go("q"); }}>Change</button>}
                  </div>
                ))}
              </dl></div>
              <label className="ba-lbl" htmlFor="ba-childIn">Child’s first name <span style={{ fontWeight: 400, color: "var(--ba-muted)" }}>(optional)</span></label>
              <input className="ba-field" id="ba-childIn" value={S.child} autoComplete="off" style={{ marginBottom: 18 }}
                onChange={(e) => { S.child = e.target.value; update(); }} />
              <label className="ba-lbl" htmlFor="ba-msgIn">Your message</label>
              <textarea className="ba-field" id="ba-msgIn" value={S.msg}
                onChange={(e) => { S.msg = e.target.value; S.msgEdited = true; update(); }} />
              <p className="ba-note">We’ve written this from your answers. Change anything you like.</p>
              <label className="ba-consent"><input type="checkbox" ref={shareRef} /><span>Share these details with {t.first} so they can reply.</span></label>
              <label className="ba-consent"><input type="checkbox" ref={saveRef} defaultChecked={S.saved} /><span>Save my child’s details to my Beyonder profile so I don’t have to type them again. You can delete them at any time.</span></label>
              <p className="ba-err" role="alert">{enqErr}</p>
              {enqErr && !isAuthenticated && (
                <button className="ba-btn ba-btn-ghost" style={{ marginTop: 8 }} onClick={() => navigate(`/login?redirect=${encodeURIComponent(embedded ? "/start?tab=find" : "/?tab=find")}`)}>Sign in</button>
              )}
              <button className="ba-btn ba-btn-primary" style={{ marginTop: 8 }} onClick={send}>{book ? "Request booking" : "Send enquiry"}</button>
            </>
          )}
        </div></div>
      </section>

      {/* SENT */}
      <section className="ba-screen" ref={setScreen("sent")} aria-label="Sent">
        <div className="ba-sent">
          {sent && (
            <>
              <svg viewBox="0 0 200 110" aria-hidden="true">
                <circle cx="138" cy="40" r="20" fill="#F6D5C5" />
                <path d="M0 92c30-20 55-30 85-18s50 2 70-10 35-6 45 2v44H0z" fill="#B9C7D6" />
                <path d="M0 100c40-14 70-10 100-2s60 2 100-8v20H0z" fill="#8FA6BF" />
                <path d="M40 70l25-18M65 52l-6 1M65 52l-1 6" stroke="#D98A6A" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 4" />
                <path d="M60 30l5 3 5-3M78 22l4 2 4-2M92 34l3 2 3-2" stroke="#1B1A35" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </svg>
              <h2>{sent.title}</h2>
              <p>{sent.body}</p>
              <div className="ba-stack">
                <button className="ba-btn ba-btn-primary" onClick={() => tab("home")}>Back to home</button>
                <button className="ba-btn ba-btn-ghost" onClick={() => tab("profile")}>View your child’s profile</button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* PROFILE */}
      <section className="ba-screen" ref={setScreen("profile")} aria-label="Your child's profile">
        {logoBar}
        <div className="ba-scroll"><div className="ba-pad">
          <div className="ba-lead" style={{ marginBottom: 20 }}>
            <h2>Your child’s profile</h2>
            <p>We use this to show the right support first and to fill in enquiries for you.</p>
          </div>
          {!(S.age || S.needs.length) ? (
            <div className="ba-empty">
              Nothing here yet. Answer three short questions and we’ll remember them for your next enquiry.<br /><br />
              <button className="ba-btn ba-btn-primary ba-btn-small" style={{ margin: "0 auto" }} onClick={() => { closeSheets(); start("consult"); }}>Start</button>
            </div>
          ) : (
            <>
              <div className="ba-card"><h3>{S.child.trim() || "Your child"}</h3><dl>
                <div className="ba-row"><div><dt>Age</dt><dd>{S.age ? AGES[S.age] : "Not added"}</dd></div></div>
                <div className="ba-row"><div><dt>Finding hard</dt><dd>{S.needs.length ? S.needs.map((n) => NEEDS[n]).join(", ") : "Not added"}</dd></div></div>
                {S.help && <div className="ba-row"><div><dt>Looking for</dt><dd>{HELP[S.help]}</dd></div></div>}
                {placeName() && <div className="ba-row"><div><dt>Area</dt><dd>{placeName()}</dd></div></div>}
                <div className="ba-row"><div><dt>Likes and interests</dt><dd style={{ fontWeight: 400, color: "var(--ba-muted)" }}>Add these to help us suggest clubs and activities</dd></div></div>
              </dl></div>
              <p className="ba-note" style={{ margin: "-6px 0 20px" }}>
                {S.saved ? "Saved to your account. Only shared when you send an enquiry." : "Kept on this device only. It’s saved to your account when you choose to, while sending an enquiry."}
              </p>
              <div className="ba-stack">
                <button className="ba-btn ba-btn-ghost" onClick={() => { closeSheets(); S.path = "consult"; S.step = 0; S.editKey = null; update(); go("q"); }}>Update answers</button>
                <button className="ba-btn ba-btn-ghost" onClick={() => setAddChildLabel("Adding more children is coming next")}>{addChildLabel}</button>
                <button className="ba-change" style={{ margin: "8px auto 0", color: "#A6412A" }} onClick={() => {
                  Object.assign(S, { age: null, needs: [], help: null, area: "", region: null, child: "", saved: false, msgEdited: false });
                  setAddChildLabel("Add another child"); update();
                }}>Delete this profile</button>
              </div>
            </>
          )}
        </div></div>
      </section>

      <AppNav active={tabId as Tab} hidden={!navShown} onTab={(n) => tab(n)} />

      {/* SHEETS */}
      <AboutSheet open={sheet === "about"} onClose={closeSheets} />

      <MenuSheet
        open={sheet === "menu"}
        onClose={closeSheets}
        onProfile={() => tab("profile")}
        onAbout={() => openSheet("about")}
      />
    </div>
  );
};

export default BeyonderApp;
