import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "How do I find services near me?", a: "Use the Explore Services page to browse by category, or use the search bar on the homepage. You can filter by location, age range, and delivery type." },
  { q: "Is Beyonder free to use?", a: "Browsing and sending enquiries is free. To read provider responses, you can choose a one-off unlock (£4.95) or a monthly subscription (£9.95/month)." },
  { q: "How are providers vetted?", a: "All providers are reviewed by our team before being listed. We check credentials, references, and ensure they meet our quality standards." },
  { q: "Can I save providers for later?", a: "Yes! Use the bookmark icon on any provider card to save them to your favourites (coming soon with full account features)." },
  { q: "I'm a provider — how do I get listed?", a: "Visit our 'For Providers' page to learn about listing options and sign up. We offer both free and premium listings." },
];

const HelpCentre = () => (
  <div className="py-12">
    <div className="container max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Help Centre</h1>
      <p className="mb-8 text-muted-foreground">Find answers to the most common questions about Beyonder.</p>
      <Accordion type="single" collapsible>
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </div>
);

export default HelpCentre;
