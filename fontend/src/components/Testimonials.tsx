import React, { useEffect, useState } from "react";
import { useInViewAnimation } from "../hooks/useInViewAnimation";
import { CustomerFeedback, fetchCustomerFeedbacks } from "../lib/api";

export const Testimonials: React.FC = () => {
  const { ref, animationClass } = useInViewAnimation();
  const [items, setItems] = useState<CustomerFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchCustomerFeedbacks();
        if (mounted) setItems(data);
      } catch {
        if (mounted) setError("Không tải được phản hồi khách hàng.");
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
      id="testimonials"
      ref={ref as React.RefObject<HTMLElement>}
      className={`border-b border-slate-200 bg-slate-50 transition-all duration-700 ease-out ${animationClass}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-10 md:py-16">
        <div className="flex flex-col items-start gap-3 md:gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-sky-700">
            Client Stories
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Khách hàng nói gì về AHV
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Những phản hồi tiêu biểu từ đối tác ở nhiều ngành khác nhau sau khi đồng hành cùng AHV Holding.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading && !items.length && (
            <>
              <div className="h-40 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-40 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-40 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
            </>
          )}
          {!loading &&
            items.map((fb, index) => {
              const colorClasses = [
                "from-sky-500/10 via-sky-400/5 to-white border-sky-100",
                "from-emerald-500/10 via-emerald-400/5 to-white border-emerald-100",
                "from-indigo-500/10 via-indigo-400/5 to-white border-indigo-100",
                "from-amber-500/10 via-amber-400/5 to-white border-amber-100",
              ];
              const colorClass = colorClasses[index % colorClasses.length];
              return (
                <figure
                  key={fb._id}
                  className={`group flex h-full flex-col rounded-2xl border bg-gradient-to-br ${colorClass} p-6 shadow-sm transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10`}
                  style={{
                    transitionDelay: `${index * 60}ms`,
                  }}
                >
                  <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-sm text-sky-500 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    “
                  </div>
                  <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-slate-800 line-clamp-4">
                    {fb.content}
                  </blockquote>
                  <figcaption className="mt-4 text-xs text-slate-600">
                    <div className="flex items-center gap-3">
                      {fb.avatarUrl && (
                        <img
                          src={fb.avatarUrl}
                          alt={fb.customerName}
                          className="h-8 w-8 flex-shrink-0 rounded-full border border-slate-200 object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">
                          {fb.customerName}
                        </p>
                        {(fb.position || fb.company) && (
                          <p className="text-[11px] text-slate-600">
                            {[fb.position, fb.company].filter(Boolean).join(" - ")}
                          </p>
                        )}
                      </div>
                    </div>
                    {(typeof fb.order === "number" || fb.status) && (
                      <p className="mt-1 text-[11px] text-slate-500">
                        {typeof fb.order === "number" && `Thứ tự: ${fb.order}`}
                        {typeof fb.order === "number" && fb.status ? " · " : ""}
                        {fb.status}
                      </p>
                    )}
                  </figcaption>
                </figure>
              );
            })}
          {!loading && !items.length && !error && (
            <>
              <figure className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <blockquote className="flex-1 text-sm leading-relaxed text-slate-700">
                  “Thay vì chỉ triển khai media, AHV cùng chúng tôi thiết kế lại toàn bộ hành trình
                  khách hàng. Tỉ lệ chốt tăng rõ rệt và đội sale làm việc có dữ liệu hơn.”
                </blockquote>
                <figcaption className="mt-4 text-xs text-slate-500">
                  <p className="font-semibold text-slate-900">Giám đốc Marketing</p>
                  <p className="text-slate-600">Ngân hàng số tại Việt Nam</p>
                </figcaption>
              </figure>
            </>
          )}
        </div>
        {error && (
          <p className="mt-4 text-xs text-red-500">{error}</p>
        )}
      </div>
    </section>
  );
};

