import type { ComponentType } from "react";
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

export interface Tech {
  name: string;
  icon: ComponentType<{ size?: number; color?: string; className?: string }>;
  color: string;
}

// Brand colors from Simple Icons (simpleicons.org). Where the brand is pure
// black (Next.js, Express), use white so it remains readable on a dark UI.
export const STACK: { group: string; items: Tech[] }[] = [
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

export const FLAT_STACK: Tech[] = STACK.flatMap((g) => g.items);
