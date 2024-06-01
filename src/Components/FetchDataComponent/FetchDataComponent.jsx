import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";

const FetchDataComponent = (name, delay = 0) => {
  const [data, setData] = useState(null);
  const { language } = useLanguage();
  const { lang } = useParams();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/${lang}/Pages/${name}.json`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // Espera al menos 2 segundos antes de desactivar el estado de carga
        setTimeout(() => {
          setLoading(false); // Cambia el estado de carga a "false" después de 2 segundos
        }, delay);
      }
    };

    fetchData();
  }, [language, name, lang, delay]);

  return loading ? null : data;
};

export default FetchDataComponent;
