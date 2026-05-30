export interface Tech {
  name: string;
  color: string;
  label: string;
}

// Brand colors from Simple Icons (simpleicons.org). Where the brand is pure
// black (Next.js, Express), use white so it remains readable on a dark UI.
export const STACK: { group: string; items: Tech[] }[] = [
  {
    group: "Frontend",
    items: [
      { name: "React", color: "#61DAFB", label: "R" },
      { name: "Next.js", color: "#FFFFFF", label: "N" },
      { name: "TypeScript", color: "#3178C6", label: "TS" },
      { name: "JavaScript", color: "#F7DF1E", label: "JS" },
      { name: "Tailwind CSS", color: "#06B6D4", label: "TW" },
      { name: "Vite", color: "#646CFF", label: "V" },
      { name: "React Hook Form", color: "#EC5990", label: "RH" },
      { name: "HTML5", color: "#E34F26", label: "H" },
      { name: "CSS3", color: "#1572B6", label: "C" },
    ],
  },
  {
    group: "Backend",
    items: [
      { name: "NestJS", color: "#E0234E", label: "N" },
      { name: "Node.js", color: "#339933", label: "ND" },
      { name: "Express", color: "#FFFFFF", label: "EX" },
    ],
  },
  {
    group: "Databases & ORMs",
    items: [
      { name: "PostgreSQL", color: "#4169E1", label: "PG" },
      { name: "MySQL", color: "#4479A1", label: "MY" },
      { name: "MongoDB", color: "#47A248", label: "MO" },
      { name: "Prisma", color: "#FFFFFF", label: "PR" },
      { name: "TypeORM", color: "#FE0902", label: "TO" },
    ],
  },
  {
    group: "Tooling & DevOps",
    items: [
      { name: "Docker", color: "#2496ED", label: "D" },
      { name: "Git", color: "#F05032", label: "G" },
      { name: "Electron", color: "#47848F", label: "E" },
      { name: "GitHub Pages", color: "#FFFFFF", label: "GH" },
    ],
  },
  {
    group: "Other languages",
    items: [
      { name: "C# / .NET", color: "#512BD4", label: "C#" },
      { name: "C++", color: "#00599C", label: "C++" },
    ],
  },
];

export const FLAT_STACK: Tech[] = STACK.flatMap((g) => g.items);
