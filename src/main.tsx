import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Hand all scroll management to the app — prevents the browser's own
// scroll restoration from fighting ScrollToTop on every navigation.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

createRoot(document.getElementById("root")!).render(<App />);
