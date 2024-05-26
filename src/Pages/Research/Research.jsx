import { useEffect, useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import content from "./researchContent.json"; // Asegúrate de tener el archivo JSON en la misma carpeta o actualizar la ruta según corresponda
import "./Research.scss";
import "./Research-mobile.scss";
import { useNavigate } from "react-router-dom";
function Research({ title = true, limit = false, style }) {
  const datos = content.Research;
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const handleClick = (blogId) => {
    navigate(`/research/${blogId}`);
  };

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

  console.log(data);

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
          <button className="bb-previus" onClick={handlePrev}>
            <GoArrowLeft />
          </button>
          <button className="bb-next" onClick={handleNext}>
            <GoArrowRight />
          </button>
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
