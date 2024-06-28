import { Link } from "react-router-dom";
import "./Footer.scss";
import { useState, useEffect } from "react";
import { useLanguage } from "./../../Context/LanguageContext";
import FetchDataComponent from "./../FetchDataComponent/FetchDataComponent";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
function Footer() {
  const [w, setW] = useState(window.innerWidth);
  const { language } = useLanguage();
  const content = FetchDataComponent("Footer");

  useEffect(() => {
    const handleResize = () => {
      setW(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <footer className="Footer">
      <div className="footer-content">
        <div className="footer__logo">
          <img src={content.logoSrc} alt={content.logoAlt} />
        </div>
        <div className="footer__links">
          <Link to={`/${language}/about`}>{content.links.about}</Link>
          <Link to={`/${language}/projects`}>{content.links.projects}</Link>
          <Link to={`/${language}/services`}>{content.links.extras}</Link>
          <Link to={`/${language}/research`}>{content.links.blog}</Link>
          <Link to={content.links.github}>
            Github <FaGithub />{" "}
          </Link>
          <Link to={content.links.linkedIn}>
            LinkedIn <FaLinkedin />{" "}
          </Link>
          <Link to={content.links.instagram}>
            Instagram <FaInstagramSquare />{" "}
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div>{content.footerText}</div>
        <Link to={`mailto:${content.privacyPolicy}`}>
          {content.privacyPolicy}{" "}
        </Link>

        <div>
          {w}/{content.footerDynamicText}
        </div>
      </div>
    </footer>
  );
}
export default Footer;
