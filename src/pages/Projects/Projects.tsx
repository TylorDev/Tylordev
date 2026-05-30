import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useProjects, usePage } from "../../lib/hooks";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import Skeleton from "../../components/Skeleton/Skeleton";
import type { ProjectsContentPage } from "../../lib/types";
import "./Projects.scss";

export default function Projects() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { data, loading } = useProjects();
  const { data: content } = usePage<ProjectsContentPage>("projectsContent");

  const allLabel = content?.Projects.filters.all ?? "All";
  const [filter, setFilter] = useState<string>(allLabel);

  useEffect(() => {
    setFilter(allLabel);
  }, [allLabel]);

  const types = useMemo(() => {
    const set = new Set<string>([allLabel]);
    data.forEach((p) => p.data.type && set.add(p.data.type));
    return Array.from(set);
  }, [data, allLabel]);

  const filtered = filter === allLabel ? data : data.filter((p) => p.data.type === filter);

  return (
    <div className="projects fadeIn">
      <header className="container projects-head">
        <span className="eyebrow">{content?.Projects.header.mainText ?? "Work"}</span>
        <h1 className="section-title">
          <span className="gradient-text">{content?.Projects.header.tittle ?? "Projects"}</span>
        </h1>


        <div className="projects-filters">
          {types.map((t) => (
            <button
              key={t}
              className={`projects-chip ${t === filter ? "active" : ""}`}
              onClick={() => setFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <section className="container projects-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass" style={{ overflow: "hidden", padding: 0 }}>
              <Skeleton height={220} radius={0} />
              <div style={{ padding: 20 }}>
                <Skeleton height={14} width="40%" />
                <div style={{ height: 8 }} />
                <Skeleton height={22} width="80%" />
              </div>
            </div>
          ))
          : filtered.length > 0
            ? filtered.map((p, index) => (
              <ProjectCard
                key={p.slug}
                project={p}
                onClick={(slug) => navigate(`/${language}/projects/${slug}`)}
                priority={index === 0}
              />
            ))
            : (
              <div className="projects-empty glass">
                <p>{content?.Projects.empty ?? "No projects yet."}</p>
              </div>
            )}
      </section>
    </div>
  );
}
