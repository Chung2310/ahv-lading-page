import React from "react";

type Testimonial = {
  role: string;
  name: string;
  location: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    role: "Graphic Designer",
    name: "Margaret L.",
    location: "Ontario, Canada",
    quote:
      "I used to worry about missing deductions, but with Noble Finance, I know I’m maximizing my savings.",
  },
  {
    role: "Commercial Photographer",
    name: "Taylor M.",
    location: "Austin, Texas",
    quote:
      "Managing my taxes as a freelancer used to be overwhelming, but Noble Finance made it effortless.",
  },
];

export const HomeFriendlyTestimonials: React.FC = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-[#2C2C2C] md:text-4xl">
          Hear From Our Happy Clients
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="rounded-3xl border border-[#E5E5E5] bg-white p-7 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2C2C2C]/60">
                    {t.role}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#2C2C2C]">{t.name}</p>
                  <p className="mt-1 text-sm text-[#2C2C2C]/70">{t.location}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl border border-[#E5E5E5] bg-[#F0F0F0]" />
              </div>

              <p className="mt-6 text-sm leading-relaxed text-[#2C2C2C]/80">“{t.quote}”</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

