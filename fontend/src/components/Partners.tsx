import React from "react";
import { useInViewAnimation } from "../hooks/useInViewAnimation";

export const Partners: React.FC = () => {
  const { ref, animationClass } = useInViewAnimation();
  return (
    <section
      id="partners"
      ref={ref as React.RefObject<HTMLElement>}
      className={`border-b border-slate-200 bg-white transition-all duration-700 ease-out ${animationClass}`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Hệ sinh thái đối tác
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              AHV hợp tác cùng các nền tảng công nghệ, agency và đơn vị vận hành để mang lại giải
              pháp tổng thể cho khách hàng.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-xs text-slate-700 sm:grid-cols-4">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Nền tảng quảng cáo
            </p>
            <ul className="space-y-1 text-sm">
              <li>• Meta, Google</li>
              <li>• TikTok, Zalo</li>
            </ul>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              CRM &amp; Automation
            </p>
            <ul className="space-y-1 text-sm">
              <li>• HubSpot, Salesforce</li>
              <li>• Nền tảng CRM nội bộ</li>
            </ul>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Hạ tầng &amp; Data
            </p>
            <ul className="space-y-1 text-sm">
              <li>• AWS, GCP, Azure</li>
              <li>• Data warehouse &amp; BI</li>
            </ul>
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Vận hành
            </p>
            <ul className="space-y-1 text-sm">
              <li>• Call center &amp; telesales</li>
              <li>• Đội sale trực tiếp</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

