import React from "react";

type Audience = {
  title: string;
  heading: string;
  desc: string;
};

const audiences: Audience[] = [
  {
    title: "For Freelancers",
    heading: "Simplicity & Control",
    desc: "Stay in charge of your income with seamless expense tracking, automated deductions, and smart tax strategies—so you can focus on doing what you love.",
  },
  {
    title: "For Families",
    heading: "Stability & Security",
    desc: "From budgeting tools to tax-saving insights, we help you plan for the future, maximize refunds, and keep your household finances running smoothly.",
  },
  {
    title: "For Small Businesses",
    heading: "Stability & Security",
    desc: "Effortless bookkeeping, payroll solutions, and expert-backed tax support—so you can spend less time on finances and more time scaling your business.",
  },
];

export const HomeFriendlySmartFinance: React.FC = () => {
  return (
    <section className="bg-[#F0F0F0]">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-[#2C2C2C] md:text-4xl">
          Smart Finance for everyone
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#2C2C2C]/70 md:text-base">
          At Noble Finance, we believe that financial confidence should be accessible to everyone—whether
          you’re a solo entrepreneur, managing a growing family, or running a small business.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {audiences.map((a) => (
            <article
              key={a.title}
              className="rounded-3xl border border-[#E5E5E5] bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2C2C2C]/60">
                {a.title}
              </p>
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-[#2C2C2C]">
                {a.heading}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#2C2C2C]/70">{a.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

