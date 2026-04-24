import { useEffect, useState } from "react";
import { useLanguage } from "../../Context/LanguageContext";
import {
  getApiUrl,
  mapArticleFromApi,
  mapProjectFromApi,
} from "../ApiData/apiMappers";

const GetData = ({ fileType }) => {
  const { language } = useLanguage();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = fileType === "Projects" ? "/projects" : "/articles";
        const response = await fetch(getApiUrl(endpoint));
        const result = await response.json();
        const mapper =
          fileType === "Projects" ? mapProjectFromApi : mapArticleFromApi;

        setData(result.map((item) => mapper(item, language)));
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
      }
    };

    fetchData();
  }, [language, fileType]);

  return data;
};

export default GetData;
