import { useEffect, useState } from "react";
import { useLanguage } from "../../Context/LanguageContext";
import GetFilenames from "../GetFilenames/getFileNames";

const GetData = ({ fileType }) => {
  const { language } = useLanguage();

  const filenames = GetFilenames({ fileType });

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          filenames.map((filename) =>
            fetch(
              `https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/${language}/${fileType}/${filename}`
            )
          )
        );

        const data = await Promise.all(
          responses.map((response) => response.json())
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filenames, language, fileType]);

  return data;
};

export default GetData;
