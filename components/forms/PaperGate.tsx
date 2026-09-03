"use client";

import { useId, useRef, useState, type ReactNode } from "react";

import { InsightIcon } from "@/components/insights/InsightIcon";
import { Button } from "@/components/ui/Button";
import { LinkRule } from "@/components/ui/LinkRule";
import { cn } from "@/lib/cn";

type Errors = {
  name?: string;
  email?: string;
  consent?: string;
};

type Status = "idle" | "sending" | "done" | "failed";

const HONEYPOT = "company_website";

const denseControl =
  "w-full border border-ist-line bg-black px-3 py-2 text-[0.8125rem] text-ist-text " +
  "transition-colors duration-[180ms] ease-ist placeholder:text-ist-dim " +
  "hover:border-ist-line-strong focus:border-ist-accent focus:outline-none " +
  "aria-[invalid=true]:border-ist-accent-bright";

function DenseField({
  id,
  label,
  required,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label htmlFor={id} className="text-[0.68rem] text-ist-muted">
        {label}
        {required ? (
          <>
            {" "}
            <span aria-hidden="true" className="text-ist-accent-bright">
              *
            </span>
            <span className="sr-only">(required)</span>
          </>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[0.68rem] text-ist-accent-bright">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Gated download form. `compact` = nested panel inside Featured Research.
 */
export function PaperGate({
  slug,
  title,
  className,
  compact = false,
  fillHeight = false,
}: {
  slug: string;
  title: string;
  className?: string;
  compact?: boolean;
  /** Stretch to grid row height and park blank space above the footer. */
  fillHeight?: boolean;
}) {
  const prefix = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found: Errors = {};
    if (name.trim().length < 2) found.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()))
      found.email = "Please enter a valid work email.";
    if (!consent) found.consent = "Please confirm you agree to be contacted.";

    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    setFailure("");

    try {
      const response = await fetch(`/api/insights/${slug}/download`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          jobTitle,
          consent: true,
          [HONEYPOT]: honeypot.current?.value ?? "",
        }),
      });

      if (response.status === 422) {
        const data = (await response.json()) as { errors?: Errors };
        setErrors(data.errors ?? {});
        setStatus("idle");
        return;
      }

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setFailure(data.error ?? "The download could not be started. Please try again.");
        setStatus("failed");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${slug}.pdf`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);

      setStatus("done");
    } catch {
      setFailure("We could not reach the server. Please check your connection and try again.");
      setStatus("failed");
    }
  }

  const shell = cn(
    "relative flex flex-col border border-ist-line",
    compact ? "bg-[#0c0c0c] p-3.5 sm:p-4" : "bg-ist-raised p-5 sm:p-6",
    fillHeight && "h-full",
    className,
  );

  if (status === "done") {
    return (
      <div className={shell}>
        <LinkRule state="connected" tone="accent" className="max-w-8" />
        <p className="mt-3 text-[1rem] font-semibold text-ist-text">Your download has started.</p>
        <p className="mt-1.5 text-[0.78rem] text-ist-muted">
          If nothing happened, check your downloads, or request the paper again.
        </p>
        <div className="mt-3">
          <Button variant="ghost" onClick={() => setStatus("idle")}>
            Request again
          </Button>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form noValidate onSubmit={onSubmit} className={shell}>
      <p className="text-[0.75rem] leading-snug text-ist-muted">
        Submit your details to download the full paper.
      </p>

      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${prefix}-${HONEYPOT}`}>Company website</label>
        <input
          ref={honeypot}
          id={`${prefix}-${HONEYPOT}`}
          name={HONEYPOT}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <DenseField id={`${prefix}-name`} label="Full Name" required error={errors.name}>
          <input
            id={`${prefix}-name`}
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            className={denseControl}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((c) => ({ ...c, name: undefined }));
            }}
            aria-invalid={Boolean(errors.name)}
          />
        </DenseField>

        <DenseField id={`${prefix}-email`} label="Work Email" required error={errors.email}>
          <input
            id={`${prefix}-email`}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className={denseControl}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((c) => ({ ...c, email: undefined }));
            }}
            aria-invalid={Boolean(errors.email)}
          />
        </DenseField>

        <div className="grid grid-cols-2 gap-2">
          <DenseField id={`${prefix}-company`} label="Company">
            <input
              id={`${prefix}-company`}
              type="text"
              autoComplete="organization"
              placeholder="Organization"
              className={denseControl}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </DenseField>

          <DenseField id={`${prefix}-title`} label="Job Title">
            <input
              id={`${prefix}-title`}
              type="text"
              autoComplete="organization-title"
              placeholder="Your role"
              className={denseControl}
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </DenseField>
        </div>
      </div>

      <label className="mt-2.5 flex items-start gap-2 text-[0.7rem] leading-snug text-ist-muted">
        <input
          type="checkbox"
          className="mt-0.5 h-3.5 w-3.5 shrink-0 border border-ist-line-strong bg-black accent-[var(--ist-accent)]"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            setErrors((c) => ({ ...c, consent: undefined }));
          }}
          aria-invalid={Boolean(errors.consent)}
        />
        <span>I agree to receive communications from IST about research, insights, and solutions.</span>
      </label>
      {errors.consent ? (
        <p role="alert" className="mt-1 text-[0.68rem] text-ist-accent-bright">
          {errors.consent}
        </p>
      ) : null}

      {status === "failed" ? (
        <p role="alert" className="mt-1.5 text-[0.68rem] text-ist-accent-bright">
          {failure}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        className="mt-2.5 !min-h-10 w-full max-w-none justify-center text-[0.875rem]"
        disabled={sending}
      >
        <span className="inline-flex items-center gap-2">
          <InsightIcon name="lock" size={13} />
          {sending ? "Preparing…" : "Download Paper"}
        </span>
      </Button>

      {/* Blank space (ticked area) so the form bottom matches the card baseline */}
      {fillHeight ? <div className="min-h-6 flex-1 basis-0" aria-hidden="true" /> : null}

      <p className={cn("flex items-start gap-1.5 text-[0.65rem] text-ist-dim", fillHeight ? "mt-2" : "mt-2")}>
        <span className="mt-0.5 text-ist-accent-bright">
          <InsightIcon name="shield" size={11} />
        </span>
        Your information is secure and will never be shared.
      </p>

      <p className="sr-only">This form gives access to: {title}</p>
    </form>
  );
}
