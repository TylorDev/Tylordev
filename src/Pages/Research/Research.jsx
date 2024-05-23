import { useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import content from "./researchContent.json"; // Asegúrate de tener el archivo JSON en la misma carpeta o actualizar la ruta según corresponda
import "./Research.scss";
import "./Research-mobile.scss";
import { useNavigate } from "react-router-dom";
function Research({ title = true, limit = false, style }) {
  const data = content.Research;
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/blog");
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.articles.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 4 + data.articles.length) % data.articles.length
    );
  };

  const displayedArticles = data.articles
    .slice(currentIndex, currentIndex + 4)
    .concat(
      data.articles.slice(
        0,
        Math.max(0, currentIndex + 4 - data.articles.length)
      )
    );

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
        {(limit ? displayedArticles : data.articles).map((article, index) => (
          <div key={index} className="r-article">
            <div className="rr-cover">
              <img
                src={article.coverImageSrc}
                alt={`Cover for ${article.title}`}
                onClick={handleClick}
              />
            </div>
            <div className="rr-tittle">
              <span className="rr-sub">
                {article.category}/ <span>{article.date}</span>
              </span>
              <span>
                {article.title}. {article.content}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Research;
