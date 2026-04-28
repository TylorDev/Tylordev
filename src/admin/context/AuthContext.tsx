import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getSession, logout as apiLogout } from "../lib/api";
import { disableTestMode } from "../lib/testMode";
import type { AuthSession } from "../lib/types";

type Status = "checking" | "authenticated" | "unauthenticated";

interface Ctx {
  status: Status;
  session: AuthSession | null;
  error: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("checking");
  const [session, setSession] = useState<AuthSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setStatus("checking");
    setError(null);
    try {
      const data = await getSession();
      setSession(data);
      setStatus("authenticated");
    } catch (err) {
      setSession(null);
      setStatus("unauthenticated");
      // Only surface a real error if it isn't a vanilla 401 (those are expected before login).
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("401")) setError(msg);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      disableTestMode();
      setSession(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    refresh();
    const onUnauth = () => {
      setSession(null);
      setStatus("unauthenticated");
    };
    window.addEventListener("auth:unauthorized", onUnauth);
    return () => window.removeEventListener("auth:unauthorized", onUnauth);
  }, [refresh]);

  const value = useMemo<Ctx>(
    () => ({ status, session, error, refresh, logout }),
    [status, session, error, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): Ctx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
