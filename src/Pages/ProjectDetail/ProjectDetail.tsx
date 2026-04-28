import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";
import { useProject } from "../../lib/hooks";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./ProjectDetail.scss";

export default function ProjectDetail() {
  const { projectName } = useParams<{ projectName: string }>();
  const { language } = useLanguage();
  const { data, loading, error } = useProject(projectName);

  if (loading) {
    return (
      <div className="container pdetail">
        <Skeleton height={48} width="40%" />
        <div style={{ height: 24 }} />
        <Skeleton height={400} radius={20} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container pdetail pdetail-empty">
        <h2>Project not found</h2>
        <Link to={`/${language}/projects`} className="btn">
          <FiArrowLeft /> Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="pdetail fadeIn">
      <div className="pdetail-hero" style={data.header.backgroundImage ? { backgroundImage: `url(${data.header.backgroundImage})` } : undefined}>
        <div className="pdetail-hero-overlay" />
        <div className="container pdetail-hero-inner">
          <Link to={`/${language}/projects`} className="btn btn-ghost pdetail-back">
            <FiArrowLeft /> All projects
          </Link>
          <span className="eyebrow">{data.data.type || "Project"}</span>
          <h1 className="pdetail-title">{data.header.title || data.data.tittle}</h1>
          {data.header.subtitle && <p className="pdetail-sub">{data.header.subtitle}</p>}

          <div className="pdetail-buttons">
            {data.header.buttons.map((b, i) =>
              b.url ? (
                <a key={i} href={b.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                  {b.text} <FiExternalLink />
                </a>
              ) : null
            )}
          </div>
        </div>
      </div>

      {data.header.message && (
        <div className="container pdetail-message">
          <p>{data.header.message}</p>
        </div>
      )}

      <div className="container pdetail-sections">
        {data.sections.map((s, i) => (
          <section
            key={i}
            className="pdetail-section glass"
            style={{ flexDirection: s.flexDirection === "row-reverse" ? "row-reverse" : "row" }}
          >
            {s.coverImage && (
              <div className="pdetail-section-img">
                <img src={s.coverImage} alt={`Section ${i + 1}`} loading="lazy" />
              </div>
            )}
            <div className="pdetail-section-text">
              <p>{s.tmContent.summary}</p>
              {s.tmContent.modalContent && (
                <details>
                  <summary>{s.tmContent.readMore || "Read more"}</summary>
                  <p>{s.tmContent.modalContent}</p>
                </details>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
