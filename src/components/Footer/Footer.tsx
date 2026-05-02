import { FaGithub, FaInstagramSquare, FaLinkedin } from "react-icons/fa";
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
          <img src={data.logoSrc} alt={data.logoAlt} width={36} height={36} />
          <p>Built with React. Designed for speed.</p>
        </div>

        <div className="ftr-cols">
          <div>
            <h4>Navigate</h4>
            <Link to={`/${language}/about`}>{data.links.about}</Link>
            <Link to={`/${language}/projects`}>{data.links.projects}</Link>
          </div>
          <div>
            <h4>Social</h4>
            <a href={data.links.github} target="_blank" rel="noreferrer">
              <FaGithub /> GitHub
            </a>
            <a href={data.links.linkedIn} target="_blank" rel="noreferrer">
              <FaLinkedin /> LinkedIn
            </a>
            <a href={data.links.instagram} target="_blank" rel="noreferrer">
              <FaInstagramSquare /> Instagram
            </a>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={`mailto:${data.privacyPolicy}`}>{data.privacyPolicy}</a>
          </div>
        </div>
      </div>

      <div className="ftr-bottom container">
        <span>© {new Date().getFullYear()} {data.footerText}</span>
        <span>{data.footerDynamicText}</span>
      </div>
    </footer>
  );
}
