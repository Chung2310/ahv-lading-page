import React from "react";
import { Link } from "react-router-dom";
import { Services } from "../components/Services";
import { useInViewAnimation } from "../hooks/useInViewAnimation";

export const ServicesPage: React.FC = () => {
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
            <li className="font-medium text-slate-900">Dịch vụ</li>
          </ol>
        </nav>
        <Services />
      </div>
    </div>
  );
};
