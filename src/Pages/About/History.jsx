import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { useLanguage } from "./../../Context/LanguageContext";
import content from "./About.json";
import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
export function History() {
  const { language } = useLanguage();

  FetchDataComponent;

  const datos = content.History;

  const [filenames, setFilenames] = useState([]);
  useEffect(() => {
    async function fetchData() {
      // Importar todos los archivos JSON en la carpeta `src/API/Projects`
      const jsonFiles = import.meta.glob("/src/API/Projects/*.json");

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
  }, []);

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          filenames.map((filename) =>
            fetch(
              `https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/Projects/${filename}`
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
  }, [filenames]);

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
        <img src={datos.imageSrc} alt="history-image" />
      </div>

      <div className="latest">
        <div className="item">
          <div className="header-cont">
            <span>{datos.latest[0].header.section}</span>{" "}
            {datos.latest[0].header.title}
          </div>
          <div className="header-tit">{datos.latest[0].headerTitle}</div>
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
