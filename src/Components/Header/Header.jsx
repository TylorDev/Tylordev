import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { useState } from "react";

import { useParams } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";
import content from "./Header.json";
import FetchDataComponent from "./../FetchDataComponent/FetchDataComponent";

function Header() {
  const content = FetchDataComponent("Header");

  const [close, setClose] = useState(false);
  const navigate = useNavigate();

  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();

  const handleClick = () => {
    setClose(!close);

    if (!close) {
      console.log("Checkbox marcado");
      navigate(`/${language}/header`);
    }
  };

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <header>
      <nav className="navbar">
        <div className="mobile-nav">
          <NavLink to={`/${language}`} className="logo">
            <img src={content.logoSrc} alt={content.logoAlt} />
          </NavLink>

          <input className="menu-btn" type="checkbox" onChange={handleClick} />
          <div className="bars" id="lineas">
            <div>{content.menuLabel}</div>
            <div className="barras">
              <span className="barra barra-1" id="barra1"></span>
              <span className="barra barra-2" id="barra2"></span>
            </div>
          </div>
        </div>
        <ul className="Header">
          <div>
            <li>
              <NavLink to={`/${language}/about`}>
                {content.navItems.about}
              </NavLink>
            </li>
            <li>
              <NavLink to={`/${language}/projects`}>
                {content.navItems.projects}
              </NavLink>
            </li>
            <li>
              <NavLink to={`/${language}/services`}>
                {content.navItems.services}
              </NavLink>
            </li>
          </div>
          <li>
            <NavLink to={`/${language}`} className="logo">
              <img src={content.logoSrc} alt={content.logoAlt} />
            </NavLink>
          </li>
          <div>
            <li>
              <NavLink to={`/${language}/research`}>
                {content.navItems.research}
              </NavLink>
            </li>
            <li>
              <NavLink to={`/${language}/resources`}>
                {content.navItems.resources}
              </NavLink>
            </li>
            <li>
              <NavLink to={`/${language}/contact`}>
                {content.navItems.contact}
              </NavLink>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}
export default Header;
