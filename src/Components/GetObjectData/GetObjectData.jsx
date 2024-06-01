import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";

const GetObjectData = ({ type }) => {
  const { language } = useLanguage();
  const params = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const paramKey = type === "Projects" ? "projectName" : "id";
        const paramValue = params[paramKey];
        const response = await fetch(
          `https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/${language}/${type}/${paramValue}.json`
        );
        if (!response.ok) {
          throw new Error(`Error fetching ${paramValue}.json`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching the JSON data:", error);
      }
    };

    fetchData();
  }, [params, language, type]);

  return data;
};

export default GetObjectData;
