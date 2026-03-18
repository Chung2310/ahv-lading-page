import React from "react";
import { Link } from "react-router-dom";

export const CtaSection: React.FC = () => {
  return (
    <section
      id="cta"
      className="border-b border-slate-200 bg-sky-50"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="flex flex-col items-start justify-between gap-4 text-left text-slate-900 md:flex-row md:items-center md:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
              Sẵn sàng tăng tốc tăng trưởng?
            </p>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
              Đặt lịch trao đổi chiến lược 30 phút cùng đội ngũ AHV Holding
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-700">
              Chúng tôi sẽ phân tích nhanh mô hình hiện tại, đề xuất cơ hội tăng trưởng và lộ
              trình chuyển đổi phù hợp nguồn lực của bạn.
            </p>
          </div>
          <Link
            to="/lien-he"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:bg-sky-700"
          >
            Nhận tư vấn chiến lược
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

