import React, { useMemo } from "react";
import { hexToRgb, normalizeHex, rgbToHsl } from "./colorUtils";

type Props = {
  hex: string;
  onHexChange: (nextHex: string) => void;
};

export const ColorConversionCard: React.FC<Props> = ({ hex, onHexChange }) => {
  const normalized = useMemo(() => normalizeHex(hex), [hex]);
  const hexDisplay = `#${normalized}`;

  const rgb = useMemo(() => hexToRgb(normalized), [normalized]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);

  return (
    <section className="rounded-3xl border border-white/35 bg-white/70 p-6 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Color Conversion</h2>
          <p className="mt-2 text-sm text-slate-600">
            Enter a HEX value and see RGB + HSL conversions.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:w-[280px]">
          <label className="text-sm font-medium text-slate-700" htmlFor="hex-input">
            HEX
          </label>
          <input
            id="hex-input"
            value={hex}
            onChange={(e) => onHexChange(e.target.value)}
            className="h-11 rounded-2xl border border-white/30 bg-white/80 px-4 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            spellCheck={false}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/30 bg-white/45 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            HEX
          </div>
          <div className="mt-2 text-lg font-semibold text-slate-900">{hexDisplay}</div>
        </div>

        <div className="rounded-2xl border border-white/30 bg-white/45 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            RGB
          </div>
          <div className="mt-2 text-lg font-semibold text-slate-900">
            {rgb.r}, {rgb.g}, {rgb.b}
          </div>
        </div>

        <div className="rounded-2xl border border-white/30 bg-white/45 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            HSL
          </div>
          <div className="mt-2 text-lg font-semibold text-slate-900">
            {Math.round(hsl.h)}, {Math.round(hsl.s)}, {Math.round(hsl.l)}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/30 bg-white/55 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Preview
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">{hexDisplay}</div>
          </div>
          <div
            className="h-10 w-10 rounded-2xl border border-white/25"
            style={{ backgroundColor: hexDisplay }}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

