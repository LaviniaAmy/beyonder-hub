import BeyonderApp from "@/components/beyonder-app/BeyonderApp";

// Desktop destination for the hero's "Live consultation" / "Find local support" buttons.
// Runs the same screens as the mobile homepage, framed inside the normal page layout.
const StartPage = () => (
  <div style={{ background: "#F6F3EE", padding: "24px 16px" }}>
    <BeyonderApp embedded />
  </div>
);

export default StartPage;
