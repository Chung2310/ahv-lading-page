import React, { useEffect, useMemo, useState } from "react";
import { FeaturedProject, fetchFeaturedProjects } from "../lib/api";
import { useInViewAnimation } from "../hooks/useInViewAnimation";

export const Projects: React.FC<{ variant?: "home" | "page" }> = ({ variant = "home" }) => {
  const { ref, animationClass } = useInViewAnimation();
  const [projects, setProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchFeaturedProjects();
      setProjects(data);
    } catch {
      setError("Không tải được dự án tiêu biểu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const industries = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.industry) set.add(p.industry);
    });
    return Array.from(set);
  }, [projects]);

  const summary = useMemo(() => {
    const projectCount = projects.length;
    const industryCount = industries.length;
    return { projectCount, industryCount };
  }, [projects.length, industries.length]);

  const filteredProjects = useMemo(() => {
    if (selectedIndustry === "all") return projects;
    return projects.filter((p) => p.industry === selectedIndustry);
  }, [projects, selectedIndustry]);

  const content = (
    <div className={`mx-auto max-w-6xl px-4 ${variant === "home" ? "py-16 md:py-20" : "py-10"}`}>
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Dự án tiêu biểu của AHV
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Những case study được chọn lọc thể hiện cách AHV Holding đồng hành cùng doanh nghiệp ở
              nhiều ngành khác nhau, từ bất động sản, tài chính đến sản xuất.
            </p>
          </div>
        </header>

        {industries.length > 0 && (
          <div className="mt-6 flex items-center justify-between gap-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Lọc theo ngành
            </p>
            <div className="flex-1">
              <div className="flex gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => setSelectedIndustry("all")}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition ${
                    selectedIndustry === "all"
                      ? "border-sky-500 bg-sky-500 text-white shadow-sm"
                      : "border-slate-300 bg-white text-slate-700 hover:border-sky-400"
                  }`}
                  aria-pressed={selectedIndustry === "all"}
                >
                  Tất cả
                </button>
                {industries.map((ind) => (
                  <button
                    key={ind}
                    type="button"
                    onClick={() => setSelectedIndustry(ind)}
                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition ${
                      selectedIndustry === ind
                        ? "border-sky-500 bg-sky-500 text-white shadow-sm"
                        : "border-slate-300 bg-white text-slate-700 hover:border-sky-400"
                    }`}
                    aria-pressed={selectedIndustry === ind}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {loading && !projects.length && (
            <>
              <div className="h-64 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-64 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
              <div className="h-64 rounded-2xl border border-slate-200 bg-slate-100 animate-pulse" />
            </>
          )}

          {!loading &&
            filteredProjects.map((p, index) => (
              <article
                key={p._id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm transition-transform duration-500 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                {p.thumbnailUrl && (
                  <div className="relative h-40 w-full overflow-hidden rounded-t-2xl border-b border-slate-200 bg-slate-100">
                    <img
                      src={p.thumbnailUrl}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {p.industry && (
                      <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-100 backdrop-blur">
                        {p.industry}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex flex-1 flex-col p-5">
                  {!p.thumbnailUrl && p.industry && (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                      {p.industry}
                    </p>
                  )}
                  <h3 className="mt-1 text-sm font-semibold text-slate-900 sm:text-lg">
                    {p.name}
                  </h3>
                  {p.description && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-4">
                      {p.description}
                    </p>
                  )}
                  {p.customer && (
                    <p className="mt-2 text-xs font-medium text-emerald-600">
                      Khách hàng: {p.customer}
                    </p>
                  )}

                  {p.industry && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                        {p.industry}
                      </span>
                    </div>
                  )}

                  {p.link && (
                    <div className="mt-4">
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-900"
                      >
                        Xem chi tiết dự án
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>
                  )}
                </div>
              </article>
            ))}

          {!loading && !filteredProjects.length && !error && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
              <p className="text-sm font-medium text-slate-700">
                Dự án đang được cập nhật, vui lòng quay lại sau.
              </p>
              {selectedIndustry !== "all" && (
                <p className="mt-1 text-xs text-slate-500">
                  Không có dự án nào thuộc ngành "
                  <span className="font-semibold">{selectedIndustry}</span>" trong thời điểm hiện tại.
                </p>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <p className="text-xs text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => void loadProjects()}
              className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {!loading && summary.projectCount > 0 && (
          <section className="mt-10 grid gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Số lượng dự án
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {summary.projectCount}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Ngành nghề
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-900">
                {summary.industryCount}
              </p>
            </div>
          </section>
        )}
      </div>
  );

  if (variant === "home") {
    return (
      <section
        id="projects"
        ref={ref as React.RefObject<HTMLElement>}
        className={`border-b border-slate-200 bg-slate-50 transition-all duration-700 ease-out ${animationClass}`}
      >
        {content}
      </section>
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`border-b border-slate-200 bg-slate-50 transition-all duration-700 ease-out ${animationClass}`}
    >
      {content}
    </div>
  );
};


