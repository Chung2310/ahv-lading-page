import React, { useId, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Header: React.FC = () => {
  const location = useLocation();
  const isColorPickerLanding =
    location.pathname.startsWith("/color-code");
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuId = useId();

  if (isColorPickerLanding) {
    return (
      <header className="sticky top-0 z-50 border-b border-white/10 bg-white/0 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="ImageColorPicker.com - Home"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-sm font-semibold text-white/90"
              aria-hidden="true"
            >
              *
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-white/95">
                ImageColorPicker.com
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="#"
              className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:inline-flex"
            >
              Nâng cấp
            </a>
            <Link
              to="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:inline-flex"
            >
              Đăng nhập
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full bg-ahv-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-ahv-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-xl"
          aria-label="AHV Holding - Trang chủ"
        >
          <img
            src="/image/logo.svg"
            alt="Logo AHV Holding"
            className="h-9 w-9 rounded-xl object-contain"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-[#2C2C2C]">
              AHV HOLDING
            </div>
            <div className="text-xs text-[#2C2C2C]/65">Technology &amp; Investment</div>
          </div>
        </Link>

        <div className="md:hidden">
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls={mobileMenuId}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E5E5] bg-white hover:bg-[#F0F0F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span aria-hidden="true">{mobileOpen ? "×" : "≡"}</span>
          </button>
        </div>

        <nav
          className="hidden items-center gap-6 text-sm font-medium text-[#2C2C2C] md:flex"
          aria-label="Main navigation"
        >
          <Link to="/" className="hover:text-ahv-primary transition-colors">
            Trang chủ
          </Link>
          <Link to="/tin-tuc" className="hover:text-ahv-primary transition-colors">
            Tin tức
          </Link>
          <Link to="/dich-vu" className="hover:text-ahv-primary transition-colors">
            Dịch vụ
          </Link>
          <Link to="/du-an" className="hover:text-ahv-primary transition-colors">
            Dự án
          </Link>
          <Link to="/doi-tac" className="hover:text-ahv-primary transition-colors">
            Đối tác
          </Link>
          <Link to="/tuyen-dung" className="hover:text-ahv-primary transition-colors">
            Tuyển dụng
          </Link>
          <Link to="/lien-he" className="hover:text-ahv-primary transition-colors">
            Liên hệ
          </Link>
        </nav>

        <Link
          to="/lien-he"
          className="hidden items-center gap-2 rounded-full bg-ahv-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-ahv-primary/40 hover:bg-ahv-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white md:inline-flex"
        >
          Liên hệ
        </Link>
      </div>

      {mobileOpen && (
        <div
          id={mobileMenuId}
          className="md:hidden"
          role="dialog"
          aria-label="Mobile menu"
        >
          <div className="border-t border-[#E5E5E5] bg-white/95 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 py-4">
              <div className="flex flex-col gap-3">
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[#2C2C2C] hover:bg-[#F0F0F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary"
                >
                  Trang chủ
                </Link>
                <Link
                  to="/tin-tuc"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[#2C2C2C] hover:bg-[#F0F0F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary"
                >
                  Tin tức
                </Link>
                <Link
                  to="/dich-vu"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[#2C2C2C] hover:bg-[#F0F0F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary"
                >
                  Dịch vụ
                </Link>
                <Link
                  to="/du-an"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[#2C2C2C] hover:bg-[#F0F0F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary"
                >
                  Dự án
                </Link>
                <Link
                  to="/doi-tac"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[#2C2C2C] hover:bg-[#F0F0F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary"
                >
                  Đối tác
                </Link>
                <Link
                  to="/tuyen-dung"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[#2C2C2C] hover:bg-[#F0F0F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary"
                >
                  Tuyển dụng
                </Link>
                <Link
                  to="/lien-he"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-ahv-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-ahv-primary/30 hover:bg-ahv-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  Liên hệ
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
