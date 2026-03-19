import React from "react";

type Service = {
  title: string;
  desc: string;
  tags: string[];
};

const services: Service[] = [
  {
    title: "Tax Preparation & Filing",
    desc: "Accurately prepare and file personal and business tax returns to maximize deductions and ensure compliance.",
    tags: ["1099 taxes", "Dependents", "Trust Taxes"],
  },
  {
    title: "IRS Audit Assistance",
    desc: "Offer expert guidance and representation to resolve tax audits and disputes with confidence.",
    tags: ["1099 taxes", "Dependents", "Trust Taxes"],
  },
  {
    title: "Bookkeeping & Accounting",
    desc: "Maintain organized financial records and provide clear reports to support business growth and financial health.",
    tags: ["1099 taxes", "Dependents", "Trust Taxes"],
  },
];

export const HomeFriendlyServices: React.FC = () => {
  return (
    <section id="services" className="scroll-mt-24 bg-[#F0F0F0]">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#2C2C2C] md:text-4xl">
              Let us handle the numbers,
              <span className="text-[#2C2C2C]/80"> so you can handle your success.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#2C2C2C]/70 md:text-base">
              Serving individuals and small businesses since 1987
            </p>
          </div>

          <a
            href="#book"
            className="inline-flex items-center justify-center rounded-full border border-[#E5E5E5] bg-white px-6 py-2.5 text-sm font-semibold text-[#2C2C2C] hover:bg-[#F0F0F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ahv-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0F0F0]"
          >
            Schedule a call
          </a>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className="rounded-3xl border border-[#E5E5E5] bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold tracking-tight text-[#2C2C2C]">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#2C2C2C]/70">{s.desc}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[#E5E5E5] bg-white px-3 py-1 text-xs font-semibold text-[#2C2C2C]/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

