"use client";

import { useId, useRef, useState } from "react";

import {
  ContactMessageIcon,
  ContactSendIcon,
  ContactShieldIcon,
} from "@/components/contact/ContactIcons";
import { Button } from "@/components/ui/Button";
import { Field, controlClass } from "@/components/ui/Field";
import { LinkRule } from "@/components/ui/LinkRule";
import { CONTACT_FORM } from "@/lib/contact";
import {
  EMPTY_CONTACT,
  HONEYPOT_FIELD,
  INTEREST_OPTIONS,
  isValid,
  validateContact,
  type ContactErrors,
  type ContactValues,
} from "@/lib/forms/contact-schema";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "sent" | "failed";

export type ContactFormCopy = {
  title: string;
  lead: string;
  secure: string;
  submit: string;
  placeholders: {
    fullName: string;
    workEmail: string;
    organization: string;
    interest: string;
    message: string;
  };
};

type Props = {
  copy?: ContactFormCopy;
};

const contactControl = cn(
  controlClass,
  "rounded-none border-ist-line bg-black placeholder:text-ist-dim",
);

const contactLabel = "font-medium normal-case tracking-normal text-ist-text text-[0.875rem]";

/**
 * Contact enquiry form — stacked fields, full-width send, security note.
 */
export function ContactForm({ copy }: Props) {
  const form = copy ?? {
    title: CONTACT_FORM.title,
    lead: CONTACT_FORM.lead,
    secure: CONTACT_FORM.secure,
    submit: CONTACT_FORM.submit,
    placeholders: { ...CONTACT_FORM.placeholders },
  };
  const prefix = useId();
  const [values, setValues] = useState<ContactValues>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const fieldId = (name: keyof ContactValues) => `${prefix}-${name}`;

  const set = (name: keyof ContactValues) => (value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateContact(values);
    setErrors(found);
    if (!isValid(found)) {
      const first = Object.keys(found)[0] as keyof ContactValues;
      document.getElementById(fieldId(first))?.focus();
      return;
    }

    setStatus("sending");
    setFailure("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          [HONEYPOT_FIELD]: honeypot.current?.value ?? "",
        }),
      });

      if (response.status === 422) {
        const data = (await response.json()) as { errors?: ContactErrors };
        setErrors(data.errors ?? {});
        setStatus("idle");
        return;
      }

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setFailure(data.error ?? "Something went wrong. Please try again.");
        setStatus("failed");
        return;
      }

      setValues(EMPTY_CONTACT);
      setStatus("sent");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setFailure("We could not reach the server. Please check your connection and try again.");
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="flex h-full flex-col border border-ist-line bg-[#0a0a0a] p-5 focus:outline-none sm:p-6 lg:p-7"
      >
        <LinkRule state="connected" tone="accent" className="max-w-12" />
        <h2 className="mt-6 text-[1.25rem] font-semibold text-ist-text">Message received.</h2>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ist-muted">
          Thank you — your message is with the IST team and someone will respond directly to the
          address you gave us.
        </p>
        <div className="mt-8">
          <Button variant="secondary" onClick={() => setStatus("idle")}>
            Send another message
          </Button>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="relative flex h-full flex-col border border-ist-line bg-[#0a0a0a] p-5 sm:p-6 lg:p-7"
    >
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${prefix}-${HONEYPOT_FIELD}`}>Company website</label>
        <input
          ref={honeypot}
          id={`${prefix}-${HONEYPOT_FIELD}`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div>
        <p className="flex items-center gap-2.5 text-[1.15rem] font-semibold text-ist-text sm:text-[1.25rem]">
          <span className="text-ist-accent-bright">
            <ContactMessageIcon size={22} />
          </span>
          {form.title}
        </p>
        <p className="mt-2 max-w-xl text-[0.9rem] leading-relaxed text-ist-muted">
          {form.lead}
        </p>
      </div>

      <div className="mt-6 flex flex-1 flex-col gap-1">
        <Field
          id={fieldId("fullName")}
          label="Full Name"
          required
          error={errors.fullName}
          labelClassName={contactLabel}
        >
          <input
            id={fieldId("fullName")}
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder={form.placeholders.fullName}
            className={contactControl}
            value={values.fullName}
            onChange={(e) => set("fullName")(e.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? `${fieldId("fullName")}-error` : undefined}
          />
        </Field>

        <Field
          id={fieldId("workEmail")}
          label="Work Email"
          required
          error={errors.workEmail}
          labelClassName={contactLabel}
        >
          <input
            id={fieldId("workEmail")}
            name="workEmail"
            type="email"
            autoComplete="email"
            placeholder={form.placeholders.workEmail}
            className={contactControl}
            value={values.workEmail}
            onChange={(e) => set("workEmail")(e.target.value)}
            aria-invalid={Boolean(errors.workEmail)}
            aria-describedby={errors.workEmail ? `${fieldId("workEmail")}-error` : undefined}
          />
        </Field>

        <Field
          id={fieldId("organization")}
          label="Company/Organization"
          error={errors.organization}
          labelClassName={contactLabel}
        >
          <input
            id={fieldId("organization")}
            name="organization"
            type="text"
            autoComplete="organization"
            placeholder={form.placeholders.organization}
            className={contactControl}
            value={values.organization}
            onChange={(e) => set("organization")(e.target.value)}
            aria-invalid={Boolean(errors.organization)}
            aria-describedby={
              errors.organization ? `${fieldId("organization")}-error` : undefined
            }
          />
        </Field>

        <Field
          id={fieldId("interest")}
          label="I'm interested in"
          required
          error={errors.interest}
          labelClassName={contactLabel}
        >
          <div className="relative">
            <select
              id={fieldId("interest")}
              name="interest"
              className={cn(contactControl, "appearance-none pr-10")}
              value={values.interest}
              onChange={(e) => set("interest")(e.target.value)}
              aria-invalid={Boolean(errors.interest)}
              aria-describedby={errors.interest ? `${fieldId("interest")}-error` : undefined}
            >
              <option value="">{form.placeholders.interest}</option>
              {INTEREST_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ist-accent-bright"
            >
              ▾
            </span>
          </div>
        </Field>

        <Field
          id={fieldId("message")}
          label="Message"
          required
          error={errors.message}
          labelClassName={contactLabel}
        >
          <textarea
            id={fieldId("message")}
            name="message"
            rows={5}
            placeholder={form.placeholders.message}
            className={cn(contactControl, "resize-y")}
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${fieldId("message")}-error` : undefined}
          />
        </Field>
      </div>

      {status === "failed" ? (
        <p role="alert" className="mb-3 text-[0.8rem] text-ist-accent-bright">
          {failure}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={sending}
        className="mt-2 !min-h-12 w-full max-w-none justify-center"
      >
        <span className="inline-flex items-center gap-2.5">
          <ContactSendIcon size={16} />
          {sending ? "Sending…" : form.submit}
        </span>
      </Button>

      <p className="mt-4 flex items-start gap-2 text-[0.75rem] leading-snug text-ist-dim">
        <span className="mt-0.5 shrink-0 text-ist-accent-bright">
          <ContactShieldIcon size={13} />
        </span>
        {form.secure}
      </p>
    </form>
  );
}
