import { useState, useMemo, useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { FLAT_STACK, type Tech } from "../../../lib/tech";
import "./TechSelector.scss";

interface TechSelectorProps {
  value: string; // comma-separated string
  onChange: (value: string) => void;
}

export default function TechSelector({ value, onChange }: TechSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse comma-separated value into array of names
  const selectedNames = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const selectedTechs = selectedNames
    .map((name) => FLAT_STACK.find((t) => t.name === name) || { name, label: name.slice(0, 2).toUpperCase(), color: "#fff" })
    .filter(Boolean) as Tech[];

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return FLAT_STACK.filter(
      (t) => !selectedNames.includes(t.name) && t.name.toLowerCase().includes(q)
    );
  }, [query, selectedNames]);

  const toggle = (name: string) => {
    let next: string[];
    if (selectedNames.includes(name)) {
      next = selectedNames.filter((n) => n !== name);
    } else {
      next = [...selectedNames, name];
    }
    onChange(next.join(", "));
    setQuery("");
  };

  return (
    <div className="tech-selector" ref={containerRef}>
      <div className="tech-selector-box" onClick={() => setOpen(true)}>
        <div className="tech-selector-tags">
          {selectedTechs.length === 0 && <span className="tech-placeholder">Select technologies...</span>}
          {selectedTechs.map((tech) => (
            <span key={tech.name} className="tech-tag" style={{ "--c": tech.color } as any}>
              <span className="tech-mini">{tech.label}</span>
              {tech.name}
              <button
                type="button"
                className="tech-tag-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(tech.name);
                }}
              >
                <FiX />
              </button>
            </span>
          ))}
        </div>
      </div>

      {open && (
        <div className="tech-dropdown glass">
          <div className="tech-dropdown-search">
            <FiSearch />
            <input
              autoFocus
              placeholder="Search stack..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="tech-dropdown-list">
            {filtered.length === 0 ? (
              <div className="tech-dropdown-empty">No matching technologies</div>
            ) : (
              filtered.map((tech) => (
                <button
                  key={tech.name}
                  type="button"
                  className="tech-dropdown-item"
                  onClick={() => toggle(tech.name)}
                >
                  <span className="tech-icon" style={{ color: tech.color }}>
                    {tech.label}
                  </span>
                  {tech.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
