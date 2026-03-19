import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Footer: React.FC = () => {
  const location = useLocation();
  const isColorPickerLanding =
    location.pathname.startsWith("/color-code");

  if (isColorPickerLanding) {
    return (
      <footer className="border-t border-white/10 bg-white/0 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs text-white/70">
            Copyright © imagecolorpicker.com
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link
              to="/tin-tuc"
              className="text-slate-600 hover:text-sky-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
            >
              Tin tức
            </Link>
            <Link
              to="/dich-vu"
              className="text-slate-600 hover:text-sky-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
            >
              Dịch vụ
            </Link>
            <Link
              to="/du-an"
              className="text-slate-600 hover:text-sky-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
            >
              Dự án
            </Link>
            <Link
              to="/doi-tac"
              className="text-slate-600 hover:text-sky-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
            >
              Đối tác
            </Link>
            <Link
              to="/tuyen-dung"
              className="text-slate-600 hover:text-sky-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
            >
              Tuyển dụng
            </Link>
            <Link
              to="/lien-he"
              className="text-slate-600 hover:text-sky-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded-sm"
            >
              Liên hệ
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 AHV Holding. All rights reserved.
          </p>
        </div>
        <p className="mt-4 text-[11px] text-slate-400">
          Đây là phiên bản landing page tĩnh phục vụ thiết kế &amp; nội dung. Bản chính thức sẽ
          kết nối với CMS &amp; API theo đặc tả.
        </p>
      </div>
    </footer>
  );
};
