// LanguageContext.js
import { createContext, useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";

const LanguageContext = createContext();
const supportedLanguages = ["en-us", "es-mx", "pt-br"];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en-us"); // Idioma predeterminado
  const location = useLocation();

  useEffect(() => {
    const [, maybeLanguage] = location.pathname.split("/");

    if (supportedLanguages.includes(maybeLanguage) && maybeLanguage !== language) {
      setLanguage(maybeLanguage);
    }
  }, [location.pathname, language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
