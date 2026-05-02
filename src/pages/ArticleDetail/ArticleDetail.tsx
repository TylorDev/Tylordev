import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";
import { useArticle } from "../../lib/hooks";
import type { Article } from "../../lib/types";
import Skeleton from "../../components/Skeleton/Skeleton";
import ArticleImage from "../../components/ImageModal/ImageModal";
import "./ArticleDetail.scss";

/** Presentational component - renders an Article in full detail view. */
export function ArticleDetailView({ data, backTo }: { data: Article; backTo?: string }) {
  const backHref = backTo ?? "/en-us/research";

  return (
    <article className="adetail fadeIn">
      <div className={`adetail-hero ${data.bannerImage ? "has-bg" : ""}`}>
        {data.bannerImage && (
          <div className="adetail-hero-bg">
            <img src={data.bannerImage} alt={data.data.title} loading="lazy" />
            <div className="adetail-hero-overlay" />
          </div>
        )}
        <div className="container adetail-head">
          <Link to={backHref} className="btn btn-ghost adetail-back">
            <FiArrowLeft /> All publications
          </Link>
          <span className="eyebrow">{data.data.category} · {data.data.date}</span>
          <h1 className="adetail-title">{data.data.title}</h1>
          {data.contentTitle && <p className="adetail-lede">{data.contentTitle}</p>}
        </div>
      </div>



      <div className="container adetail-body">
        <p className="adetail-intro">{data.data.content}</p>

        {data.sections.map((s, i) => (
          <section key={i} className="adetail-section">

            {s.tittle && <h2>{s.tittle}</h2>}
            {s.paragraph && <p>{s.paragraph}</p>}
            {s.image && <ArticleImage src={s.image} alt={s.tittle} />}

          </section>
        ))}
      </div>
    </article>
  );
}

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { data, loading, error } = useArticle(id);

  if (loading) {
    return (
      <div className="container adetail">
        <Skeleton height={48} width="60%" />
        <div style={{ height: 24 }} />
        <Skeleton height={300} radius={20} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container adetail adetail-empty">
        <h2>Article not found</h2>
        <Link to={`/${language}/research`} className="btn">
          <FiArrowLeft /> All publications
        </Link>
      </div>
    );
  }

  return <ArticleDetailView data={data} backTo={`/${language}/research`} />;
}
