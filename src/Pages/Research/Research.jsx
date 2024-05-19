import "./Research.scss";
import "./Research-mobile.scss";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import content from "./researchContent.json"; // Asegúrate de tener el archivo JSON en la misma carpeta o actualizar la ruta según corresponda

function Research({ title = true }) {
  const data = content.Research;

  return (
    <div className="Research">
      <div className="b-buttons">
        <span>{title ? data.title : ""}</span>
        <div>
          <button>
            <GoArrowLeft />
          </button>
          <button>
            <GoArrowRight />
          </button>
        </div>
      </div>

      <div className="r-articles">
        {data.articles.map((article, index) => (
          <div key={index} className="r-article">
            <div className="rr-cover">
              <img
                src={article.coverImageSrc}
                alt={`Cover for ${article.title}`}
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
