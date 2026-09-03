/**
 * Careers apply form — shared by client + `/api/careers/apply`.
 */

export const HONEYPOT_FIELD = "company_website";

export type CareersApplyValues = {
  firstName: string;
  lastName: string;
  email: string;
  newsletter: boolean;
  subject: string;
  message: string;
  roleSlug: string;
  roleTitle: string;
};

export type CareersApplyErrors = Partial<
  Record<keyof Omit<CareersApplyValues, "newsletter" | "roleSlug" | "roleTitle"> | "file", string>
>;

export const EMPTY_APPLY: CareersApplyValues = {
  firstName: "",
  lastName: "",
  email: "",
  newsletter: false,
  subject: "",
  message: "",
  roleSlug: "",
  roleTitle: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LIMITS = {
  firstName: 80,
  lastName: 80,
  email: 200,
  subject: 200,
  message: 6000,
} as const;

export const APPLY_FILE = {
  maxBytes: 8 * 1024 * 1024,
  accept: ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  allowedExt: new Set(["pdf", "doc", "docx"]),
  allowedMime: new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream",
  ]),
} as const;

export function validateCareersApply(values: CareersApplyValues): CareersApplyErrors {
  const errors: CareersApplyErrors = {};
  const first = values.firstName.trim();
  const last = values.lastName.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (first.length < 1) errors.firstName = "Please enter your first name.";
  else if (first.length > LIMITS.firstName) errors.firstName = "That name is too long.";

  if (last.length < 1) errors.lastName = "Please enter your last name.";
  else if (last.length > LIMITS.lastName) errors.lastName = "That name is too long.";

  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL.test(email)) errors.email = "That does not look like an email address.";
  else if (email.length > LIMITS.email) errors.email = "That address is too long.";

  if (subject.length < 2) errors.subject = "Please enter a subject.";
  else if (subject.length > LIMITS.subject) errors.subject = "That subject is too long.";

  if (message.length < 10) errors.message = "Please tell us a little more — at least a sentence.";
  else if (message.length > LIMITS.message) errors.message = "That message is too long.";

  return errors;
}

export function isValidApply(errors: CareersApplyErrors): boolean {
  return Object.keys(errors).length === 0;
}

export function fileExtension(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export function validateApplyFile(file: File | null): string | undefined {
  if (!file) return undefined;
  if (file.size > APPLY_FILE.maxBytes) return "File is too large (max 8MB).";
  const ext = fileExtension(file.name);
  if (!APPLY_FILE.allowedExt.has(ext)) return "Please upload a PDF or Word document.";
  if (file.type && !APPLY_FILE.allowedMime.has(file.type)) {
    return "Please upload a PDF or Word document.";
  }
  return undefined;
}
