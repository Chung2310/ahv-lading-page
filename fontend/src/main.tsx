import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { ToastProvider } from "./components/ui/toast";
import { LoginPage } from "./pages/Login";
import { AdminPage } from "./pages/Admin";
import { PublicLayout } from "./layouts/PublicLayout";
import { HomePage } from "./pages/HomePage";
import { NewsPage } from "./pages/NewsPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { RecruitmentPage } from "./pages/RecruitmentPage";
import { ContactPage } from "./pages/ContactPage";
import { PartnersPage } from "./pages/PartnersPage";
import { ColorCodePage } from "./pages/ColorCodePage";
import { NewsDetailPage } from "./pages/NewsDetailPage";

const Root = () => (
  <ToastProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="tin-tuc" element={<NewsPage />} />
          <Route path="tin-tuc/:id" element={<NewsDetailPage />} />
          <Route path="dich-vu" element={<ServicesPage />} />
          <Route path="du-an" element={<ProjectsPage />} />
          <Route path="tuyen-dung" element={<RecruitmentPage />} />
          <Route path="doi-tac" element={<PartnersPage />} />
          <Route path="lien-he" element={<ContactPage />} />
          <Route path="color-code/:hex" element={<ColorCodePage />} />
          <Route path="color-code" element={<ColorCodePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ToastProvider>
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
