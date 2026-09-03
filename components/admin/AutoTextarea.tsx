"use client";

import { useLayoutEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  /** Minimum visible lines before content grows. */
  minRows?: number;
};

/** Textarea that grows with content — no inner scrollbar. */
export function AutoTextarea({ value, onChange, className, minRows = 2 }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.max(el.scrollHeight, minRows * 24);
    el.style.height = `${next}px`;
  }, [value, minRows]);

  return (
    <textarea
      ref={ref}
      value={value}
      rows={minRows}
      onChange={(e) => onChange(e.target.value)}
      className={`resize-none overflow-hidden ${className ?? ""}`}
    />
  );
}
