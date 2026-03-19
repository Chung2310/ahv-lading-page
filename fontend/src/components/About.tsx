import React from "react";
import { useInViewAnimation } from "../hooks/useInViewAnimation";

export const About: React.FC = () => {
  const { ref, animationClass } = useInViewAnimation();

  return (
    <section
      id="about"
      ref={ref as React.RefObject<HTMLElement>}
      className={`border-b border-slate-200 bg-slate-50 transition-all duration-700 ease-out ${animationClass}`}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-16 md:py-20">
        <div className="grid w-full gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-center">
          {/* Cột nội dung bên trái */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Về chúng tôi
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-[32px]">
              AHV Holding – Đối tác đồng hành trong chuyển đổi số và tăng trưởng bền vững.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              AHV Holding là đơn vị tư vấn, phát triển giải pháp công nghệ, AI và đầu tư cho
              doanh nghiệp. Chúng tôi tập trung xây dựng hệ thống tăng trưởng dài hạn, dữ liệu
              minh bạch và quy trình vận hành tinh gọn.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Với đội ngũ chuyên gia nhiều kinh nghiệm, AHV đồng hành từ chiến lược, triển khai
              đến vận hành, giúp doanh nghiệp chuyển đổi số thực chất và mở rộng mô hình kinh
              doanh dựa trên dữ liệu.
            </p>

            <div className="mt-6 grid gap-4 text-sm text-slate-700 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Dự án triển khai
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">100+</p>
                <p className="mt-1 text-xs text-slate-500">đa ngành, đa quy mô</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Đối tác tin cậy
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">50+</p>
                <p className="mt-1 text-xs text-slate-500">doanh nghiệp &amp; tổ chức</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tập trung vào kết quả
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">KPI</p>
                <p className="mt-1 text-xs text-slate-500">
                  đo lường bằng dữ liệu &amp; tăng trưởng
                </p>
              </div>
            </div>
          </div>

          {/* Khối hình ảnh bên phải – theo style ảnh mẫu */}
          <div className="relative h-[420px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-900/80 shadow-[0_26px_65px_rgba(15,23,42,0.45)] md:h-[480px]">
            <div className="absolute inset-0">
              <img
                src="https://landingpage-ahv.vercel.app/img/ahv1.jpg"
                alt="AHV Holding office & đội ngũ"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-900/35 to-sky-900/30" />
            </div>

            <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                AHV Holding
              </p>
              <p className="mt-2 max-w-xs text-sm font-medium text-slate-50">
                Kết nối công nghệ, dữ liệu và vận hành để tạo nên hệ thống tăng trưởng bền vững
                cho doanh nghiệp Việt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

