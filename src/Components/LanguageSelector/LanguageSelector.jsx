// LanguageSelector.js

import { useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { lang } = useParams();

  const handleChange = (event) => {
    const selectedLang = event.target.value;
    setLanguage(selectedLang);
    navigate(`/${selectedLang}`);
  };

  return (
    <select value={lang || language} onChange={handleChange}>
      <option value="en-us">English</option>
      <option value="es-mx">Español</option>
      <option value="pt-br">Portugues</option>
      {/* Añadir más opciones de idioma según sea necesario */}
    </select>
  );
};

export default LanguageSelector;
