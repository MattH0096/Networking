/** WCAG 2.1 relative luminance and contrast ratio, used to verify the palette. */

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;

  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

export type ContrastVerdict = {
  ratio: number;
  label: string;
  /** Passes AA for normal-size body text (< 18.66px bold / < 24px regular). */
  passesBodyAA: boolean;
  /** Passes AA for large text (≥ 24px, or ≥ 18.66px bold). */
  passesLargeAA: boolean;
  /** Passes AA for non-text UI such as rules, icons, and borders. */
  passesUiAA: boolean;
};

export function verdict(foreground: string, background: string): ContrastVerdict {
  const ratio = contrastRatio(foreground, background);
  return {
    ratio,
    label: `${ratio.toFixed(2)}:1`,
    passesBodyAA: ratio >= 4.5,
    passesLargeAA: ratio >= 3,
    passesUiAA: ratio >= 3,
  };
}
