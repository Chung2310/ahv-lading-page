import React, { useMemo, useState } from "react";
import { normalizeHex } from "./colorUtils";

type Props = {
  hex: string;
};

export const BlindnessSimulatorSection: React.FC<Props> = ({ hex }) => {
  const [mode, setMode] = useState<"normal" | "protanopia" | "deuteranopia" | "tritanopia">("normal");

  const bg = useMemo(() => `#${normalizeHex(hex)}`, [hex]);

  const filterStyle = useMemo(() => {
    // UI-first clone: placeholder filters (visual approximation).
    switch (mode) {
      case "protanopia":
        return { filter: "saturate(0.85) hue-rotate(8deg)" };
      case "deuteranopia":
        return { filter: "saturate(0.9) hue-rotate(-10deg)" };
      case "tritanopia":
        return { filter: "saturate(0.88) hue-rotate(22deg)" };
      default:
        return { filter: "none" };
    }
  }, [mode]);

  return (
    <section className="rounded-3xl border border-white/35 bg-white/70 p-6 shadow-sm backdrop-blur">
      <h2 className="text-2xl font-semibold text-slate-900">Blindness Simulator</h2>
      <p className="mt-2 text-sm text-slate-600">
        Preview how this color might appear under common color-vision deficiencies.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr,1.2fr]">
        <div className="rounded-2xl border border-white/30 bg-white/45 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Simulator Type
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-700" htmlFor="blindness-mode">
              Mode
            </label>
            <select
              id="blindness-mode"
              value={mode}
              onChange={(e) => setMode(e.target.value as typeof mode)}
              className="mt-2 h-11 w-full rounded-2xl border border-white/30 bg-white/80 px-4 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              <option value="normal">Normal</option>
              <option value="protanopia">Protanopia</option>
              <option value="deuteranopia">Deuteranopia</option>
              <option value="tritanopia">Tritanopia</option>
            </select>
          </div>
        </div>

        <div
          className="rounded-2xl border border-white/25 bg-white/35 p-4"
          style={{ backgroundColor: bg }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
            Preview
          </div>
          <div
            className="mt-3 rounded-2xl border border-white/25 bg-white/20 p-6 text-white backdrop-blur"
            style={filterStyle}
          >
            <div className="text-sm font-semibold">Color vision simulation</div>
            <div className="mt-2 text-xs font-semibold text-white/80">
              Mode: {mode}
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            Note: This is a visual approximation for UI clone.
          </div>
        </div>
      </div>
    </section>
  );
};

