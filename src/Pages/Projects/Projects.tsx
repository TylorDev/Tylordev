import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useProjects, usePage } from "../../lib/hooks";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./Projects.scss";

interface ProjectsContentPage {
  Projects: { header: { mainText: string; tittle: string } };
}

export default function Projects() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { data, loading } = useProjects();
  const { data: content } = usePage<ProjectsContentPage>("projectsContent");

  const [filter, setFilter] = useState<string>("All");

  const types = useMemo(() => {
    const set = new Set<string>(["All"]);
    data.forEach((p) => p.data.type && set.add(p.data.type));
    return Array.from(set);
  }, [data]);

  const filtered = filter === "All" ? data : data.filter((p) => p.data.type === filter);

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
            ? filtered.map((p) => (
              <ProjectCard
                key={p.slug}
                project={p}
                onClick={(slug) => navigate(`/${language}/projects/${slug}`)}
              />
            ))
            : (
              <div className="projects-empty glass">
                <p>No projects yet.</p>
              </div>
            )}
      </section>
    </div>
  );
}
