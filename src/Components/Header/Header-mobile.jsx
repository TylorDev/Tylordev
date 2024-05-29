import { NavLink } from "react-router-dom";
import "./headerMobile.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";

import FetchDataComponent from "./../FetchDataComponent/FetchDataComponent";

function HeaderMobile() {
  const content = FetchDataComponent("Header");

  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const [close, setClose] = useState(true);
  const handleClick = () => {
    setIsActive(!isActive);
    setClose(!close);

    if (!close) {
      console.log("Checkbox marcado");
    } else {
      navigate(-1);
    }
  };
  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();

  if (!content) {
    return <header>Loading...</header>;
  }

  return (
    <header>
      <nav className="navbar">
        <div className="mobile-nav-2">
          <input
            className="menu-btn"
            type="checkbox"
            checked={close}
            onChange={handleClick}
          />
          <div className="bars" id="lineas">
            <div className="barras">
              <span className="barra barra-1" id="barra1"></span>
              <span className="barra barra-2" id="barra2"></span>
            </div>
          </div>
        </div>
        <ul className="Header mob">
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
          <li>
            <NavLink to={`/${language}/`} className="logo">
              <img src={content.logoSrc} alt={content.logoAlt} />
            </NavLink>
          </li>
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
        </ul>
      </nav>
    </header>
  );
}
export default HeaderMobile;
