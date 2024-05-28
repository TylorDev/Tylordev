import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";

const FetchDataComponent = ({ PageName }) => {
  const [data, setData] = useState(null);
  const { language } = useLanguage();
  const { lang } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/${lang}/Pages/${PageName}.json`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [language, PageName, lang]);

  return data;
};

export default FetchDataComponent;
