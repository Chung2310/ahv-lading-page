import React, { useEffect, useMemo, useState } from "react";
import { contrastRatio, formatRatio, normalizeHex } from "./colorUtils";

type Props = {
  hex: string;
};

export const ContrastCheckerSection: React.FC<Props> = ({ hex }) => {
  const [textColor, setTextColor] = useState(hex);
  const [bgColor, setBgColor] = useState("#FFFFFF");

  useEffect(() => {
    setTextColor(hex);
  }, [hex]);

  const textHex = useMemo(() => `#${normalizeHex(textColor)}`, [textColor]);
  const bgHex = useMemo(() => normalizeHex(bgColor), [bgColor]);
  const bgHexDisplay = useMemo(() => `#${bgHex}`, [bgHex]);

  const ratio = useMemo(() => contrastRatio(textHex, bgHexDisplay), [textHex, bgHexDisplay]);
  const ratioLabel = formatRatio(ratio);

  const passAA = ratio >= 4.5;
  const passAAA = ratio >= 7;

  const sampleBg = bgHexDisplay;

  return (
    <section className="rounded-3xl border border-white/35 bg-white/70 p-6 shadow-sm backdrop-blur">
      <h2 className="text-2xl font-semibold text-slate-900">Color Contrast Checker</h2>
      <p className="mt-2 text-sm text-slate-600">
        Check WCAG contrast ratio between your text color and background.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr,1fr]">
        <div className="rounded-2xl border border-white/30 bg-white/45 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Text Color</div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-700" htmlFor="text-color">
              HEX
            </label>
            <input
              id="text-color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-white/30 bg-white/80 px-4 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              spellCheck={false}
            />
          </div>
          <div className="mt-3 text-sm font-semibold text-slate-900">{textHex}</div>
        </div>

        <div className="rounded-2xl border border-white/30 bg-white/45 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Background Color
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-slate-700" htmlFor="bg-color">
              HEX
            </label>
            <input
              id="bg-color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="mt-2 h-11 w-full rounded-2xl border border-white/30 bg-white/80 px-4 text-sm text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              spellCheck={false}
            />
          </div>
          <div className="mt-3 text-sm font-semibold text-slate-900">{bgHexDisplay}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr,1fr]">
        <div className="rounded-2xl border border-white/30 bg-white/55 p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Contrast</div>
          <div className="mt-2 text-4xl font-semibold text-slate-900">{ratioLabel}</div>
          <div className="mt-2 text-sm text-slate-600">
            {passAA ? "Pass AA (normal text)" : "Fail AA (normal text)"} ·{" "}
            {passAAA ? "Pass AAA" : "Fail AAA"}
          </div>
        </div>

        <div
          className="rounded-2xl border border-white/25 bg-white/35 p-4"
          style={{ backgroundColor: sampleBg }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Sample</div>
          <p
            className="mt-3 text-base font-semibold"
            style={{ color: textHex }}
          >
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>
      </div>
    </section>
  );
};

