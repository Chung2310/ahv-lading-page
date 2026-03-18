import React from "react";
import { Link } from "react-router-dom";

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-slate-200 bg-white"
    >
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-sky-100 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-sky-100 blur-3xl" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 md:flex-row md:py-20">
        <div className="flex-1 space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Đối tác chiến lược cho sự phát triển bền vững
          </p>

          <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            AHV Holding
            <span className="block text-transparent bg-gradient-to-r from-sky-600 to-sky-500 bg-clip-text">
              tăng tốc tăng trưởng doanh nghiệp bằng công nghệ &amp; dữ liệu
            </span>
          </h1>

          <p className="max-w-xl text-balance text-sm leading-relaxed text-slate-600 sm:text-base">
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
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Xem giải pháp
            </Link>
          </div>

          <dl className="grid grid-cols-2 gap-4 pt-4 text-xs text-slate-600 sm:grid-cols-4 sm:text-sm">
            <div>
              <dt className="text-slate-500">Dự án triển khai</dt>
              <dd className="text-base font-semibold text-slate-900 sm:text-lg">50+ doanh nghiệp</dd>
            </div>
            <div>
              <dt className="text-slate-500">Ngành nghề</dt>
              <dd className="text-base font-semibold text-slate-900 sm:text-lg">Tài chính, BĐS, SME</dd>
            </div>
            <div>
              <dt className="text-slate-500">Tăng trưởng trung bình</dt>
              <dd className="text-base font-semibold text-emerald-400 sm:text-lg">+35%/năm</dd>
            </div>
            <div>
              <dt className="text-slate-500">Thời gian triển khai</dt>
              <dd className="text-base font-semibold text-slate-900 sm:text-lg">&lt; 8 tuần</dd>
            </div>
          </dl>
        </div>

        <div className="flex-1">
          <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="mb-3 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-slate-900">Bảng điều khiển tăng trưởng</p>
                <p className="text-[11px] text-slate-500">
                  Kết nối dữ liệu marketing, CRM &amp; doanh thu
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                Realtime
              </span>
            </div>

            <div className="space-y-4 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] text-slate-500">Doanh thu pipeline</p>
                  <p className="text-lg font-semibold text-slate-900">+42% QoQ</p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-sky-50 px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                  <span className="text-[10px] font-medium text-sky-700">AI Forecast</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-[11px]">
                <div className="space-y-1 rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-slate-500">Leads</p>
                  <p className="text-base font-semibold text-slate-900">12.4K</p>
                  <p className="text-emerald-600">+18%</p>
                </div>
                <div className="space-y-1 rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-slate-500">Conversion</p>
                  <p className="text-base font-semibold text-slate-900">4.7%</p>
                  <p className="text-emerald-600">+1.2pt</p>
                </div>
                <div className="space-y-1 rounded-xl border border-slate-200 bg-white p-3">
                  <p className="text-slate-500">ROI</p>
                  <p className="text-base font-semibold text-slate-900">3.4x</p>
                  <p className="text-emerald-600">+0.6x</p>
                </div>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-500">
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

