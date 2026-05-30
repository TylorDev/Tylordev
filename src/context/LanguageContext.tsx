import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { Locale } from "../lib/types";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isSupportedLocale, writeStoredLocale } from "../lib/locale";

interface LanguageCtx {
  language: Locale;
  setLanguage: (l: Locale) => void;
  supported: Locale[];
}

const LanguageContext = createContext<LanguageCtx | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Locale>(DEFAULT_LOCALE);
  const location = useLocation();

  useEffect(() => {
    const [, maybe] = location.pathname.split("/");
    if (isSupportedLocale(maybe) && maybe !== language) {
      setLanguage(maybe);
    }
  }, [location.pathname, language]);

  useEffect(() => {
    writeStoredLocale(language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, supported: SUPPORTED_LOCALES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageCtx {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
