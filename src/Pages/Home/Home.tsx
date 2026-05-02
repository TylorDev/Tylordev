import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";
import { usePage, useProjects } from "../../lib/hooks";
import type { HeroPage, AboutPage } from "../../lib/types";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./Home.scss";

export default function Home() {
  const { language } = useLanguage();
  const { data: hero, loading: heroLoading } = usePage<HeroPage>("Hero");
  const { data: about } = usePage<AboutPage>("About");
  const { data: projects, loading: pLoading } = useProjects();
  const navigate = useNavigate();

  return (
    <div className="home fadeIn">
      {/* HERO */}
      <section className="hero">
        <div className="hero-dots" aria-hidden />
        <div className="container hero-inner">
          <span className="eyebrow">React · Next.js · NestJS · TypeScript</span>
          {heroLoading || !hero ? (
            <>
              <Skeleton height={56} radius={6} />
              <Skeleton height={28} width="80%" radius={6} />
              <Skeleton height={28} width="60%" radius={6} />
            </>
          ) : (
            <>
              <h1 className="hero-title">
                <span className="gradient-text">{hero.hero.title}</span>
              </h1>
              <p className="hero-subtitle">{hero.hero.subtitle}</p>
              <div className="hero-cta">
                <Link to={`/${language}/projects`} className="btn btn-primary">
                  {hero.hero.post.buttonText} <FiArrowRight />
                </Link>
                <Link to={`/${language}/about`} className="btn">
                  About <FiArrowUpRight />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      {/* ABOUT TEASER */}
      {about && (
        <section className="container section about-teaser">
          <div className="glass about-teaser-card">
            <img src={about.profile.imageSrc} alt={about.profile.name} className="about-teaser-img" />
            <div>
              <span className="eyebrow">{about.header.title}</span>
              <h2 className="section-title" style={{ marginTop: 12 }}>
                {about.profile.name}{" "}
                <span style={{ color: "var(--text-dim, #a1a1aa)" }}>{about.profile.role}</span>
              </h2>
              <p style={{ color: "#a1a1aa", marginTop: 12, maxWidth: 560 }}>
                {about.paragraphs[0]}
              </p>
              <Link to={`/${language}/about`} className="btn" style={{ marginTop: 20 }}>
                Read more <FiArrowRight />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS PREVIEW */}
      <section className="container section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Work</span>
            <h2 className="section-title">Selected projects</h2>
            <p className="section-subtitle">Recent work — open source &amp; client.</p>
          </div>
          <Link to={`/${language}/projects`} className="btn btn-ghost">
            All projects <FiArrowRight />
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
            : projects.slice(0, 4).map((p) => (
              <ProjectCard
                key={p.slug}
                project={p}
                onClick={(slug) => navigate(`/${language}/projects/${slug}`)}
              />
            ))}
        </div>
      </section>



    </div>
  );
}
