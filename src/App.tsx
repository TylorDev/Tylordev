import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Skeleton from "./components/Skeleton/Skeleton";
import type { Locale } from "./lib/types";

const Home = lazy(() => import("./pages/Home/Home"));
const Projects = lazy(() => import("./pages/Projects/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail/ProjectDetail"));
const About = lazy(() => import("./pages/About/About"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

const SUPPORTED: Locale[] = ["en-us", "es-mx", "pt-br"];

function LangGuard({ children }: { children: ReactNode }) {
  const { lang } = useParams();
  if (!SUPPORTED.includes(lang as Locale)) return <Navigate to="/en-us" replace />;
  return <>{children}</>;
}

function SiteLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

function PageFallback() {
  return (
    <div className="container" style={{ padding: "60px 24px" }}>
      <Skeleton height={48} width="60%" />
      <div style={{ height: 16 }} />
      <Skeleton height={200} radius={20} />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/en-us" replace />} />

          <Route
            path="/:lang"
            element={
              <LangGuard>
                <SiteLayout />
              </LangGuard>
            }
          >
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:projectName" element={<ProjectDetail />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </LanguageProvider>
  );
}
