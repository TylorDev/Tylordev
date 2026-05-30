import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { usePage } from "../../lib/hooks";
import type { FooterPage } from "../../lib/types";
import "./Footer.scss";

export default function Footer() {
  const { data, loading } = usePage<FooterPage>("Footer");
  const { language } = useLanguage();

  if (loading || !data) {
    return (
      <footer className="ftr">
        <div className="container ftr-inner">
          <div className="skeleton" style={{ height: 80 }} />
        </div>
      </footer>
    );
  }

  return (
    <footer className="ftr">
      <div className="container ftr-inner">
        <div className="ftr-brand">
          <span className="ftr-logo">
            <img src={data.logoSrc} alt={data.logoAlt} width={42} height={42} />
          </span>
          <p>{data.footerText}</p>
        </div>

        <nav className="ftr-section ftr-nav" aria-label="Footer navigation">
          <h4>{data.headings.navigate}</h4>
          <div className="ftr-links">
            <Link to={`/${language}/about`}>{data.links.about}</Link>
            <Link to={`/${language}/projects`}>{data.links.projects}</Link>
          </div>
        </nav>

        <div className="ftr-section ftr-social">
          <h4>{data.headings.social}</h4>
          <div className="ftr-social-links">
            <a href={data.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href={data.links.linkedIn} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
            <a href={data.links.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="ftr-cta">
         
          <Link to={`/${language}/contact`} className="ftr-cta-btn">
             <FiArrowUpRight />
          </Link>
        </div>
      </div>
    </footer>
  );
}
