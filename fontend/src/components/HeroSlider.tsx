import React, { useEffect, useState } from "react";
import { useInViewAnimation } from "../hooks/useInViewAnimation";

const slides = [
  {
    id: 1,
    title: "Giải pháp công nghệ & dữ liệu cho doanh nghiệp",
    subtitle: "Tăng tốc tăng trưởng với nền tảng AI, automation và hệ sinh thái đối tác của AHV Holding.",
    badge: "AHV Holding",
    image: "/image/banner1.svg",
  },
  {
    id: 2,
    title: "Xây hệ thống tăng trưởng bền vững",
    subtitle: "Kết nối marketing, sale, vận hành và data thành một bức tranh thống nhất, đo lường được.",
    badge: "Tăng trưởng bền vững",
    image: "/image/banner2.svg",
  },
  {
    id: 3,
    title: "Đồng hành như một bộ phận nội bộ",
    subtitle: "Tư duy đối tác dài hạn, chia sẻ rủi ro và cùng cam kết theo KPI tăng trưởng.",
    badge: "Đồng hành dài hạn",
    image: "/image/banner3.svg",
  },
];

export const HeroSlider: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { ref, animationClass } = useInViewAnimation();

  const next = () => setActiveIndex((prev) => (prev + 1) % slides.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);

  // Tự động chuyển slide
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`relative overflow-hidden border-b border-slate-200 transition-all duration-700 ease-out ${animationClass}`}
    >
      {/* Ảnh banner làm background */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <img
            key={slide.id}
            src={slide.image}
            alt={slide.title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-slate-900/55 backdrop-blur-[1px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="w-full overflow-hidden md:w-auto md:flex-1">
            <div
              className="flex transition-transform duration-900 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="min-w-full space-y-4 md:space-y-6">
                  <p className="inline-flex items-center gap-2 rounded-full border border-sky-300/70 bg-sky-500/20 px-3 py-1 text-[11px] font-medium text-sky-100 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    {slide.badge}
                  </p>
                  <h1 className="text-balance text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl lg:text-4xl">
                    {slide.title}
                  </h1>
                  <p className="max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
                    {slide.subtitle}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 pt-1">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === activeIndex ? "w-8 bg-sky-600" : "w-3 bg-slate-300 hover:bg-sky-400"
                  }`}
                  aria-label={`Chuyển tới slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="hidden h-40 w-64 flex-none rounded-3xl border border-slate-200 bg-white/70 p-4 text-xs text-slate-600 shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:block lg:h-48 lg:w-80">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Tổng quan hệ sinh thái
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <p className="text-slate-500">Dự án</p>
                <p className="text-base font-semibold text-slate-900">50+</p>
                <p className="text-[10px] text-emerald-600">Triển khai</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <p className="text-slate-500">Ngành</p>
                <p className="text-base font-semibold text-slate-900">8+</p>
                <p className="text-[10px] text-emerald-600">Lĩnh vực</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <p className="text-slate-500">ROI</p>
                <p className="text-base font-semibold text-slate-900">3-7x</p>
                <p className="text-[10px] text-emerald-600">Theo mô hình</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 text-xs text-slate-500 md:mt-6">
          <button
            type="button"
            onClick={prev}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
          >
            ← Trước
          </button>
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50"
          >
            Sau →
          </button>
          <span className="ml-2">
            Slide {activeIndex + 1}/{slides.length}
          </span>
        </div>
      </div>
    </section>
  );
};

