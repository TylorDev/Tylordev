import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";
import {
  getApiUrl,
  mapArticleFromApi,
  mapProjectFromApi,
} from "../ApiData/apiMappers";

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
          type === "Projects"
            ? getApiUrl(`/projects/${paramValue}`)
            : getApiUrl(`/articles/${paramValue}`)
        );
        if (!response.ok) {
          throw new Error(`Error fetching ${paramValue}`);
        }
        const result = await response.json();
        setData(
          type === "Projects"
            ? mapProjectFromApi(result, language)
            : mapArticleFromApi(result, language)
        );
      } catch (error) {
        console.error("Error fetching the JSON data:", error);
        setData(null);
      }
    };

    fetchData();
  }, [params, language, type]);

  return data;
};

export default GetObjectData;
