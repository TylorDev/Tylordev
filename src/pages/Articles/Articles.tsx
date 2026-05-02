import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useArticles } from "../../lib/hooks";
import ArticleCard from "../../components/ArticleCard/ArticleCard";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./Articles.scss";

export default function Articles() {
  const { language } = useLanguage();
  const { data, loading } = useArticles();
  const navigate = useNavigate();

  return (
    <div className="articles fadeIn">
      <header className="container articles-head">
        <span className="eyebrow">Notes & Research</span>
        <h1 className="section-title">
          <span className="gradient-text">Publications</span>
        </h1>
        <p className="section-subtitle">Things I've written along the way.</p>
      </header>

      <section className="container articles-list">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ display: "flex", gap: 18, padding: 16 }}>
                <Skeleton width={140} height={100} />
                <div style={{ flex: 1 }}>
                  <Skeleton height={14} width="30%" />
                  <div style={{ height: 8 }} />
                  <Skeleton height={20} width="80%" />
                  <div style={{ height: 8 }} />
                  <Skeleton height={14} />
                </div>
              </div>
            ))
          : data.length > 0
          ? data.map((a) => (
              <ArticleCard
                key={a.slug}
                article={a}
                onClick={(slug) => navigate(`/${language}/research/${slug}`)}
              />
            ))
          : (
            <div className="articles-empty glass">No publications yet.</div>
          )}
      </section>
    </div>
  );
}
