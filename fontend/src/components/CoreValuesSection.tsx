import React, { useEffect, useState } from "react";
import { useInViewAnimation } from "../hooks/useInViewAnimation";
import { CoreValue, fetchCoreValues } from "../lib/api";

export const CoreValuesSection: React.FC = () => {
  const { ref, animationClass } = useInViewAnimation();
  const [values, setValues] = useState<CoreValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchCoreValues();
        if (mounted) setValues(data);
      } catch {
        if (mounted) setError("Không tải được giá trị cốt lõi.");
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
      ref={ref as React.RefObject<HTMLElement>}
      className={`border-b border-slate-200 bg-slate-50 transition-all duration-700 ease-out ${animationClass}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-10 md:py-16">
        <div className="flex flex-col gap-3 md:gap-4">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-sky-700">
            Core Values
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Giá trị cốt lõi của AHV
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Những nguyên tắc định hình cách AHV đồng hành cùng doanh nghiệp trong hành trình tăng trưởng
            và chuyển đổi số bền vững.
          </p>
        </div>

        <div className="relative mt-8 flex-1">
          <div className="relative grid gap-5 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
          {loading && !values.length && (
            <>
              <div className="h-36 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-36 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-36 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
            </>
          )}
          {!loading &&
            values.map((item, index) => {
              const colorClasses = [
                "from-sky-500/10 via-sky-400/5 to-white border-sky-100",
                "from-emerald-500/10 via-emerald-400/5 to-white border-emerald-100",
                "from-indigo-500/10 via-indigo-400/5 to-white border-indigo-100",
                "from-amber-500/10 via-amber-400/5 to-white border-amber-100",
              ];
              const colorClass = colorClasses[index % colorClasses.length];
              return (
                <div
                  key={item._id}
                  className={`group flex flex-col space-y-2 rounded-2xl border bg-gradient-to-br ${colorClass} p-6 shadow-sm transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5`}
                  style={{
                    transitionDelay: `${index * 60}ms`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[11px] font-semibold text-slate-700 shadow-sm">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="hidden h-px flex-1 rounded-full bg-white/60 md:block" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">
                      {item.title}
                    </p>
                    <p className="text-sm leading-relaxed text-slate-800 line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          {!loading && !values.length && !error && (
            <>
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Dữ liệu làm trung tâm
                </p>
                <p className="text-sm leading-relaxed text-slate-700 line-clamp-3">
                  Mọi quyết định quan trọng đều dựa trên dữ liệu, đo lường được và có khả năng kiểm chứng.
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Hợp tác dài hạn
                </p>
                <p className="text-sm leading-relaxed text-slate-700 line-clamp-3">
                  Xem khách hàng là đối tác, ưu tiên mô hình win-win và gắn bó trong nhiều giai đoạn phát triển.
                </p>
              </div>
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Kết quả đo lường được
                </p>
                <p className="text-sm leading-relaxed text-slate-700 line-clamp-3">
                  Tập trung vào KPI cụ thể như leads, conversion, doanh thu và ROI.
                </p>
              </div>
            </>
          )}
          </div>
        </div>
        {error && (
          <p className="mt-4 text-xs text-red-500">{error}</p>
        )}
      </div>
    </section>
  );
};

