import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginGate from "./components/LoginGate/LoginGate";
import AdminHeader from "./components/AdminHeader/AdminHeader";
import Skeleton from "./components/Skeleton/Skeleton";

const Admin = lazy(() => import("./pages/Admin/Admin"));
const ProjectEditor = lazy(() => import("./pages/ProjectEditor/ProjectEditor"));
const ArticleEditor = lazy(() => import("./pages/ArticleEditor/ArticleEditor"));
const ProjectPreview = lazy(() => import("./pages/ProjectPreview/ProjectPreview"));
const ArticlePreview = lazy(() => import("./pages/ArticlePreview/ArticlePreview"));
const ContentEditor = lazy(() => import("./pages/ContentEditor/ContentEditor"));

function PageFallback() {
  return (
    <div className="container" style={{ padding: "60px 24px" }}>
      <Skeleton height={48} width="60%" />
      <div style={{ height: 16 }} />
      <Skeleton height={200} radius={12} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LoginGate>
        <AdminHeader />
        <main>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route index element={<Admin />} />
              <Route path="edit/project" element={<ProjectEditor />} />
              <Route path="edit/project/:slug" element={<ProjectEditor />} />
              <Route path="edit/article" element={<ArticleEditor />} />
              <Route path="edit/article/:slug" element={<ArticleEditor />} />
              <Route path="preview/project/:slug" element={<ProjectPreview />} />
              <Route path="preview/article/:slug" element={<ArticlePreview />} />
              <Route path="content" element={<ContentEditor />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </Suspense>
        </main>
      </LoginGate>
    </AuthProvider>
  );
}
