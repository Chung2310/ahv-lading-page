import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ColorConversionCard } from "../components/colorpicker/ColorConversionCard";
import { VariationsSection } from "../components/colorpicker/VariationsSection";
import { ColorCombinationsSection } from "../components/colorpicker/ColorCombinationsSection";
import { ContrastCheckerSection } from "../components/colorpicker/ContrastCheckerSection";
import { BlindnessSimulatorSection } from "../components/colorpicker/BlindnessSimulatorSection";
import { normalizeHex } from "../components/colorpicker/colorUtils";

export const ColorCodePage: React.FC = () => {
  const params = useParams();
  const hexParam = params.hex || "2596BE";

  const [hexInput, setHexInput] = useState(hexParam);
  const [activeTab, setActiveTab] = useState<"image" | "picker">("picker");

  const normalizedHex = useMemo(() => normalizeHex(hexInput), [hexInput]);
  const hexWithHash = `#${normalizedHex}`;

  return (
    <div className="relative">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Hero */}
        <section className="pt-8 md:pt-10 text-center">
          <div className="text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
            {hexWithHash}
          </div>
          <div className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl">
            Trình tạo mã màu &
          </div>
          <div className="text-3xl font-semibold leading-tight tracking-tight text-slate-900 md:text-4xl">
            Color Picker
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 md:text-base">
            Tạo mã màu, biến thể, hài hòa và kiểm tra tỷ lệ tương phản.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("image")}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                activeTab === "image"
                  ? "border-white/45 bg-white/75 text-slate-900 shadow-sm"
                  : "border-white/25 bg-white/35 text-slate-700 hover:bg-white/45"
              }`}
            >
              Chọn màu từ hình ảnh
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("picker")}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                activeTab === "picker"
                  ? "border-white/45 bg-white/75 text-slate-900 shadow-sm"
                  : "border-white/25 bg-white/35 text-slate-700 hover:bg-white/45"
              }`}
            >
              Color Picker
            </button>
          </div>
        </section>

        {/* Preview + Tools */}
        <section className="mt-12">
          <div className="grid gap-6 lg:grid-cols-[240px,1fr] lg:items-start">
            <aside className="sticky top-24 hidden lg:block">
              <div className="rounded-3xl border border-white/35 bg-white/55 p-5 shadow-sm backdrop-blur">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                  Về màu này
                </div>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <div className="flex items-center justify-between rounded-2xl bg-white/60 px-3 py-2">
                    <span>Chuyển đổi màu</span>
                    <span className="h-2 w-2 rounded-full bg-ahv-primary" aria-hidden="true" />
                  </div>
                  <div className="flex items-center justify-between rounded-2xl px-3 py-2 hover:bg-white/40">
                    <span>Biến thể</span>
                    <span className="text-slate-400" aria-hidden="true">
                      ·
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl px-3 py-2 hover:bg-white/40">
                    <span>Color Combinations</span>
                    <span className="text-slate-400" aria-hidden="true">
                      ·
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/30 pt-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                  Quick actions
                </div>
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <div className="rounded-2xl bg-white/60 px-3 py-2">Copy HEX</div>
                  <div className="rounded-2xl bg-white/40 px-3 py-2">Check contrast</div>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              <ColorConversionCard hex={hexInput} onHexChange={setHexInput} />
              <VariationsSection hex={normalizedHex} />
              <ColorCombinationsSection hex={normalizedHex} />
              <ContrastCheckerSection hex={normalizedHex} />
              <BlindnessSimulatorSection hex={normalizedHex} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

