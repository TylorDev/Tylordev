import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { useLanguage } from "./../../Context/LanguageContext";

import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
export function History() {
  const { language } = useLanguage();

  const [Page, setPage] = useState(null);

  const PageName = "About";
  const datos = FetchDataComponent(PageName);

  useEffect(() => {
    // Simulating fetching data from JSON file
    setPage(datos);
  }, [datos]);

  const [filenames, setFilenames] = useState([]);

  const enUsFiles = import.meta.glob("/src/API/en-us/Projects/*.json");
  const esMxFiles = import.meta.glob("/src/API/es-mx/Projects/*.json");
  const ptBrFiles = import.meta.glob("/src/API/pt-br/Projects/*.json");
  const defaultFiles = import.meta.glob("/src/API/Projects/*.json");

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
              `https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/${language}/Projects/${filename}`
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

  const topLatest = sortedLatest.slice(0, 2);

  if (!datos) {
    return <div>Loading...</div>;
  }

  return (
    <div className="history">
      <div className="imagen">
        <img src={datos.History.imageSrc} alt="history-image" />
      </div>

      <div className="latest">
        <div className="item">
          <div className="header-cont">
            <span>{datos.History.latest[0].header.section}</span>{" "}
            {datos.History.latest[0].header.title}
          </div>
          <div className="header-tit">
            {datos.History.latest[0].headerTitle}
          </div>
        </div>
        {topLatest.map((item, index) => (
          <Link
            key={index}
            className="item"
            to={`/${language}/projects/${item.header.title.toLowerCase()}`}
          >
            <div>
              {item.data.status} {item.data.date}
            </div>
            <div className="item-tittle">{item.header.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
