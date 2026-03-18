import React from "react";
import { Link } from "react-router-dom";
import { Partners } from "../components/Partners";
import { useInViewAnimation } from "../hooks/useInViewAnimation";

export const PartnersPage: React.FC = () => {
  const { ref, animationClass } = useInViewAnimation();

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`border-b border-slate-200 bg-white ${animationClass}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link to="/" className="hover:text-sky-600 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-slate-900">Đối tác</li>
          </ol>
        </nav>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Đối tác &amp; hệ sinh thái
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            AHV hợp tác cùng các nền tảng công nghệ, agency và đội vận hành để mang lại giải pháp
            end-to-end cho khách hàng, đảm bảo hiệu quả triển khai và tăng trưởng bền vững.
          </p>
        </div>

        <div className="mt-6">
          <Partners />
        </div>
      </div>
    </div>
  );
};

