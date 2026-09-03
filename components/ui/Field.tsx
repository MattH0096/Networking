import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Form field shell: label, optional hint, control, and an error slot that is
 * always present in the accessibility tree so screen readers announce a
 * validation failure the moment it appears.
 */

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
};

export function Field({
  id,
  label,
  hint,
  error,
  required,
  children,
  className,
  labelClassName,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className={cn("t-tag text-ist-muted", labelClassName)}>
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

      {hint ? (
        <p id={`${id}-hint`} className="t-small text-ist-dim">
          {hint}
        </p>
      ) : null}

      {children}

      {/* Live region: rendered even when empty so the announcement fires on change. */}
      <p id={`${id}-error`} role="alert" className="t-small min-h-5 text-ist-accent-bright">
        {error}
      </p>
    </div>
  );
}

/** Shared control chrome so inputs, selects and textareas stay identical. */
export const controlClass =
  "w-full rounded-sm border border-ist-line bg-ist-bg px-4 py-3 text-ist-text " +
  "transition-colors duration-[180ms] ease-ist placeholder:text-ist-dim " +
  "hover:border-ist-line-strong focus:border-ist-accent focus:outline-none " +
  "aria-[invalid=true]:border-ist-accent-bright";
