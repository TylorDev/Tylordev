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
    setLanguage(selectedLang);
    // Extrae la ruta actual sin el idioma
    const currentPath = location.pathname.split("/").slice(2).join("/");
    // Navega a la nueva ruta con el nuevo idioma
    navigate(`/${selectedLang}/${currentPath}`);
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
          {/* Añadir más opciones de idioma según sea necesario */}
        </select>
      </div>
    </div>
  );
};

export default LanguageSelector;
