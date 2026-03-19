import React, { useMemo } from "react";
import { hexToRgb, rgbToHex, tintShade } from "./colorUtils";

type Props = {
  hex: string;
};

export const VariationsSection: React.FC<Props> = ({ hex }) => {
  // Steps mô phỏng theo kiểu "10% increments"
  const steps = useMemo(() => [0.1, 0.2, 0.3, 0.4, 0.5], []);

  const { tints, shades } = useMemo(() => tintShade(hex, steps), [hex, steps]);
  const baseRgb = useMemo(() => hexToRgb(hex), [hex]);

  return (
    <section className="rounded-3xl border border-white/35 bg-white/70 p-6 shadow-sm backdrop-blur">
      <h2 className="text-2xl font-semibold text-slate-900">Variations</h2>
      <p className="mt-2 text-sm text-slate-600">
        Tints are created by mixing the color with white. Shades are created by mixing with black.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-sm font-semibold text-slate-900">Shades</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {shades.map((s) => (
              <div
                key={s.t}
                className="rounded-2xl border border-white/30 bg-white/45 p-3"
              >
                <div
                  className="h-10 w-full rounded-xl border border-white/25"
                  style={{ backgroundColor: s.hex }}
                  aria-hidden="true"
                />
                <div className="mt-2 text-xs font-semibold text-slate-700">{s.hex}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900">Tints</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {tints.map((t) => (
              <div
                key={t.t}
                className="rounded-2xl border border-white/30 bg-white/45 p-3"
              >
                <div
                  className="h-10 w-full rounded-xl border border-white/25"
                  style={{ backgroundColor: t.hex }}
                  aria-hidden="true"
                />
                <div className="mt-2 text-xs font-semibold text-slate-700">{t.hex}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/30 bg-white/45 p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Base color (for reference)
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div
            className="h-10 w-10 rounded-2xl border border-white/25"
            style={{ backgroundColor: rgbToHex(baseRgb) }}
            aria-hidden="true"
          />
          <div>
            <div className="text-sm font-semibold text-slate-900">
              HEX #{hex.toUpperCase()}
            </div>
            <div className="text-sm text-slate-600">
              RGB {baseRgb.r}, {baseRgb.g}, {baseRgb.b}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

