/**
 * Contact page copy — form chrome, office panel, pillars, and help band.
 * Hero title/lead stay locked to vision §9.10 on the page itself.
 */

export const CONTACT_FORM = {
  title: "Send Us a Message",
  lead: "Tell us about your goals and how we can help you stay connected, no matter the environment.",
  secure:
    "Your information is secure and will only be used to respond to your inquiry.",
  placeholders: {
    fullName: "Enter your full name",
    workEmail: "Enter your work email",
    organization: "Enter your company or organization",
    interest: "Select an option",
    message: "Tell us more about your mission or inquiry...",
  },
  submit: "Send Message",
} as const;

export const CONTACT_OFFICE = {
  title: "Our Office",
  location: "Colorado",
  description:
    "IST is headquartered in Colorado, a hub of innovation and expertise in aerospace, defense, and advanced communications.",
  mapAlt:
    "A map of the United States with IST headquartered in Colorado.",
} as const;

export const CONTACT_SOCIAL = {
  title: "Connect With Us",
  lead: "Follow IST for insights, updates, and the latest innovations.",
} as const;

export const CONTACT_PILLARS = [
  {
    id: "mission",
    title: "Mission-Focused",
    body: "We design for the moments that matter most.",
    icon: "shield" as const,
  },
  {
    id: "agile",
    title: "Agile & Adaptive",
    body: "Our technology evolves with your mission.",
    icon: "network" as const,
  },
  {
    id: "secure",
    title: "Secure by Design",
    body: "Built-in security for complex, contested environments.",
    icon: "lock" as const,
  },
  {
    id: "partner",
    title: "Partner in Progress",
    body: "We succeed when our customers do.",
    icon: "people" as const,
  },
] as const;

export const CONTACT_HELP = {
  heading: "We're here to help you stay connected—anywhere.",
  lead: "Our team will respond as quickly as possible.",
} as const;
