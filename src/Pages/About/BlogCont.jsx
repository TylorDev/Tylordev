import { Link } from "react-router-dom";
import { GoArrowDownLeft } from "react-icons/go";
import { useEffect, useState } from "react";

import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { useLanguage } from "./../../Context/LanguageContext";
FetchDataComponent;
export function BlogCont() {
  const PageName = "About";

  const datos = FetchDataComponent(PageName);
  const { language } = useLanguage();

  const [filenames, setFilenames] = useState([]);

  const enUsFiles = import.meta.glob("/src/API/en-us/Articles/*.json");
  const esMxFiles = import.meta.glob("/src/API/es-mx/Articles/*.json");
  const ptBrFiles = import.meta.glob("/src/API/pt-br/Articles/*.json");
  const defaultFiles = import.meta.glob("/src/API/Articles1/*.json");

  useEffect(() => {
    async function fetchData() {
      let jsonFiles;
      if (language === "en-us") {
        jsonFiles = enUsFiles;
      } else if (language === "es-mx") {
        jsonFiles = esMxFiles;
      } else if (language === "pt-br") {
        jsonFiles = ptBrFiles;
      } else {
        jsonFiles = defaultFiles;
      }

      // Array para almacenar los nombres de los archivos
      const fileNamesArray = [];

      // Iterar sobre los archivos y obtener sus nombres
      for (const path in jsonFiles) {
        // Extraer el nombre del archivo del path
        const fileName = path.split("/").pop();
        fileNamesArray.push(fileName);
      }

      // Actualizar el estado con los nombres de los archivos
      setFilenames(fileNamesArray);
    }

    fetchData();
  }, [language]);

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          filenames.map((filename) =>
            fetch(
              `https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/${language}/Articles/${filename}`
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
  }, [filenames, language]);

  const latest = data;

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year + 2000, month - 1, day); // Asume fechas en el formato DD/MM/YY
  };

  // Ordenar los datos por fecha de más reciente a más antiguo
  const sortedLatest = latest.sort(
    (a, b) => parseDate(b.data.date) - parseDate(a.data.date)
  );

  const topLatest = sortedLatest.slice(0, 4);

  if (!datos) {
    return <div>Loading...</div>;
  }

  return (
    <div className="blog-cont">
      <div className="header-cont">
        <span>{datos.blogHeader.section} </span>
        {datos.blogHeader.title}
      </div>
      <div className="blog">
        <div className="tittle-blog">{datos.blog.title}</div>
        <div className="entries">
          {topLatest.map((entry, index) => (
            <Link
              key={index}
              className="entry"
              to={`/${language}/research/${entry.data.id}`}
            >
              <div>{entry.data.date}</div>
              <div>{entry.contentTitle}</div>
            </Link>
          ))}
        </div>
        <Link className="corner-blog" to={`/${language}/research`}>
          <div className="arrow">
            <GoArrowDownLeft />
          </div>
        </Link>
      </div>
    </div>
  );
}
