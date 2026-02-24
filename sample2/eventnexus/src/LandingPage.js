import React, { useEffect } from "react";

/* ── Global styles ── */
import "./styles/globals.css";

/* ── Layout components ── */
import Navbar           from "./components/Navbar";
import Footer           from "./components/Footer";
import Stars            from "./components/Stars";

/* ── Section components ── */
import HeroSection      from "./components/HeroSection";
import FeaturesSection  from "./components/FeaturesSection";
import EventsSection    from "./components/EventsSection";
import HowItWorksSection from "./components/HowItWorksSection";
import AboutSection     from "./components/AboutSection";
import ContactSection   from "./components/ContactSection";

/**
 * LandingPage
 * ─────────────────────────────────────────────
 * Root page component that:
 *  1. Imports global CSS (fonts, keyframes, utility classes)
 *  2. Sets up the IntersectionObserver for scroll-reveal (.reveal → .visible)
 *  3. Renders all sections in order inside a single <div> wrapper
 *
 * Section order:
 *   Hero → Features → Events → How It Works → About → Contact
 */

/* ── Scroll-reveal hook ── */
const useScrollReveal = () => {
  useEffect(() => {
    const targets = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            /* stagger sibling cards slightly */
            const siblings = entry.target.parentElement?.querySelectorAll(".reveal") ?? [];
            const idx = Array.from(siblings).indexOf(entry.target);
            setTimeout(
              () => entry.target.classList.add("visible"),
              idx * 60   /* 60 ms stagger per sibling */
            );
          }
        });
      },
      { threshold: 0.1 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

const LandingPage = () => {
  useScrollReveal();

  return (
    <div
      style={{
        position:   "relative",
        minHeight:  "100vh",
        background: "#0F172A",
      }}
    >
      {/* Noise grain texture overlay */}
      <div className="noise" />

      {/* Twinkling star field */}
      <Stars />

      {/* ── Navigation ── */}
      <Navbar />

      {/* ── Page sections ── */}
      <main style={{ position:"relative", zIndex:1 }}>
        <HeroSection />
        <FeaturesSection />
        <EventsSection />
        <HowItWorksSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
};

export default LandingPage;