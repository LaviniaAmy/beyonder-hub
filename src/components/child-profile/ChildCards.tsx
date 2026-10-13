import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FlaskConical, X } from "lucide-react";
import {
  getChildren, ageText, completeness, shouldShowResearchReminder, dismissResearchReminder, DEFAULT_AVATAR,
} from "@/data/childProfileStore";
import StarlingAvatar from "./StarlingAvatar";
import "@/components/beyonder-app/beyonderApp.css";
import "./childProfile.css";

/** "Your children" row on the parent dashboard: one small card per child, plus "Add a child". */
const ChildCards = ({ parentId }: { parentId: string }) => {
  const [, refresh] = useState(0);
  const kids = getChildren(parentId);
  const remindFor = kids.find((k) => shouldShowResearchReminder(k));

  if (kids.length === 0) {
    return (
      <div className="ba-root">
        <Link to="/dashboard/child/new" className="cp-card-intro">
          <StarlingAvatar look={DEFAULT_AVATAR} size={64} label="" />
          <div>
            <b>Set up your child's profile</b>
            <span>Tell us about them once, then choose what each provider sees. It takes about a minute.</span>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="ba-root">
      <div className="cp-cards">
        {kids.map((k) => {
          const age = ageText(k);
          return (
            <Link key={k.id} to={`/dashboard/child/${k.id}`} className="cp-card">
              <StarlingAvatar look={k.avatar} size={76} label={`${k.firstName}'s starling`} />
              <strong>{k.firstName}{age ? ` · ${age}` : ""}</strong>
              <small>{completeness(k.answers)}% complete</small>
              <span className="cp-open">Open</span>
            </Link>
          );
        })}
        <Link to="/dashboard/child/new" className="cp-card cp-card-add">
          <span className="cp-plus"><Plus aria-hidden="true" /></span>
          <strong style={{ fontSize: 16 }}>Add a child</strong>
        </Link>
      </div>
      {remindFor && (
        <p className="cp-reminder" style={{ justifyContent: "flex-start", marginTop: 8 }}>
          <FlaskConical size={15} aria-hidden="true" />
          <span>Help SEND research? <Link to={`/dashboard/child/${remindFor.id}?panel=research`} className="cp-link">Find out more</Link></span>
          <button className="cp-x" aria-label="Hide for now" onClick={() => { dismissResearchReminder(parentId, remindFor.id); refresh((n) => n + 1); }}>
            <X aria-hidden="true" />
          </button>
        </p>
      )}
    </div>
  );
};

export default ChildCards;
