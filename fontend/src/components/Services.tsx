import React, { useEffect, useState } from "react";
import { useInViewAnimation } from "../hooks/useInViewAnimation";
import { OperatingField, fetchOperatingFields } from "../lib/api";

export const Services: React.FC = () => {
  const { ref, animationClass } = useInViewAnimation();
  const [fields, setFields] = useState<OperatingField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchOperatingFields();
        if (mounted) setFields(data);
      } catch {
        if (mounted) setError("Không tải được lĩnh vực hoạt động.");
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
      id="services"
      ref={ref as React.RefObject<HTMLElement>}
      className={`border-b border-slate-200 bg-white transition-all duration-700 ease-out ${animationClass}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-10 md:py-16">
        <div className="flex flex-col items-start gap-3 md:gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-sky-700">
            Solutions &amp; Services
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Lĩnh vực hoạt động &amp; giải pháp
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            AHV Holding cung cấp bộ giải pháp end-to-end giúp doanh nghiệp xây dựng nền tảng tăng trưởng
            dựa trên dữ liệu, tự động hoá và tối ưu vận hành.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading && !fields.length && (
            <>
              <div className="h-40 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-40 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-40 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
            </>
          )}
          {!loading &&
            fields.map((field, index) => {
              const colorClasses = [
                "from-sky-500/10 via-sky-400/5 to-white border-sky-100",
                "from-emerald-500/10 via-emerald-400/5 to-white border-emerald-100",
                "from-indigo-500/10 via-indigo-400/5 to-white border-indigo-100",
                "from-amber-500/10 via-amber-400/5 to-white border-amber-100",
              ];
              const colorClass = colorClasses[index % colorClasses.length];
              return (
                <article
                  key={field._id}
                  className={`group flex flex-col rounded-2xl border bg-gradient-to-br ${colorClass} p-6 shadow-sm transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10`}
                  style={{
                    transitionDelay: `${index * 60}ms`,
                  }}
                >
                  <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-sky-600 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <span className="text-sm font-semibold">
                      {field.name
                        .split(" ")
                        .slice(0, 2)
                        .map((p) => p.charAt(0))
                        .join("")}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                    {field.name}
                  </h3>
                  {field.description && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-700 line-clamp-3">
                      {field.description}
                    </p>
                  )}
                </article>
              );
            })}
        </div>
        {!loading && !fields.length && !error && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
            <p className="text-sm font-medium text-slate-700">
              Chưa có dữ liệu “lĩnh vực hoạt động” từ API.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Vui lòng thêm dữ liệu ở backend hoặc kiểm tra lại endpoint `/api/v1/operating-fields`.
            </p>
          </div>
        )}
        {error && (
          <p className="mt-4 text-xs text-red-500">{error}</p>
        )}
      </div>
    </section>
  );
};

