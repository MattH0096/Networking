/** Literal token values, mirrored from globals.css for the /tokens proof page. */

export const SURFACES = [
  { name: "--ist-bg", hex: "#000000", use: "Page base" },
  { name: "--ist-surface", hex: "#000000", use: "Cards, panels" },
  { name: "--ist-surface-raised", hex: "#0A0A0A", use: "Hover, modals, nav overlay" },
] as const;

export const LINES = [
  { name: "--ist-line", hex: "#262626", use: "Hairline dividers, card borders" },
  { name: "--ist-line-strong", hex: "#333333", use: "Emphasis rules" },
] as const;

export const TEXT_COLORS = [
  { name: "--ist-text", hex: "#F0EDE8", use: "Primary" },
  { name: "--ist-text-muted", hex: "#A8A29B", use: "Secondary body" },
  { name: "--ist-text-dim", hex: "#8A857E", use: "Captions, eyebrows — dimmest allowed" },
] as const;

export const ACCENTS = [
  { name: "--ist-accent", hex: "#FA6228", use: "Fills, rules, display type ≥24px bold" },
  { name: "--ist-accent-bright", hex: "#FF7340", use: "Links and orange text under 24px" },
  { name: "--ist-accent-deep", hex: "#C84E20", use: "Pressed states, dense backgrounds" },
] as const;

export const TYPE_SCALE = [
  { role: "Hero", cls: "t-hero", spec: "clamp(2.0625rem, 1.35rem + 2.6vw, 5.25rem) · Archivo Expanded 700" },
  { role: "H1", cls: "t-h1", spec: "clamp(2.25rem, 1.5rem + 2vw, 4.25rem) · Archivo 600" },
  { role: "H2", cls: "t-h2", spec: "clamp(1.75rem, 1.2rem + 1.35vw, 3rem) · Archivo 600" },
  { role: "H3", cls: "t-h3", spec: "clamp(1.25rem, 1rem + 0.7vw, 1.75rem) · Archivo 600" },
  { role: "Lead", cls: "t-lead", spec: "clamp(1.125rem, 1rem + 0.45vw, 1.5rem) · Archivo 400 · 54ch" },
  { role: "Body", cls: "t-body", spec: "clamp(1rem, 0.92rem + 0.2vw, 1.125rem) · Archivo 400 · 68ch" },
  { role: "Small", cls: "t-small", spec: "0.875rem · Archivo 400" },
  { role: "Eyebrow", cls: "t-eyebrow", spec: "0.75rem · Plex Mono 500 · 0.14em · uppercase" },
  { role: "Tag", cls: "t-tag", spec: "0.6875rem · Plex Mono 500 · 0.1em · uppercase" },
] as const;

/** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 */
export const SPACING = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const;

export const RADII = [
  { name: "--r-sm", value: "2px" },
  { name: "--r-md", value: "4px" },
  { name: "--r-lg", value: "6px" },
] as const;

export const MOTION = [
  { name: "--dur-fast", value: "180ms", use: "Hover, border and colour shifts" },
  { name: "--dur-base", value: "320ms", use: "Nav state, overlays" },
  { name: "--dur-slow", value: "600ms", use: "Scroll reveal" },
  { name: "--ease-out", value: "cubic-bezier(0.16, 1, 0.3, 1)", use: "All easing" },
] as const;
