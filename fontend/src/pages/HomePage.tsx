import React from "react";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Services } from "../components/Services";
import { Achievements } from "../components/Achievements";
import { Projects } from "../components/Projects";
import { Partners } from "../components/Partners";
import { Recruitment } from "../components/Recruitment";
import { Articles } from "../components/Articles";
import { ContactSection } from "../components/ContactSection";

export const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Recruitment />
      <Articles />
      <Projects variant="home" />
      <Achievements />
      <Partners />
      <ContactSection />
    </>
  );
};
