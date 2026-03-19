import React, { FormEvent, useState } from "react";
import { createTicket } from "../lib/api";
import { useInViewAnimation } from "../hooks/useInViewAnimation";

export const ContactSection: React.FC = () => {
  const { ref, animationClass } = useInViewAnimation();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const fullname = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const company = String(formData.get("company") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const description =
      `Công ty: ${company || "Chưa cung cấp"}\n\nNhu cầu & thách thức:\n${message}`;

    setSubmitting(true);
    setError(null);
    setSubmitted(false);

    try {
      await createTicket({ fullname, phone, email, description });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError("Gửi thông tin thất bại. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={ref as React.RefObject<HTMLElement>}
      className={`border-b border-slate-200 bg-slate-50 transition-all duration-700 ease-out ${animationClass}`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.1fr,0.9fr] md:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Liên hệ với AHV Holding
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Hãy chia sẻ về doanh nghiệp và bài toán bạn đang gặp phải. Đội ngũ của chúng tôi sẽ
              liên hệ trong vòng 24 giờ làm việc.
            </p>
            <div className="mt-6 space-y-3 text-xs leading-relaxed text-slate-700 sm:text-sm">
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

          <div>
            <form
              className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 text-sm shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1 block text-xs font-medium text-slate-700">
                    Họ và tên *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="mb-1 block text-xs font-medium text-slate-700"
                  >
                    Công ty
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="AHV Holding"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-700">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="ban@congty.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-xs font-medium text-slate-700">
                    Số điện thoại *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/60"
                    placeholder="09xx xxx xxx"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1 block text-xs font-medium text-slate-700"
                >
                  Nhu cầu &amp; thách thức hiện tại *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-500/60"
                  placeholder="Mô tả ngắn về mô hình kinh doanh, mục tiêu tăng trưởng, kênh đang sử dụng..."
                />
              </div>

              <p className="text-[11px] text-slate-500">
                Bằng cách gửi form này, bạn đồng ý để AHV Holding liên hệ và tư vấn về giải pháp
                phù hợp.
              </p>

              <button
               type="submit"
               disabled={submitting}
               className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Đang gửi..." : "Gửi thông tin"}
              </button>
        {error && (
          <p className="mt-2 text-center text-xs font-medium text-red-500" role="alert">
            {error}
          </p>
        )}
              {submitted && (
                <p className="text-center text-xs font-medium text-emerald-600" role="status">
                  Cảm ơn bạn! Chúng tôi sẽ liên hệ trong thời gian sớm nhất.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

