import "./ArticleCard.scss";

export function ArticleCard({ article, handleClick }) {
  return (
    <div className="r-article">
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
  );
}
