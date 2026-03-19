import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPost, Post } from "../lib/api";
import { useInViewAnimation } from "../hooks/useInViewAnimation";

export const NewsDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id || "";
  const { ref, animationClass } = useInViewAnimation();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPost(id);
        if (mounted) setPost(data);
      } catch {
        if (mounted) setError("Không tải được bài viết. Vui lòng thử lại sau.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const createdAt = useMemo(() => {
    if (!post?.createdAt) return null;
    const d = new Date(post.createdAt);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("vi-VN");
  }, [post?.createdAt]);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`border-b border-slate-200 bg-slate-50 ${animationClass}`}
    >
      <div className="mx-auto max-w-3xl px-4 py-8 md:py-10">
        <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link to="/" className="hover:text-sky-600 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/tin-tuc" className="hover:text-sky-600 transition-colors">
                Tin tức
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-slate-900 line-clamp-1">
              {loading ? "Đang tải..." : post?.title || "Chi tiết"}
            </li>
          </ol>
        </nav>

        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-4 w-40 rounded bg-slate-200 animate-pulse" />
            <div className="mt-4 h-8 w-3/4 rounded bg-slate-200 animate-pulse" />
            <div className="mt-6 h-48 w-full rounded-2xl bg-slate-200 animate-pulse" />
            <div className="mt-6 space-y-2">
              <div className="h-3 w-full rounded bg-slate-200 animate-pulse" />
              <div className="h-3 w-11/12 rounded bg-slate-200 animate-pulse" />
              <div className="h-3 w-10/12 rounded bg-slate-200 animate-pulse" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && post && (
          <article className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {post.imageUrl ? (
              <div className="aspect-video w-full bg-slate-100">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}

            <div className="p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                Tin tức {createdAt ? `· ${createdAt}` : ""}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {post.title}
              </h1>
              <div className="prose prose-slate mt-5 max-w-none">
                <p className="whitespace-pre-line text-slate-700">{post.content}</p>
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

