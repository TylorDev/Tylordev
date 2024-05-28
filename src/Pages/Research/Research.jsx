import { useEffect, useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import content from "./researchContent.json"; // Asegúrate de tener el archivo JSON en la misma carpeta o actualizar la ruta según corresponda
import "./Research.scss";
import "./Research-mobile.scss";
import { useNavigate } from "react-router-dom";
import { CButton } from "./../../Components/Button/CButton";

import { useParams } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";

function Research({ title = true, limit = false, style }) {
  const datos = content.Research;
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();

  const handleClick = (blogId) => {
    navigate(`/${language}/research/${blogId}`);
  };

  const [filenames, setFilenames] = useState([]);

  const enUsFiles = import.meta.glob("/src/API/en-us/Articles/*.json");
  const esMxFiles = import.meta.glob("/src/API/es-mx/Articles/*.json");
  const ptBrFiles = import.meta.glob("/src/API/pt-br/Articles/*.json");
  const defaultFiles = import.meta.glob("/src/API/Articles/*.json");

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

  const displayedArticles = data
    .slice(currentIndex, currentIndex + 4)
    .concat(data.slice(0, Math.max(0, currentIndex + 4 - data.length)));

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 4 + data.length) % data.length);
  };

  return (
    <div className="Research">
      <div className="b-buttons" style={style}>
        <span>{title ? datos.title : ""}</span>
        <div>
          <CButton onClick={handlePrev} left={true} />

          <CButton onClick={handleNext} />
        </div>
      </div>

      <div className="r-articles">
        {(limit ? displayedArticles : data).map((article, index) => (
          <div key={index} className="r-article">
            <div className="rr-cover">
              <img
                src={article.data.coverImageSrc}
                alt={`Cover for ${article.data.title}`}
                onClick={() => handleClick(article.data.id)}
              />
            </div>
            <div className="rr-tittle">
              <span className="rr-sub">
                {article.data.category}/ <span>{article.data.date}</span>
              </span>
              <span>
                {article.data.title}. {article.data.content}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Research;
