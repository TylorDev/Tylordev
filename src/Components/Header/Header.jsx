import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { useState } from "react";

import { useParams } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";

function Header() {
  const [close, setClose] = useState(false);
  const navigate = useNavigate();

  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();
  console.log(lang);
  if (lang !== language) {
    setLanguage(lang);
  }

  console.log(language);
  const handleClick = () => {
    setClose(!close);

    if (!close) {
      console.log("Checkbox marcado");
      navigate(`/${language}/header`);
    }
  };
  return (
    <header>
      <nav className="navbar">
        <div className="mobile-nav">
          <NavLink to={`/${language}`} className={"logo"}>
            <img src="./logo.svg" alt="XD" />
          </NavLink>

          <input className="menu-btn" type="checkbox" onChange={handleClick} />
          <div className="bars" id="lineas">
            <div>Menu</div>
            <div className="barras">
              <span className="barra barra-1" id="barra1"></span>
              <span className="barra barra-2" id="barra2"></span>
            </div>
          </div>
        </div>
        <ul className={`Header`}>
          <div>
            <li>
              <NavLink to={`/${language}/about`}>About</NavLink>
            </li>
            <li>
              <NavLink to={`/${language}/projects`}>Projects</NavLink>
            </li>
            <li>
              <NavLink to={`/${language}/services`}>Services</NavLink>
            </li>
          </div>

          <li>
            <NavLink to={`/${language}`} className={`logo`}>
              <img src="./logo.svg" alt="XD" />
            </NavLink>
          </li>
          <div>
            <li>
              <NavLink to={`/${language}/research`}>Research</NavLink>
            </li>
            <li>
              <NavLink to={`/${language}/resources`}>Resources</NavLink>
            </li>
            <li>
              <NavLink to={`/${language}/contact`}>Contact</NavLink>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}
export default Header;
