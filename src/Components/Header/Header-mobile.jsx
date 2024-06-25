import { NavLink } from "react-router-dom";
import "./headerMobile.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";

import FetchDataComponent from "./../FetchDataComponent/FetchDataComponent";
import LanguageSelector from "./../LanguageSelector/LanguageSelector";

function HeaderMobile() {
  const content = FetchDataComponent("Header");

  const handleName = (name) => {
    document.title = name;
  };

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
  const { language } = useLanguage();

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
          <li id="lenguage">
            <LanguageSelector />
          </li>
          <li>
            <NavLink
              to={`/Tylordev/${language}/about`}
              onClick={() => {
                handleName(content.navItems.about);
              }}
            >
              {content.navItems.about}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/Tylordev/${language}/projects`}
              onClick={() => {
                handleName(content.navItems.projects);
              }}
            >
              {content.navItems.projects}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/Tylordev/${language}/services`}
              onClick={() => {
                handleName(content.navItems.services);
              }}
            >
              {content.navItems.services}
            </NavLink>
          </li>

          <li>
            <NavLink
              to={`/Tylordev/${language}`}
              className="logo"
              onClick={() => {
                handleName("TylorDev/");
              }}
            >
              <img src={content.logoSrc} alt={content.logoAlt} />
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/Tylordev/${language}/research`}
              onClick={() => {
                handleName(content.navItems.research);
              }}
            >
              {content.navItems.research}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/Tylordev/${language}/resources`}
              onClick={() => {
                handleName(content.navItems.resources);
              }}
            >
              {content.navItems.resources}
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/Tylordev/${language}/contact`}
              onClick={() => {
                handleName(content.navItems.contact);
              }}
            >
              {content.navItems.contact}
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default HeaderMobile;
