import React, { useEffect, useState } from "react";
import { useInViewAnimation } from "../hooks/useInViewAnimation";
import { Milestone, fetchMilestones } from "../lib/api";

export const Achievements: React.FC = () => {
  const { ref, animationClass, inView } = useInViewAnimation();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchMilestones();
        if (mounted) setMilestones(data);
      } catch {
        if (mounted) setError("Không tải được các cột mốc.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section
      id="achievements"
      ref={ref as React.RefObject<HTMLElement>}
      className={`border-b border-slate-200 bg-white transition-all duration-700 ease-out ${animationClass}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-10 md:py-16">
        <div className="flex flex-col items-start gap-3 md:gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-sky-700">
            Milestones
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Các cột mốc quan trọng
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Hành trình xây dựng nền tảng, tăng tốc và mở rộng quy mô của AHV Holding qua từng giai đoạn phát triển.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative mt-8 flex-1">
          {/* Loading skeleton */}
          {loading && !milestones.length && (
            <div className="relative mx-auto mt-4 max-w-4xl">
              <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 rounded-full bg-sky-100" />
              <div className="space-y-8">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="relative flex items-center justify-center gap-6 py-6 opacity-70"
                  >
                    <div className="absolute left-1/2 -translate-x-1/2">
                      <div className="h-4 w-4 rounded-full border-2 border-white bg-sky-300 shadow-[0_0_18px_rgba(56,189,248,0.55)]" />
                    </div>
                    <div className="h-16 w-40 rounded-2xl bg-slate-100/80 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline layout */}
          {!loading && milestones.length > 0 && (
            <div className="relative mx-auto mt-4 max-w-4xl">
              {/* Vertical line */}
              <div
                className={`absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-200 via-sky-400/60 to-sky-100 transition-transform duration-700 ease-out ${
                  inView ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                }`}
                style={{ transformOrigin: "top" }}
              />
              <div className="space-y-8 md:space-y-10">
                {milestones
                  .slice()
                  .sort(
                    (a, b) =>
                      (a.order ?? a.date ?? 0) - (b.order ?? b.date ?? 0)
                  )
                  .map((m, index) => {
                    const isLeft = index % 2 === 0;
                    return (
                      <div
                        key={m._id}
                        className={`relative flex items-center gap-6 py-4 md:gap-10 md:py-5 transition-all duration-700 ease-out ${
                          isLeft ? "justify-start md:pr-8" : "justify-end md:pl-8"
                        } ${
                          inView
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-4"
                        }`}
                        style={{ transitionDelay: `${index * 90}ms` }}
                      >
                        {/* Dot */}
                        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
                          <div
                            className={`relative flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 shadow-[0_0_20px_rgba(56,189,248,0.6)] ring-[3px] ring-white ${
                              inView ? "timeline-dot" : ""
                            }`}
                          />
                        </div>

                        {/* Card */}
                        <div
                          className={`max-w-sm rounded-2xl bg-white/95 px-4 py-4 shadow-md ring-1 ring-slate-200/70 backdrop-blur-sm md:px-5 ${
                            isLeft ? "text-right md:pr-10" : "text-left md:pl-10"
                          }`}
                        >
                          <p className="text-2xl font-extrabold tracking-tight text-sky-600 sm:text-3xl">
                            {m.date ?? ""}
                          </p>
                          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            {m.title}
                          </p>
                          {m.description && (
                            <p className="mt-2 text-sm leading-relaxed text-slate-700 line-clamp-3">
                              {m.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {!loading && !milestones.length && !error && (
          <p className="mt-8 text-center text-xs text-slate-500">
            Hiện chưa có cột mốc nào được cấu hình trong hệ thống.
          </p>
        )}

        {error && (
          <p className="mt-4 text-xs text-red-500">{error}</p>
        )}
      </div>
    </section>
  );
};

