import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { addEnquiry } from "@/data/enquiryStore";
import { getProvider } from "@/data/providerStore";

const MIN_CHARS = 20;
const MAX_CHARS = 800;

const EnquiryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const provider = getProvider(id ?? "");

  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [childAge, setChildAge] = useState("");
  const [messageFocused, setMessageFocused] = useState(false);

  // ── Auth gate: immediate redirect, no flash ──
  const isParent = isAuthenticated && user?.role === "parent";
  const isProviderOrAdmin = isAuthenticated && (user?.role === "provider" || user?.role === "admin");

  if (!isAuthenticated) {
    navigate(`/login?redirect=${encodeURIComponent(`/enquiry/${id ?? ""}`)}`, { replace: true });
    return null;
  }

  if (!provider) {
    return (
      <div className="bg-navy-gradient min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-accent-foreground">Provider not found</h1>
          <Button asChild className="mt-4 bg-teal-500 hover:bg-teal-400">
            <Link to="/providers">Back to Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Provider or admin trying to send an enquiry
  if (isProviderOrAdmin) {
    return (
      <div className="bg-navy-gradient min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in max-w-sm">
          <Lock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="mb-2 text-xl font-bold text-accent-foreground">Enquiries are for families</h1>
          <p className="mb-6 text-sm text-accent-foreground/70 leading-relaxed">
            Provider and admin accounts can't send enquiries. If you're a parent, please log in with your parent
            account.
          </p>
          <Button className="bg-teal-500 hover:bg-teal-400" asChild>
            <Link to="/providers">Back to Directory</Link>
          </Button>
        </div>
      </div>
    );
  }

  const remaining = MAX_CHARS - message.length;
  const tooShort = message.trim().length < MIN_CHARS;
  const tooLong = message.length > MAX_CHARS;
  const canSubmit = !tooShort && !tooLong && childAge.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    addEnquiry({
      enquiryId: crypto.randomUUID(),
      providerId: provider.id,
      providerName: provider.businessName,
      parentId: user?.id ?? "mock-parent",
      parentName: user?.name ?? "Guest",
      childAge: childAge.trim(),
      message: message.trim(),
      reply: null,
      messages: [
        {
          messageId: crypto.randomUUID(),
          senderId: "parent",
          senderName: user?.name ?? "Guest",
          text: message.trim(),
          sentAt: new Date().toISOString().split("T")[0],
        },
      ],
      statusForParent: "sent",
      statusForProvider: "new",
      createdAt: new Date().toISOString().split("T")[0],
      isUnlocked: false,
      messageCount: 0,
      providerNotes: "",
      customAnswers: [],
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-navy-gradient min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-teal-500" />
          <h1 className="mb-2 text-2xl font-bold text-accent-foreground">Enquiry Sent!</h1>
          <p className="mb-6 text-accent-foreground/70 leading-relaxed">
            Your message has been sent to {provider.businessName}. They'll get back to you soon.
          </p>
          <Button className="bg-teal-500 hover:bg-teal-400" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-gradient min-h-screen py-16">
      <div className="container max-w-lg animate-fade-in">
        <h1 className="mb-6 text-2xl font-bold text-accent-foreground">Send Enquiry</h1>
        <Card className="border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">{provider.businessName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {provider.deliveryFormat} · {provider.ageRange}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="childAge">Child's Age</Label>
              <Input
                id="childAge"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                placeholder="e.g. 7"
              />
            </div>
            <div>
              <Label htmlFor="message">Your Message</Label>

              {messageFocused && (
                <div
                  style={{
                    marginBottom: 10,
                    marginTop: 8,
                    padding: "12px 16px",
                    borderRadius: 10,
                    background: "rgba(42,122,106,0.08)",
                    border: "1px solid rgba(42,122,106,0.22)",
                    animation: "fadeIn 0.2s ease",
                  }}
                >
                  <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#2a7a6a", marginBottom: 4 }}>
                    A quick note before you send
                  </p>
                  <p style={{ fontSize: "0.74rem", color: "#556677", lineHeight: 1.65, margin: 0 }}>
                    This is an enquiry to start a conversation — not a booking or consultation. It's simply the first
                    step in finding the right support for your child.
                  </p>
                  <p style={{ fontSize: "0.74rem", color: "#556677", lineHeight: 1.65, margin: "6px 0 0" }}>
                    To keep things simple and respectful for everyone, we ask that exchanges stay focused — typically a
                    message or two each way is all it takes to find out if there's a good fit.
                  </p>
                  <p style={{ fontSize: "0.74rem", color: "#556677", lineHeight: 1.65, margin: "6px 0 0" }}>
                    We're a community built on trust. Any misuse of messaging may result in access being removed — but
                    we know that's not you.
                  </p>
                  <p style={{ fontSize: "0.76rem", fontWeight: 600, color: "#2a7a6a", marginTop: 8 }}>
                    You've got this. Hit send. 💙
                  </p>
                </div>
              )}

              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => setMessageFocused(true)}
                onBlur={() => setMessageFocused(false)}
                placeholder="Tell them about your child's needs and what you're looking for..."
                rows={5}
              />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>{tooShort && message.length > 0 ? `At least ${MIN_CHARS} characters required` : ""}</span>
                <span style={{ color: tooLong ? "#e8622a" : remaining < 100 ? "#f07840" : undefined }}>
                  {remaining} remaining
                </span>
              </div>
            </div>
            <Button className="w-full bg-teal-500 hover:bg-teal-400" onClick={handleSubmit} disabled={!canSubmit}>
              Send Enquiry
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnquiryPage;
