// LanguageSelector.js

import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";
import "./LanguageSelector.scss";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { lang } = useParams();

  const location = useLocation();

  const handleChange = (event) => {
    const selectedLang = event.target.value;
    console.log("Selected Language:", selectedLang);

    setLanguage(selectedLang);

    const currentPath = location.pathname;
    console.log("Current Path:", currentPath);

    // Detectar y reemplazar el idioma en la URL
    const languagePatterns = ["en-us", "es-mx", "pt-br"];
    let newPath = currentPath;

    languagePatterns.forEach((pattern) => {
      if (currentPath.includes(pattern)) {
        newPath = currentPath.replace(pattern, selectedLang);
      }
    });

    console.log("Navigating to:", newPath);

    navigate(newPath);
  };

  return (
    <div className="custom-select">
      <div className="example-2">
        <select
          className="inner"
          value={lang || language}
          onChange={handleChange}
        >
          <option value="en-us">English 🇺🇸</option>
          <option value="es-mx">Español 🇲🇽 </option>
          <option value="pt-br">Português 🇧🇷</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
