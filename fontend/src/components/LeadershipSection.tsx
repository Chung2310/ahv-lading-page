import React, { useEffect, useState } from "react";
import { useInViewAnimation } from "../hooks/useInViewAnimation";
import { ManagementMember, fetchManagementMembers } from "../lib/api";

type SimpleSwiperProps = {
  children: React.ReactNode;
};

const SimpleSwiper: React.FC<SimpleSwiperProps> = ({ children }) => (
  <div className="flex gap-6 overflow-x-auto pb-4 md:pb-6">
    {children}
  </div>
);

const SimpleSwiperSlide: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-w-[260px] max-w-[280px] flex-1 md:min-w-0">{children}</div>
);

export const LeadershipSection: React.FC = () => {
  const { ref, animationClass } = useInViewAnimation();
  const [leaders, setLeaders] = useState<ManagementMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchManagementMembers();
        if (mounted) setLeaders(data);
      } catch {
        if (mounted) setError("Không tải được ban lãnh đạo.");
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
      className={`border-b border-slate-200 bg-white transition-all duration-700 ease-out ${animationClass}`}
    >
      <div className="mx-auto flex max-w-6xl flex-col px-4 py-10 md:py-16">
        <div className="flex flex-col items-start gap-3 md:gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-sky-700">
            Leadership Team
          </span>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Ban lãnh đạo AHV Holding
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Đội ngũ sáng lập và lãnh đạo với kinh nghiệm thực chiến trong công nghệ, marketing, dữ liệu
            và vận hành giúp định hướng chiến lược và bảo chứng cho từng dự án.
          </p>
        </div>

        <div className="mt-8 flex-1">
          {loading && !leaders.length && (
            <div className="grid gap-6 md:grid-cols-4">
              <div className="h-64 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-64 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-64 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-64 rounded-3xl border border-slate-200 bg-slate-100 animate-pulse" />
            </div>
          )}
          {!loading && leaders.length > 0 && (
            <div className="relative">
              <SimpleSwiper>
                {leaders.map((leader, index) => {
                  const colorClasses = [
                    "from-sky-500/10 via-sky-400/5 to-slate-50",
                    "from-emerald-500/10 via-emerald-400/5 to-slate-50",
                    "from-indigo-500/10 via-indigo-400/5 to-slate-50",
                    "from-amber-500/10 via-amber-400/5 to-slate-50",
                  ];
                  const colorClass = colorClasses[index % colorClasses.length];
                  return (
                    <SimpleSwiperSlide key={leader._id}>
                      <article
                        className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br ${colorClass} shadow-[0_14px_30px_rgba(15,23,42,0.12)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-xl`}
                        style={{ transitionDelay: `${index * 70}ms` }}
                      >
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-200">
                          {leader.avatarUrl ? (
                            <img
                              src={leader.avatarUrl}
                              alt={leader.name}
                              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500 to-sky-700 text-3xl font-semibold text-white">
                              {(leader.name || "")
                                .split(" ")
                                .slice(-2)
                                .map((p) => p.charAt(0))
                                .join("")}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col items-center gap-1 bg-white/80 px-4 pb-4 pt-5 text-center backdrop-blur-[2px]">
                          <h3 className="text-base font-semibold tracking-wide text-slate-900">
                            {leader.name}
                          </h3>
                          {leader.position && (
                            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                              {leader.position}
                            </p>
                          )}
                          {leader.description && (
                            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-700">
                              {leader.description}
                            </p>
                          )}
                          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-[13px] hover:border-sky-400 hover:text-sky-500"
                            >
                              f
                            </button>
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-[13px] hover:border-sky-400 hover:text-sky-500"
                            >
                              in
                            </button>
                            <button
                              type="button"
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-[13px] hover:border-sky-400 hover:text-sky-500"
                            >
                              X
                            </button>
                          </div>
                        </div>
                      </article>
                    </SimpleSwiperSlide>
                  );
                })}
              </SimpleSwiper>
            </div>
          )}
          {!loading && !leaders.length && !error && (
            <div className="grid gap-6 md:grid-cols-4">
              <article className="flex flex-col overflow-hidden rounded-3xl bg-slate-100 shadow-[0_14px_30px_rgba(15,23,42,0.12)]">
                <div className="relative h-60 w-full overflow-hidden bg-slate-200">
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-500 to-sky-700 text-3xl font-semibold text-white">
                    NA
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center gap-1 bg-slate-50 px-4 pb-4 pt-5 text-center">
                  <h3 className="text-sm font-semibold tracking-wide text-slate-900 sm:text-base">
                    Nguyễn Văn A
                  </h3>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                    Chairman &amp; Co-Founder
                  </p>
                  <p className="mt-2 line-clamp-3 text-xs text-slate-600">
                    Hơn 10 năm kinh nghiệm trong lĩnh vực công nghệ, dữ liệu và tư vấn tăng trưởng cho
                    doanh nghiệp.
                  </p>
                </div>
              </article>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-4 text-xs text-red-500">{error}</p>
        )}
      </div>
    </section>
  );
};

