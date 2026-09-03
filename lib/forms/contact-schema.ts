/**
 * Contact form shape and validation.
 *
 * Deliberately dependency-free and shared by the client and the API route, so
 * the browser and the server apply exactly the same rules. Client-side checks
 * are a convenience; the route validates independently and never trusts input.
 */

export const INTEREST_OPTIONS = [
  "Locus",
  "Crucible",
  "Hardware",
  "Partnership",
  "Invest in IST",
  "Careers",
  "Other",
] as const;

export type Interest = (typeof INTEREST_OPTIONS)[number];

export type ContactValues = {
  fullName: string;
  workEmail: string;
  organization: string;
  interest: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

export const EMPTY_CONTACT: ContactValues = {
  fullName: "",
  workEmail: "",
  organization: "",
  interest: "",
  message: "",
};

/**
 * Name of the honeypot input. It is positioned off-screen and labelled so that
 * assistive technology skips it; only a bot filling every field will populate it.
 */
export const HONEYPOT_FIELD = "company_website";

/**
 * Pragmatic email check: something@something.tld with no whitespace. Stricter
 * patterns reject valid addresses, and the real proof is a reply landing.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  fullName: 100,
  workEmail: 200,
  organization: 150,
  message: 4000,
} as const;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.fullName.trim();
  const email = values.workEmail.trim();
  const organization = values.organization.trim();
  const message = values.message.trim();

  if (name.length < 2) errors.fullName = "Please enter your full name.";
  else if (name.length > LIMITS.fullName) errors.fullName = "That name is too long.";

  if (!email) errors.workEmail = "Please enter your work email.";
  else if (!EMAIL.test(email)) errors.workEmail = "That does not look like an email address.";
  else if (email.length > LIMITS.workEmail) errors.workEmail = "That address is too long.";

  if (organization.length > LIMITS.organization) errors.organization = "That name is too long.";

  if (!values.interest) errors.interest = "Please choose what this is about.";
  else if (!INTEREST_OPTIONS.includes(values.interest as Interest))
    errors.interest = "Please choose one of the listed options.";

  if (message.length < 10) errors.message = "Please tell us a little more — at least a sentence.";
  else if (message.length > LIMITS.message) errors.message = "That message is too long.";

  return errors;
}

export function isValid(errors: ContactErrors): boolean {
  return Object.keys(errors).length === 0;
}
