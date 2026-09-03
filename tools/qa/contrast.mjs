/**
 * Prints the contrast ratio for every text/accent colour over every surface,
 * so palette regressions show up as a failing check rather than a judgement call.
 *
 *   node tools/qa/contrast.mjs
 */
const SURFACES = [
  ["--ist-bg", "#0D0D0D"],
  ["--ist-surface", "#141414"],
  ["--ist-surface-raised", "#1A1A1A"],
];

/** `min` is the ratio this colour must clear for the role the spec gives it. */
const FOREGROUNDS = [
  ["--ist-text", "#F0EDE8", 4.5, "body"],
  ["--ist-text-muted", "#A8A29B", 4.5, "body"],
  ["--ist-text-dim", "#8A857E", 4.5, "body"],
  ["--ist-accent-bright", "#FF7340", 4.5, "links / small orange text"],
  ["--ist-accent", "#FA6228", 3, "large display type, fills, rules"],
  ["--ist-line", "#262626", 0, "decorative hairline — exempt"],
  ["--ist-line-strong", "#333333", 0, "decorative rule — exempt"],
];

function channel(v) {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function ratio(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)];
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

let failures = 0;

for (const [fgName, fg, min, role] of FOREGROUNDS) {
  const results = SURFACES.map(([, bg]) => ratio(fg, bg));
  const worst = Math.min(...results);
  const ok = min === 0 || worst >= min;
  if (!ok) failures += 1;

  const cells = SURFACES.map(([sName], i) => `${sName.replace("--ist-", "")} ${results[i].toFixed(2)}`).join("  ·  ");
  const gate = min === 0 ? "n/a " : `≥${min}`;
  console.log(`${ok ? "PASS" : "FAIL"}  ${gate}  ${fgName.padEnd(21)} ${cells}   (${role})`);
}

console.log(failures ? `\n${failures} colour(s) below their required ratio.` : "\nAll colours clear their required ratio.");
process.exitCode = failures ? 1 : 0;
