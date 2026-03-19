import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion } from "framer-motion";

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isColorCode = location.pathname === "/" || location.pathname.startsWith("/color-code");

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    if (!id) return;

    // Chờ layout + content render xong rồi mới scroll
    const t = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    return () => window.clearTimeout(t);
  }, [location.hash, location.pathname]);

  return (
    <div
      className={`antialiased min-h-screen flex flex-col scroll-smooth relative overflow-x-hidden ${
        isColorCode
          ? "bg-transparent text-slate-900"
          : isHome
            ? "bg-slate-50 text-slate-900"
            : "bg-slate-50 text-slate-900"
      }`}
    >
      <motion.div
        className="home-animated-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ display: "none" }}
      />
      {isColorCode && <div className="colorcode-background" aria-hidden="true" />}
      <Header />
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
