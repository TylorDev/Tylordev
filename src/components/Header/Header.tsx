import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useLanguage } from "../../context/LanguageContext";
import { usePage } from "../../lib/hooks";
import type { HeaderPage, Locale } from "../../lib/types";
import "./Header.scss";

const langLabel: Record<Locale, string> = {
  "en-us": "EN",
  "es-mx": "ES",
  "pt-br": "PT",
};

export default function Header() {
  const { data, loading } = usePage<HeaderPage>("Header");
  const { language, setLanguage, supported } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLang = (next: Locale) => {
    setLanguage(next);
    const parts = location.pathname.split("/").filter(Boolean);
    parts[0] = next;
    navigate(`/${parts.join("/")}${location.search}${location.hash}`);
  };

  const navItems = data?.navItems ?? {
    about: "About",
    projects: "Projects",
    research: "Publications",
    resources: "Resources",
    contact: "Contact",
  };
  const aria = data?.aria ?? {
    home: "Home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchTo: "Switch to",
  };

  return (
    <header className="hdr">
      <div className="hdr-inner container">
        <NavLink to={`/${language}`} className="hdr-logo" aria-label={aria.home}>
          {loading ? (
            <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
          ) : (
            <img src="logo.svg" alt={data?.logoAlt ?? "logo"} width={32} height={32} />
          )}
        
        </NavLink>

        <nav className={`hdr-nav ${open ? "open" : ""}`}>
          <NavLink to={`/${language}/about`} onClick={() => setOpen(false)}>{navItems.about}</NavLink>
          <NavLink to={`/${language}/projects`} onClick={() => setOpen(false)}>{navItems.projects}</NavLink>
          <NavLink to={`/${language}/contact`} onClick={() => setOpen(false)}>{navItems.contact}</NavLink>

          <div className="hdr-lang">
            {supported.map((l) => (
              <button
                key={l}
                className={l === language ? "active" : ""}
                onClick={() => handleLang(l)}
                aria-label={`${aria.switchTo} ${l}`}
              >
                {langLabel[l]}
              </button>
            ))}
          </div>

        </nav>

        <button
          className="hdr-burger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? aria.closeMenu : aria.openMenu}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
    </header>
  );
}
