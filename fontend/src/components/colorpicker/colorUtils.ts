export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const normalizeHex = (input: string) => {
  const raw = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{6}$/.test(raw)) return raw.toUpperCase();
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    const r = raw[0];
    const g = raw[1];
    const b = raw[2];
    return `${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  // Fallback để UI không crash; bạn có thể đổi sau.
  return "E5E5E5";
};

export const hexToRgb = (hex: string): Rgb => {
  const h = normalizeHex(hex);
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return { r, g, b };
};

export const rgbToHsl = ({ r, g, b }: Rgb): Hsl => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;

  let h = 0;
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));

  if (d !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6;
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s: s * 100, l: l * 100 };
};

export const hslToRgb = ({ h, s, l }: Hsl): Rgb => {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = (h % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (0 <= hp && hp < 1) {
    r1 = c;
    g1 = x;
    b1 = 0;
  } else if (1 <= hp && hp < 2) {
    r1 = x;
    g1 = c;
    b1 = 0;
  } else if (2 <= hp && hp < 3) {
    r1 = 0;
    g1 = c;
    b1 = x;
  } else if (3 <= hp && hp < 4) {
    r1 = 0;
    g1 = x;
    b1 = c;
  } else if (4 <= hp && hp < 5) {
    r1 = x;
    g1 = 0;
    b1 = c;
  } else {
    r1 = c;
    g1 = 0;
    b1 = x;
  }

  const m = ln - c / 2;
  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);
  return { r, g, b };
};

export const rgbToHex = ({ r, g, b }: Rgb) => {
  const to = (n: number) => n.toString(16).padStart(2, "0");
  return `#${to(Math.round(r))}${to(Math.round(g))}${to(Math.round(b))}`.toUpperCase();
};

export const mix = (a: Rgb, b: Rgb, t: number): Rgb => ({
  r: a.r + (b.r - a.r) * t,
  g: a.g + (b.g - a.g) * t,
  b: a.b + (b.b - a.b) * t,
});

export const tintShade = (hex: string, steps: number[]) => {
  // Tints: mix with white. Shades: mix with black.
  const base = hexToRgb(hex);
  const white: Rgb = { r: 255, g: 255, b: 255 };
  const black: Rgb = { r: 0, g: 0, b: 0 };

  const tints = steps.map((t) => ({ t, hex: rgbToHex(mix(base, white, t)) }));
  const shades = steps.map((t) => ({ t, hex: rgbToHex(mix(base, black, t)) }));
  return { tints, shades };
};

export const rotateHue = (hsl: Hsl, deg: number): Hsl => {
  let h = hsl.h + deg;
  h = ((h % 360) + 360) % 360;
  return { ...hsl, h };
};

export const wcagRelativeLuminance = ({ r, g, b }: Rgb) => {
  const srgb = [r, g, b].map((v) => v / 255);
  const lin = srgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
};

export const contrastRatio = (fg: string, bg: string) => {
  const L1 = wcagRelativeLuminance(hexToRgb(fg));
  const L2 = wcagRelativeLuminance(hexToRgb(bg));
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const formatRatio = (ratio: number) => {
  if (!Number.isFinite(ratio)) return "0.00";
  return ratio.toFixed(2);
};

