import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const navId = "site-mobile-nav";
  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const previousOverflow = useRef("");
  const menuHistoryActive = useRef(false);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const openMenu = useCallback(() => {
    if (!menuHistoryActive.current) {
      window.history.pushState({ mobileMenu: true }, "", window.location.href);
      menuHistoryActive.current = true;
    }
    setOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setOpen(false);

    if (menuHistoryActive.current) {
      menuHistoryActive.current = false;
      window.history.back();
    }
  }, []);

  const dismissMenu = useCallback(() => {
    menuHistoryActive.current = false;
    setOpen(false);
  }, []);

  const closeMenuForNavigation = useCallback(() => {
    const replace = menuHistoryActive.current;
    menuHistoryActive.current = false;
    setOpen(false);
    return replace;
  }, []);

  const toggleMenu = useCallback(() => {
    if (openRef.current) {
      closeMenu();
      return;
    }

    openMenu();
  }, [closeMenu, openMenu]);

  useEffect(() => {
    if (openRef.current) dismissMenu();
  }, [location.pathname, location.search, location.hash, dismissMenu]);

  useEffect(() => {
    const handlePopState = () => {
      if (!menuHistoryActive.current) return;

      dismissMenu();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [dismissMenu]);

  useEffect(() => {
    if (!open) return;

    const isInsideHeader = (target: EventTarget | null) => {
      if (!(target instanceof Node)) return false;
      return Boolean(headerRef.current?.contains(target) || navRef.current?.contains(target));
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!isInsideHeader(event.target)) {
        dismissMenu();
      }
    };

    const onFocusIn = (event: FocusEvent) => {
      if (!isInsideHeader(event.target)) {
        dismissMenu();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow.current;
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeMenu, dismissMenu]);

  const handleMenuNav = (event: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    event.preventDefault();
    const replace = closeMenuForNavigation();
    navigate(to, { replace });
  };

  const handleLang = (next: Locale) => {
    setLanguage(next);
    const replace = closeMenuForNavigation();
    const parts = location.pathname.split("/").filter(Boolean);
    parts[0] = next;
    navigate(`/${parts.join("/")}${location.search}${location.hash}`, { replace });
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
    <header ref={headerRef} className="hdr">
      <div className="hdr-inner container">
        <NavLink to={`/${language}`} className="hdr-logo" aria-label={aria.home}>
          {loading ? (
            <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8 }} />
          ) : (
            <>
              <img src={data?.logoSrc ?? "/logo.svg"} alt={data?.logoAlt ?? "logo"} width={32} height={32} />
              <span className="hdr-logo-hint" aria-hidden="true">{aria.home}</span>
            </>
          )}
        
        </NavLink>

        <nav
          ref={navRef}
          id={navId}
          className={`hdr-nav ${open ? "open" : ""}`}
          aria-hidden={open ? "false" : "true"}
        >
          <NavLink to={`/${language}/about`} onClick={(event) => handleMenuNav(event, `/${language}/about`)}>{navItems.about}</NavLink>
          <NavLink to={`/${language}/projects`} onClick={(event) => handleMenuNav(event, `/${language}/projects`)}>{navItems.projects}</NavLink>
          <NavLink to={`/${language}/contact`} onClick={(event) => handleMenuNav(event, `/${language}/contact`)}>{navItems.contact}</NavLink>

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
          type="button"
          className="hdr-burger"
          onClick={toggleMenu}
          aria-controls={navId}
          aria-expanded={open}
          aria-label={open ? aria.closeMenu : aria.openMenu}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>
      <div
        className={`hdr-overlay ${open ? "open" : ""}`}
        aria-hidden="true"
      />
    </header>
  );
}
