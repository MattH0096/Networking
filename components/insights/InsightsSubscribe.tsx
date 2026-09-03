"use client";

import { useId, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { controlClass } from "@/components/ui/Field";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const HONEYPOT = "company_website";

type Status = "idle" | "sending" | "done" | "failed";

function BookMarkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 6h7a5 5 0 0 1 5 5v13l-5.5-3.2L9 24V6z" />
      <path d="M15 6h9v18l-4.5-2.6" />
    </svg>
  );
}

/**
 * Insights subscribe strip — sits above the page CTA.
 * Email-only capture; no public inbox address in markup.
 */
export function InsightsSubscribe({
  className,
  heading = "Advance the future of networked intelligence.",
  lead = "Stay informed with the latest research, technical papers, and perspectives from the IST team.",
  cta = "Subscribe for Updates",
  note = "No spam. Unsubscribe anytime.",
  successTitle = "You're on the list.",
  successBody = "We'll send research updates — nothing else.",
}: {
  className?: string;
  heading?: string;
  lead?: string;
  cta?: string;
  note?: string;
  successTitle?: string;
  successBody?: string;
}) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Please enter a valid work email.");
      return;
    }

    setError("");
    setFailure("");
    setStatus("sending");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          source: "insights",
          [HONEYPOT]: honeypot.current?.value ?? "",
        }),
      });

      if (response.status === 422) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Please enter a valid work email.");
        setStatus("idle");
        return;
      }

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setFailure(data.error ?? "Something went wrong. Please try again.");
        setStatus("failed");
        return;
      }

      setEmail("");
      setStatus("done");
    } catch {
      setFailure("We could not reach the server. Please check your connection and try again.");
      setStatus("failed");
    }
  }

  return (
    <section className={cn("bg-ist-bg pb-4 pt-4 sm:pb-6 sm:pt-2", className)}>
      <div className="container-ist">
        <Reveal variant="expand">
          <div className="chassis chassis--inert relative isolate overflow-hidden">
            {/* Soft accent wash — atmosphere without competing with the CTA band */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-ist-accent/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-ist-accent to-transparent opacity-80"
            />

            <div className="chassis__viewport relative flex flex-col gap-8 px-6 py-8 sm:px-8 sm:py-9 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-10 lg:py-10">
              <div className="flex min-w-0 flex-1 items-start gap-5 sm:items-center sm:gap-6">
                <div
                  aria-hidden="true"
                  className="relative flex h-16 w-16 shrink-0 items-center justify-center text-ist-accent-bright"
                >
                  <span className="absolute inset-0 rounded-full border border-ist-accent/35" />
                  <span className="absolute inset-2 rounded-full border border-ist-accent/70" />
                  <BookMarkIcon />
                </div>

                <div className="min-w-0">
                  <h2 className="text-[1.2rem] font-semibold leading-snug text-balance text-ist-text sm:text-[1.35rem] lg:text-[1.45rem]">
                    {heading}
                  </h2>
                  <p className="mt-2 max-w-xl text-[0.95rem] leading-relaxed text-ist-muted sm:text-base">
                    {lead}
                  </p>
                </div>
              </div>

              <div className="w-full shrink-0 lg:w-[min(100%,27rem)]">
                {status === "done" ? (
                  <div className="border border-ist-accent/40 bg-ist-accent-wash px-5 py-4">
                    <p className="text-[0.95rem] font-medium text-ist-text">{successTitle}</p>
                    <p className="t-small mt-1 text-ist-muted">{successBody}</p>
                    <button
                      type="button"
                      className="t-tag mt-3 text-ist-accent-bright underline-offset-4 hover:underline"
                      onClick={() => setStatus("idle")}
                    >
                      Add another email
                    </button>
                  </div>
                ) : (
                  <form noValidate onSubmit={onSubmit} className="flex flex-col gap-3">
                    <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
                      <label htmlFor={`${id}-${HONEYPOT}`}>Company website</label>
                      <input
                        ref={honeypot}
                        id={`${id}-${HONEYPOT}`}
                        name={HONEYPOT}
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        defaultValue=""
                      />
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                      <label className="sr-only" htmlFor={`${id}-email`}>
                        Work email
                      </label>
                      <input
                        id={`${id}-email`}
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        className={cn(controlClass, "w-full min-w-0 sm:min-w-[13.5rem] sm:flex-1")}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? `${id}-email-error` : `${id}-note`}
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        withArrow
                        disabled={status === "sending"}
                        className="shrink-0 justify-center sm:max-w-none"
                      >
                        {status === "sending" ? "Subscribing…" : cta}
                      </Button>
                    </div>

                    {error ? (
                      <p id={`${id}-email-error`} role="alert" className="t-small text-ist-accent-bright">
                        {error}
                      </p>
                    ) : null}
                    {status === "failed" ? (
                      <p role="alert" className="t-small text-ist-accent-bright">
                        {failure}
                      </p>
                    ) : null}

                    <p id={`${id}-note`} className="t-small text-ist-dim">
                      {note}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
