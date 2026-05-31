import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiExternalLink, FiGithub, FiEye, FiFileText } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";
import { usePage, useProject } from "../../lib/hooks";
import type { Project, ProjectDetailContentPage } from "../../lib/types";
import { FLAT_STACK } from "../../lib/tech";
import { getTypeIcon } from "../../lib/typeIcons";
import Skeleton from "../../components/Skeleton/Skeleton";
import ArticleImage from "../../components/ImageModal/ImageModal";
import "./ProjectDetail.scss";

/** Presentational component — renders a Project in full detail view. */
export function ProjectDetailView({
  data,
  backTo,
  content,
}: {
  data: Project;
  backTo?: string;
  content?: ProjectDetailContentPage;
}) {
  const backHref = backTo ?? "/en-us/projects";
  const labels = content ?? {
    allProjects: "All projects",
    defaultType: "Project",
    readMore: "Read more",
    notFound: "Project not found",
    backToProjects: "Back to projects",
    sectionAlt: "Section {number}",
  };

  const techNames = (data.data.technologies ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const techIcons = techNames
    .map((name) => FLAT_STACK.find((t) => t.name === name))
    .filter(Boolean) as typeof FLAT_STACK;

  return (
    <div className="pdetail fadeIn">
      <div className="pdetail-hero" style={data.header.backgroundImage ? { backgroundImage: `url(${data.header.backgroundImage})` } : undefined}>
        <div className="pdetail-hero-overlay" />
        <div className="container pdetail-hero-inner">
          <Link to={backHref} className="btn btn-ghost pdetail-back">
            <FiArrowLeft /> {labels.allProjects}
          </Link>
          <span className="eyebrow" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {getTypeIcon(data.data.type || labels.defaultType)}
            {data.data.type || labels.defaultType}
          </span>
          <h1 className="pdetail-title">{data.data.tittle}</h1>
          {data.header.subtitle && <p className="pdetail-sub">{data.header.subtitle}</p>}

          {techIcons.length > 0 && (
            <div className="pdetail-techs">
              {techIcons.map((tech) => (
                <span key={tech.name} style={{ color: tech.color }} title={tech.name}>
                  <tech.icon size={20} />
                </span>
              ))}
            </div>
          )}

          <div className="pdetail-buttons">
            {data.header.buttons.map((b, i) => {
              if (!b.url) return null;
              let btnClass = "btn-primary";
              let Icon = FiExternalLink;

              if (b.icon === "github") { Icon = FiGithub; btnClass = "btn-source"; }
              if (b.icon === "preview") { Icon = FiEye; btnClass = "btn-live"; }
              if (b.icon === "docs") { Icon = FiFileText; btnClass = "btn-docs"; }

              return (
                <a
                  key={i}
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`btn ${btnClass}`}
                >
                  {b.text} <Icon />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container pdetail-sections">
        {data.sections.map((s, i) => (
          <section
            key={i}
            className="pdetail-section glass"
            style={{ flexDirection: s.flexDirection === "row-reverse" ? "row-reverse" : "row" }}
          >
            {s.coverImage && (
              <div className="pdetail-section-img">
                <ArticleImage
                  src={s.coverImage}
                  alt={labels.sectionAlt.replace("{number}", String(i + 1))}
                />
              </div>
            )}
            <div className="pdetail-section-text">
              <p>{s.tmContent.summary}</p>
              {s.tmContent.modalContent && (
                <details>
                  <summary>{s.tmContent.readMore || labels.readMore}</summary>
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

export default function ProjectDetail() {
  const { projectName } = useParams<{ projectName: string }>();
  const { language } = useLanguage();
  const { data, loading, error } = useProject(projectName);
  const { data: content } = usePage<ProjectDetailContentPage>("ProjectDetailContent");
  const labels = content ?? {
    allProjects: "All projects",
    defaultType: "Project",
    readMore: "Read more",
    notFound: "Project not found",
    backToProjects: "Back to projects",
    sectionAlt: "Section {number}",
  };

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
        <h2>{labels.notFound}</h2>
        <Link to={`/${language}/projects`} className="btn">
          <FiArrowLeft /> {labels.backToProjects}
        </Link>
      </div>
    );
  }

  return <ProjectDetailView data={data} backTo={`/${language}/projects`} content={labels} />;
}
