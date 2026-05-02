import type { Article } from "../../lib/types";
import "./ArticleCard.scss";

interface Props {
  article: Article;
  onClick: (slug: string) => void;
}

export default function ArticleCard({ article, onClick }: Props) {
  const { data, slug } = article;
  return (
    <article className="acard fadeIn" onClick={() => onClick(slug)} role="button" tabIndex={0}>
      <div className="acard-cover">
        {data.coverImageSrc ? (
          <img src={data.coverImageSrc} alt={data.title} loading="lazy" />
        ) : (
          <div className="acard-cover-empty" />
        )}
      </div>
      <div className="acard-body">
        <div className="acard-meta">
          <span>{data.category || "Article"}</span>
          <span>•</span>
          <span>{data.date}</span>
        </div>
        <h3 className="acard-title">{data.title}</h3>
        <p className="acard-excerpt">{data.content}</p>
      </div>
    </article>
  );
}
