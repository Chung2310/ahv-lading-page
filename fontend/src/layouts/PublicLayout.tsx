import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { motion } from "framer-motion";

export const PublicLayout: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace("#", "");
    if (!id) return;

    // Chờ layout + content render xong rồi mới scroll
    const t = window.setTimeout(() => {
      // Trang chủ dùng fullPage: ưu tiên moveTo để nhảy đúng section
      if (location.pathname === "/") {
        const api = (window as unknown as { fullpage_api?: { moveTo?: (anchor: string) => void } })
          .fullpage_api;
        if (api?.moveTo) {
          api.moveTo(id);
          return;
        }
      }

      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    return () => window.clearTimeout(t);
  }, [location.hash, location.pathname]);

  return (
    <div className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900 scroll-smooth relative overflow-x-hidden">
      <motion.div
        className="home-animated-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <Header />
      <main className="flex-1 relative">
        <Outlet />
      </main>
      {!isHome && <Footer />}
    </div>
  );
};
