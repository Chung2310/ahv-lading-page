import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import { HeroSlider } from "../components/HeroSlider";
import { About } from "../components/About";
import { CoreValuesSection } from "../components/CoreValuesSection";
import { Achievements } from "../components/Achievements";
import { LeadershipSection } from "../components/LeadershipSection";
import { Services } from "../components/Services";
import { Projects } from "../components/Projects";
import { Partners } from "../components/Partners";
import { Testimonials } from "../components/Testimonials";
import { Recruitment } from "../components/Recruitment";
import { Articles } from "../components/Articles";
import { ContactSection } from "../components/ContactSection";
import { MapSection } from "../components/MapSection";

export const HomePage: React.FC = () => {
  return (
    <ReactFullpage
      scrollingSpeed={700}
      navigation
      anchors={[
        "home",
        "about",
        "core-values",
        "achievements",
        "leadership",
        "services",
        "projects",
        "partners",
        "testimonials",
        "careers",
        "articles",
        "contact",
        "map",
      ]}
      normalScrollElements="#articles,#careers,#contact"
      credits={{ enabled: false }}
      render={() => (
        <ReactFullpage.Wrapper>
          <div className="section" data-anchor="home">
            <HeroSlider />
          </div>
          <div className="section" data-anchor="about">
            <About />
          </div>
          <div className="section" data-anchor="core-values">
            <CoreValuesSection />
          </div>
          <div className="section" data-anchor="achievements">
            <Achievements />
          </div>
          <div className="section" data-anchor="leadership">
            <LeadershipSection />
          </div>
          <div className="section" data-anchor="services">
            <Services />
          </div>
          <div className="section" data-anchor="projects">
            <Projects />
          </div>
          <div className="section" data-anchor="partners">
            <Partners />
          </div>
          <div className="section" data-anchor="testimonials">
            <Testimonials />
          </div>
          <div className="section" data-anchor="careers">
            <Recruitment />
          </div>
          <div className="section" data-anchor="articles">
            <Articles limit={6} showApiNote={false} />
          </div>
          <div className="section" data-anchor="contact">
            <ContactSection />
          </div>
          <div className="section" data-anchor="map">
            <MapSection />
          </div>
        </ReactFullpage.Wrapper>
      )}
    />
  );
};
