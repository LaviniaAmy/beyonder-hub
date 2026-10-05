// ── Legal pages ─────────────────────────────────────────────
// DRAFTS — the wording must be reviewed and finalised before go-live (see CLAUDE.md "Before go-live").
// Anything marked [To be confirmed] needs a business or legal decision. Set `draft: false` once approved.

export type LegalDocId = "privacy" | "terms" | "cookies";

export interface LegalDoc {
  title: string;
  draft: boolean;
  lastUpdated: string;
  sections: { heading: string; paras: string[] }[];
}

const CONTACT = "hello@beyonderhub.co.uk";

export const legalDocs: Record<LegalDocId, LegalDoc> = {
  privacy: {
    title: "Privacy policy",
    draft: true,
    lastUpdated: "[To be confirmed]",
    sections: [
      {
        heading: "Who we are",
        paras: [
          "Beyonder (\"we\", \"us\") runs this website, which helps families of children with special educational needs and disabilities (SEND) find support. [To be confirmed: registered company name, number and address.]",
          `You can contact us about your data at ${CONTACT}.`,
        ],
      },
      {
        heading: "What we collect",
        paras: [
          "Account details: your name, email address and password.",
          "Details about your child that you choose to share, such as their age, first name and the areas they find hard. Some of this is information about health or disability.",
          "Messages you send to providers, and their replies.",
          "For providers: business details, contact details and anything you add to your listing.",
          "Information stored in your browser to keep you signed in and remember your answers.",
        ],
      },
      {
        heading: "How we use it",
        paras: [
          "To run your account, show you relevant support, and pass your enquiries to the providers you choose to contact.",
          "We only share your child's details with a provider when you send them an enquiry and tick the box to share.",
          "[To be confirmed: lawful basis for each use, including for health and disability information.]",
        ],
      },
      {
        heading: "Who we share it with",
        paras: [
          "Providers you contact through Beyonder.",
          "Companies that host and run the site for us. [To be confirmed: list of processors, e.g. database, email and payment providers, and where data is stored.]",
          "We do not sell your data.",
        ],
      },
      {
        heading: "How long we keep it",
        paras: ["[To be confirmed: retention periods for accounts, child details, messages and provider data.]"],
      },
      {
        heading: "Your rights",
        paras: [
          "Under UK data protection law you can ask to see, correct or delete your data, and object to how we use it. You can delete your child's saved details from your profile at any time.",
          `To make a request, email ${CONTACT}.`,
          "If you're unhappy with how we've handled your data, you can complain to the Information Commissioner's Office (ico.org.uk).",
        ],
      },
    ],
  },

  terms: {
    title: "Terms of use",
    draft: true,
    lastUpdated: "[To be confirmed]",
    sections: [
      {
        heading: "About Beyonder",
        paras: [
          "Beyonder is a directory and messaging service that connects families with SEND support providers. Providers listed on Beyonder are independent businesses and organisations, not part of Beyonder.",
          "Information on Beyonder is not medical, legal or educational advice. Always check a provider's qualifications and suitability for your child.",
        ],
      },
      {
        heading: "Your account",
        paras: [
          "Keep your login details private and make sure the information you give us is accurate. You're responsible for activity on your account.",
          "We may suspend accounts or listings that break these terms.",
        ],
      },
      {
        heading: "For providers",
        paras: [
          "You must only claim or manage a listing for an organisation you represent, and keep your listing accurate and up to date.",
          "[To be confirmed: plan terms, founder plan benefits and what happens when a plan ends.]",
        ],
      },
      {
        heading: "Payments",
        paras: ["[To be confirmed: prices, billing, cancellations and refunds for parent unlocks, subscriptions and provider plans.]"],
      },
      {
        heading: "Acceptable use",
        paras: [
          "Be respectful. Don't post anything unlawful, misleading, abusive or that shares someone else's private information.",
        ],
      },
      {
        heading: "Liability",
        paras: ["[To be confirmed: limits of liability, to be written with legal advice.]"],
      },
      {
        heading: "Changes and contact",
        paras: [
          "We may update these terms and will show the date of the latest version on this page.",
          "These terms are governed by the law of England and Wales. [To be confirmed.]",
          `Questions? Email ${CONTACT}.`,
        ],
      },
    ],
  },

  cookies: {
    title: "Cookies & storage",
    draft: true,
    lastUpdated: "[To be confirmed]",
    sections: [
      {
        heading: "What we use",
        paras: [
          "Beyonder does not currently use advertising or analytics cookies.",
          "We use your browser's storage to keep you signed in, remember your answers while you look for support, and remember which tips you've already seen. This is needed for the site to work.",
        ],
      },
      {
        heading: "Changes",
        paras: [
          "If we add analytics or other optional cookies, we'll update this page and ask for your consent first. [To be confirmed once the hosting, analytics and payment set-up is decided.]",
        ],
      },
      {
        heading: "Managing storage",
        paras: [
          "You can clear stored data at any time in your browser settings. If you do, you'll be signed out and your saved answers on this device will be removed.",
        ],
      },
    ],
  },
};
