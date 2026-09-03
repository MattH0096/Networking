"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { controlClass } from "@/components/ui/Field";
import {
  APPLY_FILE,
  EMPTY_APPLY,
  HONEYPOT_FIELD,
  isValidApply,
  validateApplyFile,
  validateCareersApply,
  type CareersApplyErrors,
  type CareersApplyValues,
} from "@/lib/forms/careers-apply-schema";
import { cn } from "@/lib/cn";

export type ApplyRoleOption = {
  slug: string;
  title: string;
};

type Status = "idle" | "sending" | "sent" | "failed";

type Props = {
  roles: ApplyRoleOption[];
};

const applyControl = cn(
  controlClass,
  "rounded-none border-ist-line bg-black placeholder:text-ist-dim",
);

const applyLabel =
  "font-medium normal-case tracking-normal text-ist-text text-[0.875rem]";

/**
 * Careers apply form — same dark plate language as Contact.
 */
export function CareersApplyForm({ roles }: Props) {
  const prefix = useId();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") ?? "";
  const [values, setValues] = useState<CareersApplyValues>(EMPTY_APPLY);
  const [errors, setErrors] = useState<CareersApplyErrors>({});
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const match = roles.find((r) => r.slug === roleParam);
    if (!match) return;
    setValues((current) => ({
      ...current,
      roleSlug: match.slug,
      roleTitle: match.title,
      subject: current.subject.trim() ? current.subject : `Application — ${match.title}`,
    }));
  }, [roleParam, roles]);

  const fieldId = (name: string) => `${prefix}-${name}`;

  function setField<K extends keyof CareersApplyValues>(name: K, value: CareersApplyValues[K]) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!(name in current)) return current;
      const next = { ...current };
      delete next[name as keyof CareersApplyErrors];
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateCareersApply(values);
    const fileErr = validateApplyFile(file);
    if (fileErr) found.file = fileErr;
    setErrors(found);
    if (!isValidApply(found)) {
      const first = Object.keys(found)[0];
      if (first) document.getElementById(fieldId(first))?.focus();
      return;
    }

    setStatus("sending");
    setFailure("");

    try {
      const body = new FormData();
      body.set("firstName", values.firstName);
      body.set("lastName", values.lastName);
      body.set("email", values.email);
      body.set("newsletter", values.newsletter ? "true" : "false");
      body.set("subject", values.subject);
      body.set("message", values.message);
      body.set("roleSlug", values.roleSlug);
      body.set("roleTitle", values.roleTitle);
      body.set(HONEYPOT_FIELD, honeypot.current?.value ?? "");
      if (file) body.set("file", file);

      const response = await fetch("/api/careers/apply", { method: "POST", body });

      if (response.status === 422) {
        const data = (await response.json()) as { errors?: CareersApplyErrors };
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

      setValues(EMPTY_APPLY);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
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
        className="border border-ist-line bg-black/55 px-5 py-10 text-center backdrop-blur-sm sm:px-8 sm:py-12"
      >
        <h3 className="text-[1.25rem] font-semibold tracking-tight text-ist-text">
          Application sent.
        </h3>
        <p className="mt-3 text-[0.95rem] text-ist-muted">
          Thanks — we received your message and will follow up if there is a fit.
        </p>
        <button
          type="button"
          className="btn btn--primary mt-8"
          onClick={() => setStatus("idle")}
        >
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative border border-ist-line bg-black/55 px-5 py-8 backdrop-blur-sm sm:px-8 sm:py-10 lg:px-10"
      noValidate
    >
      {values.roleTitle ? (
        <p className="mb-6 text-[0.9rem] text-ist-muted">
          Applying for:{" "}
          <span className="font-medium text-ist-accent-bright">{values.roleTitle}</span>
        </p>
      ) : null}

      <div className="flex flex-col gap-5">
        <fieldset>
          <legend className={applyLabel}>Name</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor={fieldId("firstName")} className={applyLabel}>
                First Name{" "}
                <span aria-hidden="true" className="text-ist-accent-bright">
                  *
                </span>
              </label>
              <input
                id={fieldId("firstName")}
                className={applyControl}
                autoComplete="given-name"
                value={values.firstName}
                aria-invalid={Boolean(errors.firstName)}
                onChange={(e) => setField("firstName", e.target.value)}
              />
              <p role="alert" className="min-h-5 text-[0.8rem] text-ist-accent-bright">
                {errors.firstName}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor={fieldId("lastName")} className={applyLabel}>
                Last Name{" "}
                <span aria-hidden="true" className="text-ist-accent-bright">
                  *
                </span>
              </label>
              <input
                id={fieldId("lastName")}
                className={applyControl}
                autoComplete="family-name"
                value={values.lastName}
                aria-invalid={Boolean(errors.lastName)}
                onChange={(e) => setField("lastName", e.target.value)}
              />
              <p role="alert" className="min-h-5 text-[0.8rem] text-ist-accent-bright">
                {errors.lastName}
              </p>
            </div>
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <label htmlFor={fieldId("email")} className={applyLabel}>
            Email{" "}
            <span aria-hidden="true" className="text-ist-accent-bright">
              *
            </span>
          </label>
          <input
            id={fieldId("email")}
            type="email"
            className={applyControl}
            autoComplete="email"
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            onChange={(e) => setField("email", e.target.value)}
          />
          <p role="alert" className="min-h-5 text-[0.8rem] text-ist-accent-bright">
            {errors.email}
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 accent-ist-accent"
            checked={values.newsletter}
            onChange={(e) => setField("newsletter", e.target.checked)}
          />
          <span className="text-[0.9rem] text-ist-muted">Sign up for news and updates</span>
        </label>

        <div className="flex flex-col gap-2">
          <label htmlFor={fieldId("subject")} className={applyLabel}>
            Subject{" "}
            <span aria-hidden="true" className="text-ist-accent-bright">
              *
            </span>
          </label>
          <input
            id={fieldId("subject")}
            className={applyControl}
            value={values.subject}
            aria-invalid={Boolean(errors.subject)}
            onChange={(e) => setField("subject", e.target.value)}
          />
          <p role="alert" className="min-h-5 text-[0.8rem] text-ist-accent-bright">
            {errors.subject}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={fieldId("message")} className={applyLabel}>
            Message / Cover Letter{" "}
            <span aria-hidden="true" className="text-ist-accent-bright">
              *
            </span>
          </label>
          <textarea
            id={fieldId("message")}
            className={cn(applyControl, "min-h-36 resize-y")}
            rows={6}
            value={values.message}
            aria-invalid={Boolean(errors.message)}
            onChange={(e) => setField("message", e.target.value)}
          />
          <p role="alert" className="min-h-5 text-[0.8rem] text-ist-accent-bright">
            {errors.message}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className={applyLabel} id={fieldId("file-label")}>
            File Upload
          </span>
          <input
            ref={fileRef}
            id={fieldId("file")}
            type="file"
            className="sr-only"
            accept={APPLY_FILE.accept}
            aria-labelledby={fieldId("file-label")}
            onChange={(e) => {
              const next = e.target.files?.[0] ?? null;
              setFile(next);
              setErrors((current) => {
                if (!current.file) return current;
                const copy = { ...current };
                delete copy.file;
                return copy;
              });
            }}
          />
          <button
            type="button"
            className="flex min-h-28 w-full flex-col items-center justify-center gap-2 border border-dashed border-ist-line bg-black/40 px-4 py-6 text-ist-muted transition-colors hover:border-ist-accent hover:text-ist-text"
            onClick={() => fileRef.current?.click()}
          >
            <span className="flex h-10 w-10 items-center justify-center border border-ist-line bg-black text-[1.4rem] leading-none text-ist-accent-bright">
              +
            </span>
            <span className="text-[0.9rem]">{file ? file.name : "Add a File"}</span>
          </button>
          <p role="alert" className="min-h-5 text-[0.8rem] text-ist-accent-bright">
            {errors.file}
          </p>
        </div>
      </div>

      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={fieldId("hp")}>Company website</label>
        <input
          ref={honeypot}
          id={fieldId("hp")}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {failure ? (
        <p role="alert" className="mt-4 text-[0.9rem] text-ist-accent-bright">
          {failure}
        </p>
      ) : null}

      <div className="mt-8">
        <Button type="submit" variant="primary" withArrow disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Submit"}
        </Button>
      </div>
    </form>
  );
}
