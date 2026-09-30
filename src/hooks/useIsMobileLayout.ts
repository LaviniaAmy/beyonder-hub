import { useEffect, useState } from "react";

const QUERY = "(max-width: 767px)";

/** True below the md breakpoint. Reads the viewport on first render so there is no desktop flash on phones. */
export function useIsMobileLayout() {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.matchMedia(QUERY).matches);
  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setMobile(mql.matches);
    mql.addEventListener("change", onChange);
    onChange();
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return mobile;
}
