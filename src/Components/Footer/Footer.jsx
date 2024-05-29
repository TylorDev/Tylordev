import { Link } from "react-router-dom";
import "./Footer.scss";
import { useState, useEffect } from "react";

import FetchDataComponent from "./../FetchDataComponent/FetchDataComponent";

function Footer() {
  const [w, setW] = useState(window.innerWidth);

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
          <Link to="/about">{content.links.about}</Link>
          <Link to="/projects">{content.links.projects}</Link>
          <Link to="/extras">{content.links.extras}</Link>
          <Link to="/research">{content.links.research}</Link>
          <Link to="/blog">{content.links.blog}</Link>
          <Link to="/github">{content.links.github}</Link>
          <Link to="/linkedIn">{content.links.linkedIn}</Link>
          <Link to="/instagram">{content.links.instagram}</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div>{content.footerText}</div>
        <Link to="/">{content.privacyPolicy}</Link>
        <div>
          {w}/{content.footerDynamicText}
        </div>
      </div>
    </footer>
  );
}
export default Footer;
