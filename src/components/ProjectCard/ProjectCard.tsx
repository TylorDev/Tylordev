import { FiArrowUpRight, FiExternalLink, FiCode } from "react-icons/fi";
import type { Project } from "../../lib/types";
import { FLAT_STACK } from "../../lib/tech";
import { getTypeIcon } from "../../lib/typeIcons";
import { useLanguage } from "../../context/LanguageContext";
import { useDominantColor } from "../../lib/useDominantColor";
import "./ProjectCard.scss";

interface Props {
  project: Project;
  onClick: (slug: string) => void;
}

const LABELS = {
  "en-us": { preview: "Live Preview", source: "Source Code" },
  "es-mx": { preview: "Vista Previa", source: "Código Fuente" },
  "pt-br": { preview: "Pré-visualização", source: "Código Fonte" },
} as const;

export default function ProjectCard({ project, onClick }: Props) {
  const { data, slug } = project;
  const { language } = useLanguage();
  const labels = LABELS[language] ?? LABELS["en-us"];

  const colors = useDominantColor(data.coverImageSrc);

  const techNames = (data.technologies ?? "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const techIcons = techNames
    .map(name => FLAT_STACK.find(t => t.name === name))
    .filter(Boolean) as typeof FLAT_STACK;

  const previewBtn = data.buttons?.[0];
  const sourceBtn = data.buttons?.[1];

  return (
    <article
      className="pcard glass fadeIn"
      onClick={() => onClick(slug)}
      role="button"
      tabIndex={0}
      style={{
        "--pcard-accent": colors.hex,
        "--pcard-accent-rgb": colors.rgb
      } as React.CSSProperties}
    >
      <div className="pcard-cover">
        {data.coverImageSrc ? (
          <img
            src={data.coverImageSrc}
            alt={data.tittle}
            loading="lazy"
          />
        ) : (
          <div className="pcard-cover-empty" />
        )}
        <span className="pcard-tag">
          {getTypeIcon(data.type || "Project")}
          <span style={{ marginLeft: "6px" }}>{data.type || "Project"}</span>
        </span>
        <span className="pcard-arrow"><FiArrowUpRight /></span>
      </div>

      <div className="pcard-body">
        <div className="pcard-meta">
          <span className={`status status-${(data.status || "draft").toLowerCase().replace(/\s+/g, '-')}`}>
            {data.status || "Draft"}
          </span>
          <span>{data.date}</span>
        </div>
        <h3 className="pcard-title">{data.tittle}</h3>

        {data.subtitle && (
          <p className="pcard-desc">{data.subtitle}</p>
        )}

        {techIcons.length > 0 && (
          <div className="pcard-techs">
            {techIcons.map(tech => (
              <span key={tech.name} style={{ color: tech.color }} title={tech.name}>
                <tech.icon size={16} />
              </span>
            ))}
          </div>
        )}
      </div>

      {(previewBtn?.url || sourceBtn?.url) && (
        <div className="pcard-footer">
          {previewBtn?.url && (
            <a
              href={previewBtn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pcard-btn pcard-btn--preview"
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink size={13} />
              {labels.preview}
            </a>
          )}
          {sourceBtn?.url && (
            <a
              href={sourceBtn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="pcard-btn pcard-btn--source"
              onClick={(e) => e.stopPropagation()}
            >
              <FiCode size={13} />
              {labels.source}
            </a>
          )}
        </div>
      )}
    </article>
  );
}
