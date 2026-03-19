import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPosts, Post } from "../lib/api";
import { useInViewAnimation } from "../hooks/useInViewAnimation";

export const Articles: React.FC<{ limit?: number; showApiNote?: boolean }> = ({
  limit = 3,
  showApiNote = true,
}) => {
  const { ref, animationClass } = useInViewAnimation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrorIds, setImageErrorIds] = useState<Record<string, true>>({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchPosts({ page: 1, limit });
        if (mounted) {
          setPosts(data);
        }
      } catch (err) {
        if (mounted) {
          setError("Không tải được danh sách bài viết. Vui lòng thử lại sau.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const hasPosts = posts && posts.length > 0;

  return (
    <section
      id="articles"
      ref={ref as React.RefObject<HTMLElement>}
      className={`border-b border-slate-200 bg-slate-50 transition-all duration-700 ease-out ${animationClass}`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Góc nhìn &amp; bài viết từ AHV
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Chia sẻ về chiến lược tăng trưởng, ứng dụng công nghệ và case study thực chiến từ
              đội ngũ AHV Holding.
            </p>
          </div>
          {showApiNote && (
            <p className="text-xs text-slate-500 md:text-right">
            </p>
          )}
        </div>

        {error && (
          <p className="mt-6 text-xs text-sky-600">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading && !hasPosts
            ? Array.from({ length: 3 }).map((_, idx) => (
                <article
                  key={idx}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/70 shadow-sm animate-pulse"
                >
                  <div className="aspect-video w-full bg-slate-200" />
                  <div className="p-5">
                    <div className="h-3 w-24 rounded-full bg-slate-200" />
                    <div className="mt-3 h-4 w-40 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-full rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-3/4 rounded bg-slate-200" />
                  </div>
                </article>
              ))
            : hasPosts
            ? posts.map((post) => (
                <Link
                  key={post._id}
                  to={`/tin-tuc/${post._id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50"
                >
                  <div className="relative aspect-video w-full bg-slate-100">
                    {post.imageUrl && !imageErrorIds[post._id] ? (
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                        onError={() =>
                          setImageErrorIds((prev) => ({ ...prev, [post._id]: true }))
                        }
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-50 via-white to-slate-100">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                          {post.title
                            .trim()
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((w) => w.charAt(0).toUpperCase())
                            .join("")}
                        </span>
                      </div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                      Bài viết
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-4">{post.content}</p>
                  </div>
                </Link>
              ))
            : null}
        </div>
        {!loading && !hasPosts && !error && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
            <p className="text-sm font-medium text-slate-700">Chưa có bài viết nào từ API.</p>
            <p className="mt-1 text-xs text-slate-500">
              Vui lòng kiểm tra endpoint `/api/v1/posts` hoặc thêm dữ liệu ở backend.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

