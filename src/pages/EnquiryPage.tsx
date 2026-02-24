import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { providers } from "@/data/mockData";
import { CheckCircle } from "lucide-react";

const EnquiryPage = () => {
  const { id } = useParams();
  const provider = providers.find((p) => p.id === id);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [childAge, setChildAge] = useState("");

  if (!provider) {
    return (
      <div className="bg-navy-gradient min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-accent-foreground">Provider not found</h1>
          <Button asChild className="mt-4 bg-teal-500 hover:bg-teal-400"><Link to="/providers">Back to Directory</Link></Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-navy-gradient min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-teal-500" />
          <h1 className="mb-2 text-2xl font-bold text-accent-foreground">Enquiry Sent!</h1>
          <p className="mb-6 text-accent-foreground/70 leading-relaxed">Your message has been sent to {provider.name}. They'll get back to you soon.</p>
          <Button className="bg-teal-500 hover:bg-teal-400" asChild><Link to="/dashboard">Go to Dashboard</Link></Button>
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
            <CardTitle className="text-lg">{provider.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{provider.deliveryFormat} · {provider.ageRange}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="childAge">Child's Age</Label>
              <Input id="childAge" value={childAge} onChange={(e) => setChildAge(e.target.value)} placeholder="e.g. 7" />
            </div>
            <div>
              <Label htmlFor="message">Your Message</Label>
              <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell them about your child's needs and what you're looking for..." rows={5} />
            </div>
            <Button className="w-full bg-teal-500 hover:bg-teal-400" onClick={() => setSubmitted(true)} disabled={!message.trim()}>
              Send Enquiry
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnquiryPage;
