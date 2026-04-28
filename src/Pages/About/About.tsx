import type { ComponentType } from "react";
import { FiGithub, FiMapPin } from "react-icons/fi";
import {
  SiCplusplus,
  SiCss,
  SiDocker,
  SiDotnet,
  SiElectron,
  SiExpress,
  SiGit,
  SiGithubpages,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiReacthookform,
  SiTailwindcss,
  SiTypeorm,
  SiTypescript,
  SiVite,
} from "react-icons/si";
import { usePage } from "../../lib/hooks";
import type { AboutPage } from "../../lib/types";
import Skeleton from "../../components/Skeleton/Skeleton";
import "./About.scss";

interface Tech {
  name: string;
  icon: ComponentType<{ size?: number }>;
  color: string;
}

// Brand colors from Simple Icons (simpleicons.org). Where the brand is pure
// black (Next.js, Express), use white so it remains readable on a dark UI.
const STACK: { group: string; items: Tech[] }[] = [
  {
    group: "Frontend",
    items: [
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Vite", icon: SiVite, color: "#646CFF" },
      { name: "React Hook Form", icon: SiReacthookform, color: "#EC5990" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss, color: "#1572B6" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "NestJS", icon: SiNestjs, color: "#E0234E" },
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express", icon: SiExpress, color: "#FFFFFF" },
    ],
  },
  {
    group: "Databases & ORMs",
    items: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MySQL", icon: SiMysql, color: "#4479A1" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "Prisma", icon: SiPrisma, color: "#FFFFFF" },
      { name: "TypeORM", icon: SiTypeorm, color: "#FE0902" },
    ],
  },
  {
    group: "Tooling & DevOps",
    items: [
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "Electron", icon: SiElectron, color: "#47848F" },
      { name: "GitHub Pages", icon: SiGithubpages, color: "#FFFFFF" },
    ],
  },
  {
    group: "Other languages",
    items: [
      { name: "C# / .NET", icon: SiDotnet, color: "#512BD4" },
      { name: "C++", icon: SiCplusplus, color: "#00599C" },
    ],
  },
];

const GITHUB_USER = "TylorDev";
const GITHUB_AVATAR = "https://avatars.githubusercontent.com/u/107888704?v=4";
const GITHUB_URL = `https://github.com/${GITHUB_USER}`;

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
            src={GITHUB_AVATAR}
            alt="TylorDev"
            className="about-avatar"
            loading="lazy"
            width={88}
            height={88}
          />
          <div className="about-id-text">
            <h1 className="about-name">TylorDev</h1>
            <p className="about-role">{data.profile.role}</p>
            <div className="about-meta">
              <span className="about-meta-item"><FiMapPin /> Sp, Brasil</span>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="about-meta-item about-meta-link"
              >
                <FiGithub /> @{GITHUB_USER}
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
          <span className="eyebrow">Stack</span>
          <h2 className="section-title">Tools I work with</h2>
          <p className="section-subtitle">
            What I reach for first — based on what's shipped on{" "}
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="about-stack-link">
              github.com/{GITHUB_USER}
            </a>
            .
          </p>
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
