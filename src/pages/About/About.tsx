import { FiGithub, FiMapPin } from "react-icons/fi";
import { STACK } from "../../lib/tech";
import { usePage } from "../../lib/hooks";
import type { AboutPage } from "../../lib/types";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./About.scss";

export default function About() {
  const { data, loading } = usePage<AboutPage>("About");

  if (loading || !data) {
    return (
      <div className="container about">
        <Skeleton height={48} width="60%" />
        <div style={{ height: 24 }} />
        <Skeleton height={200} radius={6} />
      </div>
    );
  }

  return (
    <div className="about fadeIn">
      <header className="container about-head">
        <span className="eyebrow">{data.header.title}</span>

        <div className="about-id">
          <img
            src={data.profile.avatarSrc}
            alt={data.profile.displayName}
            className="about-avatar"
            loading="lazy"
            width={88}
            height={88}
          />
          <div className="about-id-text">
            <h1 className="about-name">{data.profile.displayName}</h1>
            <p className="about-role">{data.profile.role}</p>
            <div className="about-meta">
              <span className="about-meta-item"><FiMapPin /> {data.profile.languages}</span>
              <a
                href={data.profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="about-meta-item about-meta-link"
              >
                <FiGithub />
              </a>
            </div>
          </div>
        </div>
      </header>

      <section className="container about-bio">
        {data.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </section>

      <section className="container about-stack">
        <header className="about-stack-head">
        
        
        </header>

        {STACK.map((g) => (
          <div key={g.group} className="about-stack-group">
            <h4>{g.group}</h4>
            <div className="about-stack-grid">
              {g.items.map(({ name, icon: Icon, color }) => (
                <div key={name} className="tech" title={name}>
                  <span className="tech-icon" style={{ color }}>
                    <Icon size={18} />
                  </span>
                  <span className="tech-name">{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
