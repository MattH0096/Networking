import { Archivo, IBM_Plex_Mono } from "next/font/google";

/**
 * Primary face — Archivo. Used for body, headings, and the hero support line.
 * The `wdth` axis is available for display cuts that need a slight expand.
 */
export const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
  preload: true,
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex-mono",
  preload: false,
});

export const fontVariables = [archivo.variable, plexMono.variable].join(" ");
