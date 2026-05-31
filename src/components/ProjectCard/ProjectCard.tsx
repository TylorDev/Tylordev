import { FiArrowUpRight, FiExternalLink, FiCode } from "react-icons/fi";
import type { Project } from "../../lib/types";
import { FLAT_STACK } from "../../lib/tech";
import { getTypeIcon } from "../../lib/typeIcons";
import { useLanguage } from "../../context/LanguageContext";
import "./ProjectCard.scss";

interface Props {
  project: Project;
  onClick: (slug: string) => void;
  priority?: boolean;
}

const LABELS = {
  "en-us": { preview: "Live Preview", source: "Source Code" },
  "es-mx": { preview: "Vista Previa", source: "Código Fuente" },
  "pt-br": { preview: "Pré-visualização", source: "Código Fonte" },
} as const;

const TYPE_ACCENTS: Record<string, { hex: string; rgb: string }> = {
  backend: { hex: "#22c55e", rgb: "34, 197, 94" },
  desktop: { hex: "#38bdf8", rgb: "56, 189, 248" },
  discord: { hex: "#5865f2", rgb: "88, 101, 242" },
  frontend: { hex: "#a78bfa", rgb: "167, 139, 250" },
  mobile: { hex: "#f97316", rgb: "249, 115, 22" },
};

function getAccent(type: string | undefined, techColor: string | undefined) {
  const normalized = (type ?? "").toLowerCase();
  const match = Object.entries(TYPE_ACCENTS).find(([key]) => normalized.includes(key));
  const hex = match?.[1].hex ?? techColor ?? "#2e2e34";
  const rgb = match?.[1].rgb ?? "46, 46, 52";
  return { hex, rgb };
}

export default function ProjectCard({ project, onClick, priority = false }: Props) {
  const { data, slug } = project;
  const { language } = useLanguage();
  const labels = LABELS[language] ?? LABELS["en-us"];

  const techNames = (data.technologies ?? "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const techIcons = techNames
    .map(name => FLAT_STACK.find(t => t.name === name))
    .filter(Boolean) as typeof FLAT_STACK;
  const colors = getAccent(data.type, techIcons[0]?.color);

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
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={priority ? "high" : "auto"}
            width={640}
            height={400}
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
