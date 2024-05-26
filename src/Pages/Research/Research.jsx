import { useEffect, useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import content from "./researchContent.json"; // Asegúrate de tener el archivo JSON en la misma carpeta o actualizar la ruta según corresponda
import "./Research.scss";
import "./Research-mobile.scss";
import { useNavigate } from "react-router-dom";
function Research({ title = true, limit = false, style }) {
  const data = content.Research;
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const handleClick = (blogId) => {
    navigate(`/research/${blogId}`);
  };

  const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Importar todos los archivos JSON en la carpeta `src/API/Projects`
      const jsonFiles = import.meta.glob("/src/API/Articles/*.json");

      // Array para almacenar los datos de los proyectos
      const projectData = [];

      // Iterar sobre los archivos y obtener sus nombres y contenido
      for (const path in jsonFiles) {
        const module = await jsonFiles[path]();
        projectData.push({
          path,
          data: module.default,
        });
      }

      // Actualizar el estado con los datos de los proyectos
      setJsonData(projectData);
    }

    fetchData();
  }, []);

  const articles = jsonData.map((article) => article.data);
  const displayedArticles = articles
    .slice(currentIndex, currentIndex + 4)
    .concat(articles.slice(0, Math.max(0, currentIndex + 4 - articles.length)));

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 4 + articles.length) % articles.length
    );
  };

  return (
    <div className="Research">
      <div className="b-buttons" style={style}>
        <span>{title ? data.title : ""}</span>
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
        {(limit ? displayedArticles : articles).map((article, index) => (
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
