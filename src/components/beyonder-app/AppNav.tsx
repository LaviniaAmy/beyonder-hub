import NavHome from "@/assets/icons/nav/nav-home.svg";
import NavConsult from "@/assets/icons/nav/nav-consult.svg";
import NavSearch from "@/assets/icons/nav/nav-search.svg";
import NavCommunity from "@/assets/icons/nav/nav-community.svg";
import NavProfile from "@/assets/icons/nav/nav-profile.svg";
import "./beyonderApp.css";

export type Tab = "home" | "consult" | "find" | "community" | "profile";

const NAV: { tab: Tab; label: string; icon: string }[] = [
  { tab: "home", label: "Home", icon: NavHome },
  { tab: "consult", label: "Consult", icon: NavConsult },
  { tab: "find", label: "Find", icon: NavSearch },
  { tab: "community", label: "Community", icon: NavCommunity },
  { tab: "profile", label: "Profile", icon: NavProfile },
];

interface Props {
  active: Tab | null;
  onTab: (tab: Tab) => void;
  hidden?: boolean;
  /** Fixed to the viewport (site pages) instead of the app frame. */
  fixed?: boolean;
  className?: string;
}

/** Bottom bar shared by the app and every mobile page. */
const AppNav = ({ active, onTab, hidden = false, fixed = false, className = "" }: Props) => (
  <nav className={`ba-root ba-nav${fixed ? " ba-nav-fixed" : ""}${hidden ? " ba-hide" : ""} ${className}`} aria-label="Main">
    {NAV.map((n) => (
      <button key={n.tab} aria-current={n.tab === active ? "page" : undefined} onClick={() => onTab(n.tab)}>
        <span className="ba-nav-icon"><img src={n.icon} alt="" /></span>
        {n.label}
      </button>
    ))}
  </nav>
);

export default AppNav;
