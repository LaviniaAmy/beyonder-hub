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
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold">Provider not found</h1>
        <Button asChild className="mt-4"><Link to="/providers">Back to Directory</Link></Button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container py-20 text-center">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h1 className="mb-2 text-2xl font-bold">Enquiry Sent!</h1>
        <p className="mb-6 text-muted-foreground">Your message has been sent to {provider.name}. They'll get back to you soon.</p>
        <Button asChild><Link to="/dashboard">Go to Dashboard</Link></Button>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container max-w-lg">
        <h1 className="mb-6 text-2xl font-bold">Send Enquiry</h1>
        <Card>
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
            <Button className="w-full" onClick={() => setSubmitted(true)} disabled={!message.trim()}>
              Send Enquiry
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnquiryPage;
