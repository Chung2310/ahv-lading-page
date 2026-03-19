import React from "react";
import { Link } from "react-router-dom";
import { useInViewAnimation } from "../hooks/useInViewAnimation";

export const MapSection: React.FC = () => {
  const { ref, animationClass } = useInViewAnimation();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`border-t border-slate-200 bg-slate-50 transition-all duration-700 ease-out ${animationClass}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-[0.9fr,1.1fr] md:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Địa chỉ & bản đồ
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
              Hệ thống văn phòng của AHV Holding tại Thái Nguyên và Hà Nội, thuận tiện cho việc trao đổi
              trực tiếp và triển khai dự án cùng doanh nghiệp.
            </p>
            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-700 sm:text-sm">
              <a
                href="https://maps.app.goo.gl/gpe2VQYtCuHSWb8o6"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-sky-600"
              >
                <span className="font-medium text-slate-900">Trụ sở:</span>
                <br />
                Số nhà 18, Tổ 1, P. Phố Cò,
                <br />
                TP. Sông Công, Thái Nguyên
              </a>
              <a
                href="https://maps.app.goo.gl/7bG398xcuX8rn2kD8"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-sky-600"
              >
                <span className="font-medium text-slate-900">Cơ sở 1:</span>
                <br />
                Số 8/116 Nhân Hòa, Thanh Xuân, Hà Nội
              </a>
              <a
                href="https://maps.app.goo.gl/E1JdaB5YfWsNSSMf6"
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:text-sky-600"
              >
                <span className="font-medium text-slate-900">Cơ sở 2:</span>
                <br />
                12A ngõ 331 Quang Trung, TP. Thái Nguyên
              </a>
            </div>
          </div>

          <div className="grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
            <Link
              to="/news"
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                Tin tức
              </span>
              <span className="mt-2 font-semibold text-slate-900">
                Cập nhật hoạt động &amp; góc nhìn
              </span>
              <span className="mt-1 text-xs text-slate-600">
                Xem các tin tức mới nhất, chia sẻ và câu chuyện từ AHV.
              </span>
            </Link>

            <Link
              to="/services"
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                Dịch vụ
              </span>
              <span className="mt-2 font-semibold text-slate-900">
                Giải pháp &amp; lĩnh vực hoạt động
              </span>
              <span className="mt-1 text-xs text-slate-600">
                Khám phá các dịch vụ, giải pháp mà AHV đang triển khai.
              </span>
            </Link>

            <Link
              to="/projects"
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                Dự án
              </span>
              <span className="mt-2 font-semibold text-slate-900">
                Một số case study tiêu biểu
              </span>
              <span className="mt-1 text-xs text-slate-600">
                Tham khảo các dự án và câu chuyện triển khai thực tế.
              </span>
            </Link>

            <Link
              to="/recruitment"
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-400 hover:shadow-lg"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
                Tuyển dụng
              </span>
              <span className="mt-2 font-semibold text-slate-900">
                Gia nhập đội ngũ AHV
              </span>
              <span className="mt-1 text-xs text-slate-600">
                Xem các vị trí đang mở và cơ hội phát triển cùng AHV.
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

