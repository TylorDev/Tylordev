import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { Locale } from "../lib/types";

const SUPPORTED: Locale[] = ["en-us", "es-mx", "pt-br"];

interface LanguageCtx {
  language: Locale;
  setLanguage: (l: Locale) => void;
  supported: Locale[];
}

const LanguageContext = createContext<LanguageCtx | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Locale>("en-us");
  const location = useLocation();

  useEffect(() => {
    const [, maybe] = location.pathname.split("/");
    if (SUPPORTED.includes(maybe as Locale) && maybe !== language) {
      setLanguage(maybe as Locale);
    }
  }, [location.pathname, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, supported: SUPPORTED }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageCtx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
