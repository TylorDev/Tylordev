import { FiArrowUpRight } from "react-icons/fi";
import type { Project } from "../../lib/types";
import "./ProjectCard.scss";

interface Props {
  project: Project;
  onClick: (slug: string) => void;
}

export default function ProjectCard({ project, onClick }: Props) {
  const { data, slug } = project;
  return (
    <article className="pcard glass fadeIn" onClick={() => onClick(slug)} role="button" tabIndex={0}>
      <div className="pcard-cover">
        {data.coverImageSrc ? (
          <img src={data.coverImageSrc} alt={data.coverImageAlt ?? data.tittle} loading="lazy" />
        ) : (
          <div className="pcard-cover-empty" />
        )}
        <span className="pcard-tag">{data.type || "Project"}</span>
        <span className="pcard-arrow"><FiArrowUpRight /></span>
      </div>
      <div className="pcard-body">
        <div className="pcard-meta">
          <span className={`status status-${(data.status || "draft").toLowerCase()}`}>
            {data.status || "Draft"}
          </span>
          <span>{data.date}</span>
        </div>
        <h3 className="pcard-title">{data.tittle}</h3>
        {data.tags && <p className="pcard-tags">{data.tags}</p>}
      </div>
    </article>
  );
}
