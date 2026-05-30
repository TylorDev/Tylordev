import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiDownload } from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { useLanguage } from "../../context/LanguageContext";
import { usePage, useProjects } from "../../lib/hooks";
import type { AboutPage, HomePage } from "../../lib/types";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./Home.scss";

const ABOUT_TECHS = [
  { name: "Next.js", label: "N", color: "#ffffff" },
  { name: "React", label: "R", color: "#61DAFB" },
  { name: "TypeScript", label: "TS", color: "#3178C6" },
  { name: "Electron", label: "E", color: "#47848F" },
];

export default function Home() {
  const { language } = useLanguage();

  const { data: about } = usePage<AboutPage>("About");
  const { data: content } = usePage<HomePage>("Home");
  const { data: projects, loading: pLoading } = useProjects();
  const navigate = useNavigate();

  return (
    <div className="home fadeIn">
  
      {/* ABOUT TEASER */}
      {about && (
        <section className="container about-teaser">
          <div className="glass about-teaser-card">
            <img src="/logo.svg" alt={about.profile.displayName} className="about-teaser-img" />
            <div>
              <span className="eyebrow">{about.header.title}</span>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                {about.profile.displayName}{" "}
                <span style={{ color: "var(--text-dim, #a1a1aa)" }}>{about.profile.role}</span>
              </h2>
              <p style={{ color: "#a1a1aa", marginTop: 12, maxWidth: 560 }}>
                {about.paragraphs[0]}
              </p>

              <div className="about-teaser-techs" aria-label="Technologies">
                {ABOUT_TECHS.map((tech) => {
                  return (
                    <span key={tech.name} className="about-teaser-tech">
                      <span style={{ color: tech.color }}>{tech.label}</span>
                      {tech.name}
                    </span>
                  );
                })}
              </div>

              <div className="about-teaser-actions">
                <Link to={`/${language}/about`} className="btn">
                  {content?.about.readMore ?? "Read more"} <FiArrowRight />
                </Link>
                <a
                  href={content?.about.cvHref ?? "/cv.pdf"}
                  download={content?.about.cvFilename ?? "TylorDev-CV.pdf"}
                  className="btn btn-primary"
                >
                  {content?.about.downloadCv ?? "Download CV"} <FiDownload />
                </a>
                {content?.about.githubUrl && (
                  <a
                    href={content.about.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                  >
                    {content.about.githubLabel} <FaGithub />
                  </a>
                )}
                {content?.about.linkedinUrl && (
                  <a
                    href={content.about.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost"
                  >
                    {content.about.linkedinLabel} <FaLinkedinIn />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS PREVIEW */}
      <section className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">{content?.projects.eyebrow ?? "Work"}</span>
    

          </div>
          <Link to={`/${language}/projects`} className="btn btn-ghost">
            {content?.projects.allProjects ?? "All projects"} <FiArrowRight />
          </Link>
        </div>

        <div className="home-grid">
          {pLoading
            ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass" style={{ padding: 0, overflow: "hidden" }}>
                <Skeleton height={200} radius={0} />
                <div style={{ padding: 18 }}>
                  <Skeleton height={14} width="40%" />
                  <div style={{ height: 8 }} />
                  <Skeleton height={20} width="80%" />
                </div>
              </div>
            ))
            : projects.slice(0, 4).map((p, index) => (
              <ProjectCard
                key={p.slug}
                project={p}
                onClick={(slug) => navigate(`/${language}/projects/${slug}`)}
                priority={index === 0}
              />
            ))}
        </div>
      </section>



    </div>
  );
}
