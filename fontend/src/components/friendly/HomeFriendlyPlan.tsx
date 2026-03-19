import React from "react";

const pillars = [
  {
    k: "simplicity",
    v: "Make tax filing seamless, clear, and stress-free.",
  },
  {
    k: "accuracy",
    v: "Deliver precise filings built on trusted guidance.",
  },
  {
    k: "security",
    v: "Keep sensitive information handled with care.",
  },
];

export const HomeFriendlyPlan: React.FC = () => {
  return (
    <section id="book" className="scroll-mt-24 bg-[#F0F0F0]">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr,1fr] md:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2C2C2C]/60">
              A custom built plan for you
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#2C2C2C] md:text-4xl">
              Learn More
            </h2>
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-[#2C2C2C]/70">
              We believe that tax filing should be seamless, accurate, and stress-free. Our approach is
              centered on three key pillars: simplicity, accuracy, and security.
            </p>

            <div className="mt-8 space-y-3">
              {pillars.map((p) => (
                <div
                  key={p.k}
                  className="rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2C2C2C]/60">
                    {p.k}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#2C2C2C]/80">{p.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#E5E5E5] bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2C2C2C]/60">
              Connect with our experts
            </p>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[#2C2C2C]">
              Financial Clarity You Can Trust
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#2C2C2C]/70">
              Schedule a call with our team and get tailored guidance for your needs.
            </p>

            <a
              href="#services"
              className="mt-7 inline-flex w-full items-center justify-center rounded-full bg-ahv-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-ahv-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0F0F0]"
            >
              View services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

