import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import LoginGate from "./components/LoginGate/LoginGate";
import AdminHeader from "./components/AdminHeader/AdminHeader";
import Skeleton from "./components/Skeleton/Skeleton";

const Admin = lazy(() => import("./pages/Admin/Admin"));

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
            <Admin />
          </Suspense>
        </main>
      </LoginGate>
    </AuthProvider>
  );
}
