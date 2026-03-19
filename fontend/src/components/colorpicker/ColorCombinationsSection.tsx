import React, { useMemo } from "react";
import {
  hslToRgb,
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  rotateHue,
} from "./colorUtils";

type Props = {
  hex: string;
};

type Swatch = { label: string; hex: string; meta: string };

export const ColorCombinationsSection: React.FC<Props> = ({ hex }) => {
  const base = useMemo(() => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb);
    return { rgb, hsl };
  }, [hex]);

  const swatches = useMemo(() => {
    const mk = (label: string, meta: string, h: number): Swatch => {
      const hsl = rotateHue(base.hsl, h - base.hsl.h);
      const rgb = hslToRgb(hsl);
      return { label, meta, hex: rgbToHex(rgb) };
    };

    const complement = mk("Complement", "Best for: High-impact designs", (base.hsl.h + 180) % 360);
    const analogousA = mk("Analogous A", "Best for: Smooth transitions", (base.hsl.h - 30 + 360) % 360);
    const analogousB = mk("Analogous B", "Best for: Smooth transitions", (base.hsl.h + 30) % 360);
    const triadicA = mk("Triadic A", "Best for: Balanced accents", (base.hsl.h + 120) % 360);
    const triadicB = mk("Triadic B", "Best for: Balanced accents", (base.hsl.h + 240) % 360);

    return { complement, analogousA, analogousB, triadicA, triadicB };
  }, [base]);

  const baseHexDisplay = useMemo(() => `#${hex.replace(/^#/, "").toUpperCase()}`, [hex]);

  return (
    <section className="rounded-3xl border border-white/35 bg-white/70 p-6 shadow-sm backdrop-blur">
      <h2 className="text-2xl font-semibold text-slate-900">Color Combinations</h2>
      <p className="mt-2 text-sm text-slate-600">
        Explore complementary, analogous, and triadic palettes derived from the base color.
      </p>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-white/30 bg-white/45 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Base color
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{baseHexDisplay}</div>
            </div>
            <div
              className="h-10 w-10 rounded-2xl border border-white/25"
              style={{ backgroundColor: baseHexDisplay }}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/30 bg-white/55 p-4">
            <div className="text-sm font-semibold text-slate-900">Complement</div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-700">{swatches.complement.meta}</div>
              <div
                className="h-10 w-10 rounded-2xl border border-white/25"
                style={{ backgroundColor: swatches.complement.hex }}
                aria-hidden="true"
              />
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-600">{swatches.complement.hex}</div>
          </div>

          <div className="rounded-2xl border border-white/30 bg-white/55 p-4">
            <div className="text-sm font-semibold text-slate-900">Analogous</div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-700">Two nearby hues</div>
              <div className="flex gap-2">
                <div
                  className="h-10 w-10 rounded-2xl border border-white/25"
                  style={{ backgroundColor: swatches.analogousA.hex }}
                  aria-hidden="true"
                />
                <div
                  className="h-10 w-10 rounded-2xl border border-white/25"
                  style={{ backgroundColor: swatches.analogousB.hex }}
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-600">
              {swatches.analogousA.hex} / {swatches.analogousB.hex}
            </div>
          </div>

          <div className="rounded-2xl border border-white/30 bg-white/55 p-4">
            <div className="text-sm font-semibold text-slate-900">Triadic</div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-xs font-semibold text-slate-700">Three evenly spaced hues</div>
              <div className="flex gap-2">
                <div
                  className="h-10 w-10 rounded-2xl border border-white/25"
                  style={{ backgroundColor: swatches.triadicA.hex }}
                  aria-hidden="true"
                />
                <div
                  className="h-10 w-10 rounded-2xl border border-white/25"
                  style={{ backgroundColor: swatches.triadicB.hex }}
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-600">
              {swatches.triadicA.hex} / {swatches.triadicB.hex}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

