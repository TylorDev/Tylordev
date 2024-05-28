import { Link } from "react-router-dom";
import { GoArrowDownLeft } from "react-icons/go";
import { useEffect, useState } from "react";
import About from "./About.json";
import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { useLanguage } from "./../../Context/LanguageContext";
FetchDataComponent;
export function BlogCont() {
  const PageName = "About";
  const datos = FetchDataComponent({ PageName });

  const { language } = useLanguage();

  const [filenames, setFilenames] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Importar todos los archivos JSON en la carpeta `src/API/Projects`
      const jsonFiles = import.meta.glob("/src/API/Articles/*.json");

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
              `https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/Articles/${filename}`
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
