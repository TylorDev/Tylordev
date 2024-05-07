import { Link } from "react-router-dom";
import "./Footer.scss";
import { useState, useEffect } from "react";

function Footer() {
  const [w, setW] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setW(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <footer className="Footer">
      <div className="footer-content">
        <div className="footer__logo">
          <img src="./logo.svg" alt="Logo" />
        </div>
        <div className="footer__links">
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/extras">Extras</Link>

          <Link to="/research">Research</Link>

          <Link to="/blog">Publications</Link>

          <Link to="/github">Github</Link>
          <Link to="/linkedIn">LinkedIn</Link>
          <Link to="/instagram">Instagram</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div>TylorDev/ All rights reserved</div>
        <Link to="/">Privacy Policy</Link>
        <div>{w}/</div>
      </div>
    </footer>
  );
}
export default Footer;
