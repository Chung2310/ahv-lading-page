import React from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Achievements } from "./components/Achievements";
import { Projects } from "./components/Projects";
import { Partners } from "./components/Partners";
import { Testimonials } from "./components/Testimonials";
import { Recruitment } from "./components/Recruitment";
import { Articles } from "./components/Articles";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";

export const App: React.FC = () => {
  return (
    <div className="antialiased bg-slate-50 text-slate-900 scroll-smooth">
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Achievements />
        <Projects />
        <Partners />
        <Testimonials />
        <Recruitment />
        <Articles />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

