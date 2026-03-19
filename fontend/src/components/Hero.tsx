import React from "react";
import { Link } from "react-router-dom";
import { useInViewAnimation } from "../hooks/useInViewAnimation";

export const Hero: React.FC = () => {
  const { ref, animationClass } = useInViewAnimation();
  return (
    <section
      id="hero"
      ref={ref as React.RefObject<HTMLElement>}
      className={`relative min-h-screen overflow-hidden border-b border-slate-200 bg-slate-950 transition-all duration-700 ease-out ${animationClass}`}
    >
      <img
        src="/hero-bg.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover contrast-110 saturate-110"
        loading="eager"
        decoding="async"
      />
      <div className="pointer-events-none absolute inset-0 bg-slate-950/45" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/35 via-transparent to-slate-950/60" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-12 px-4 py-20 md:flex-row md:py-28">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium text-white shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Đối tác chiến lược cho sự phát triển bền vững
          </p>

          <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            AHV Holding
            <span className="block text-transparent bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text">
              tăng tốc tăng trưởng doanh nghiệp bằng công nghệ &amp; dữ liệu
            </span>
          </h1>

          <p className="max-w-xl text-balance text-sm leading-relaxed text-white/80 sm:text-base">
            AHV Holding cung cấp hệ sinh thái giải pháp công nghệ, AI và đầu tư giúp doanh nghiệp
            tối ưu vận hành, mở rộng khách hàng và tăng trưởng doanh thu bền vững.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/lien-he"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:bg-sky-700"
            >
              Liên hệ ngay
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/dich-vu"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15 backdrop-blur"
            >
              Xem giải pháp
            </Link>
          </div>

          <dl className="grid grid-cols-2 gap-4 pt-4 text-xs text-white/80 sm:grid-cols-4 sm:text-sm">
            <div>
              <dt className="text-white/60">Dự án triển khai</dt>
              <dd className="text-base font-semibold text-white sm:text-lg">50+ doanh nghiệp</dd>
            </div>
            <div>
              <dt className="text-white/60">Ngành nghề</dt>
              <dd className="text-base font-semibold text-white sm:text-lg">Tài chính, BĐS, SME</dd>
            </div>
            <div>
              <dt className="text-white/60">Tăng trưởng trung bình</dt>
              <dd className="text-base font-semibold text-emerald-400 sm:text-lg">+35%/năm</dd>
            </div>
            <div>
              <dt className="text-white/60">Thời gian triển khai</dt>
              <dd className="text-base font-semibold text-white sm:text-lg">&lt; 8 tuần</dd>
            </div>
          </dl>
        </div>

        <div className="flex-1">
          <div className="relative mx-auto max-w-md rounded-3xl border border-white/15 bg-white/10 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.18)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-white">Bảng điều khiển tăng trưởng</p>
                <p className="text-[11px] text-white/70">
                  Kết nối dữ liệu marketing, CRM &amp; doanh thu
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-semibold text-emerald-200">
                Realtime
              </span>
            </div>

            <div className="space-y-4 rounded-2xl bg-white/10 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] text-white/70">Doanh thu pipeline</p>
                  <p className="text-lg font-semibold text-white">+42% QoQ</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-sky-500/15 px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  <span className="text-[10px] font-medium text-sky-200">AI Forecast</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-[11px]">
                <div className="space-y-1 rounded-xl border border-white/15 bg-white/10 p-3">
                  <p className="text-white/70">Leads</p>
                  <p className="text-base font-semibold text-white">12.4K</p>
                  <p className="text-emerald-300">+18%</p>
                </div>
                <div className="space-y-1 rounded-xl border border-white/15 bg-white/10 p-3">
                  <p className="text-white/70">Conversion</p>
                  <p className="text-base font-semibold text-white">4.7%</p>
                  <p className="text-emerald-300">+1.2pt</p>
                </div>
                <div className="space-y-1 rounded-xl border border-white/15 bg-white/10 p-3">
                  <p className="text-white/70">ROI</p>
                  <p className="text-base font-semibold text-white">3.4x</p>
                  <p className="text-emerald-300">+0.6x</p>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-white/70">
                Nền tảng của AHV kết nối dữ liệu từ nhiều kênh (Facebook, Google, CRM, Call Center...)
                để tự động hoá báo cáo và tối ưu chiến dịch theo thời gian thực.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

