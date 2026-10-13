import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ChildAnswers } from "@/data/childProfileStore";
import { DIAGNOSIS_STATUS, type DiagnosisStatus, type Group, type Section } from "@/data/childProfileOptions";
import Sheet from "./Sheet";

const clone = (a: ChildAnswers): ChildAnswers => JSON.parse(JSON.stringify(a));
const SEARCH_FROM = 14; // lists longer than this get a search box

interface Props {
  section: Section | null;
  answers: ChildAnswers;
  onSave: (answers: ChildAnswers) => void;
  onClose: () => void;
}

/** One tile's panel: tick from the lists, add your own words, then Save. Closing without saving discards changes. */
const SectionSheet = ({ section, answers, onSave, onClose }: Props) => {
  const [draft, setDraft] = useState<ChildAnswers>(() => clone(answers));
  useEffect(() => { if (section) setDraft(clone(answers)); }, [section, answers]);

  const update = (fn: (d: ChildAnswers) => void) => setDraft((d) => { const n = clone(d); fn(n); return n; });

  return (
    <Sheet
      open={!!section}
      onClose={onClose}
      title={section?.title ?? ""}
      hint={section?.hint}
      footer={<>
        <button className="ba-btn ba-btn-ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="ba-btn ba-btn-primary" style={{ flex: 2 }} onClick={() => onSave(draft)}>Save</button>
      </>}
    >
      {section?.groups.map((g) => (
        <GroupEditor key={g.id} group={g} draft={draft} update={update} showLabel={section.groups.length > 1} />
      ))}
    </Sheet>
  );
};

function GroupEditor({ group: g, draft, update, showLabel }: {
  group: Group; draft: ChildAnswers; update: (fn: (d: ChildAnswers) => void) => void; showLabel: boolean;
}) {
  const [q, setQ] = useState("");
  const [own, setOwn] = useState("");
  const options = (g.options ?? []).filter((o) => !q.trim() || o.label.toLowerCase().includes(q.trim().toLowerCase()));
  const ownList = draft.own[g.id] ?? [];

  const addOwn = () => {
    const v = own.trim().slice(0, 60);
    if (!v) return;
    update((d) => { const l = d.own[g.id] ?? []; if (!l.some((x) => x.toLowerCase() === v.toLowerCase())) d.own[g.id] = [...l, v]; });
    setOwn("");
  };

  return (
    <div className="cp-group">
      {showLabel && <h3>{g.label}</h3>}

      {g.kind === "text" && (
        <textarea className="ba-field" style={{ minHeight: 96 }} maxLength={600} placeholder={g.placeholder} aria-label={g.label}
          value={draft.text[g.id] ?? ""} onChange={(e) => { const v = e.target.value; update((d) => { d.text[g.id] = v; }); }} />
      )}

      {g.kind === "single" && (
        <div className="cp-chips" role="radiogroup" aria-label={g.label}>
          {g.options!.map((o) => (
            <button key={o.code} className="ba-chip" role="radio" aria-checked={draft.single[g.id] === o.code} aria-pressed={draft.single[g.id] === o.code}
              onClick={() => update((d) => { if (d.single[g.id] === o.code) delete d.single[g.id]; else d.single[g.id] = o.code; })}>
              {o.label}
            </button>
          ))}
        </div>
      )}

      {(g.kind === "multi" || g.kind === "diagnosis") && (
        <>
          {(g.options?.length ?? 0) > SEARCH_FROM && (
            <input className="ba-field cp-search" type="search" placeholder="Search the list" aria-label={`Search ${g.label}`}
              value={q} onChange={(e) => setQ(e.target.value)} />
          )}
          <div className="cp-chips" role="group" aria-label={g.label}>
            {options.map((o) => {
              const on = g.kind === "diagnosis" ? !!draft.diagnoses[o.code] : (draft.multi[g.id] ?? []).includes(o.code);
              return (
                <button key={o.code} className="ba-chip" aria-pressed={on} onClick={() => update((d) => {
                  if (g.kind === "diagnosis") {
                    if (d.diagnoses[o.code]) delete d.diagnoses[o.code]; else d.diagnoses[o.code] = "diagnosed";
                  } else {
                    const l = d.multi[g.id] ?? [];
                    d.multi[g.id] = on ? l.filter((c) => c !== o.code) : [...l, o.code];
                  }
                })}>{o.label}</button>
              );
            })}
            {ownList.map((v) => (
              <button key={v} className="ba-chip cp-own-chip" aria-pressed="true" aria-label={`Remove ${v}`}
                onClick={() => update((d) => { d.own[g.id] = (d.own[g.id] ?? []).filter((x) => x !== v); })}>
                {v} <X aria-hidden="true" />
              </button>
            ))}
          </div>

          {g.allowOwn && (
            <div className="cp-own">
              <input className="ba-field" placeholder="+ Add your own" aria-label={`Add your own to ${g.label}`} maxLength={60}
                value={own} onChange={(e) => setOwn(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOwn(); } }} />
              <button className="ba-btn-outline" onClick={addOwn} disabled={!own.trim()}>Add</button>
            </div>
          )}

          {g.kind === "diagnosis" && Object.keys(draft.diagnoses).length > 0 && (
            <div className="cp-diag">
              {Object.entries(draft.diagnoses).map(([code, status]) => (
                <div key={code} className="cp-diag-row">
                  <b>{g.options?.find((o) => o.code === code)?.label ?? code}</b>
                  <div className="ba-seg" role="radiogroup" aria-label={`Status of ${code}`}>
                    {(Object.keys(DIAGNOSIS_STATUS) as DiagnosisStatus[]).map((s) => (
                      <button key={s} role="radio" aria-checked={status === s} aria-pressed={status === s}
                        onClick={() => update((d) => { d.diagnoses[code] = s; })}>{DIAGNOSIS_STATUS[s]}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SectionSheet;
