import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Header: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2"
          aria-label="AHV Holding - Trang chủ"
        >
          <img
            src="/image/logo.jpg"
            alt="Logo AHV Holding"
            className="h-9 w-9 rounded-xl object-contain"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-slate-900">
              AHV HOLDING
            </div>
            <div className="text-xs text-slate-500">Technology &amp; Investment</div>
          </div>
        </Link>

        <nav
          className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex"
          aria-label="Main navigation"
        >
          {isHome ? (
            <a href="#about" className="hover:text-sky-600 transition-colors">
              Về AHV
            </a>
          ) : (
            <Link to="/#about" className="hover:text-sky-600 transition-colors">
              Về AHV
            </Link>
          )}
          <Link to="/dich-vu" className="hover:text-sky-600 transition-colors">
            Dịch vụ
          </Link>
          <Link to="/du-an" className="hover:text-sky-600 transition-colors">
            Dự án
          </Link>
          <Link to="/tuyen-dung" className="hover:text-sky-600 transition-colors">
            Tuyển dụng
          </Link>
          <Link to="/tin-tuc" className="hover:text-sky-600 transition-colors">
            Tin tức
          </Link>
          <Link to="/lien-he" className="hover:text-sky-600 transition-colors">
            Liên hệ
          </Link>
        </nav>

        <Link
          to="/lien-he"
          className="hidden items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:bg-sky-700 md:inline-flex"
        >
          Tư vấn miễn phí
        </Link>
      </div>
    </header>
  );
};
