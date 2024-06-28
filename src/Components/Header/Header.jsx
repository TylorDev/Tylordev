import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";

import FetchDataComponent from "./../FetchDataComponent/FetchDataComponent";
import LanguageSelector from "./../LanguageSelector/LanguageSelector";
import { Void } from "./../Void/Void";

function Header() {
  const content = FetchDataComponent("Header");

  const [close, setClose] = useState(false);
  const navigate = useNavigate();

  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();

  const handleName = (name) => {
    document.title = name;
  };

  const handleClick = () => {
    setClose(!close);

    if (!close) {
      console.log("Checkbox marcado");
      navigate(`/${language}/header`);
    }
  };

  if (!content) {
    return (
      <header>
        <nav className="navbar">
          <div className="mobile-nav">
            <Void type="parraf" range="10-1" margin={0} lines={2} />

            <div className="bars" id="lineas">
              <div>
                <Void type="div" char={8} />
              </div>
              <div className="barras">
                <span className="barra barra-1" id="barra1"></span>
                <span className="barra barra-2" id="barra2"></span>
              </div>
            </div>
          </div>
          <ul className="Header">
            <div>
              <li>
                <Void type="div" marginX={0.2} />
              </li>
              <li>
                <Void type="div" marginX={0.2} />
              </li>
              <li>
                <Void type="div" marginX={0.2} />
              </li>
            </div>
            <li>
              <a className="logo">
                <Void
                  type="img"
                  src={
                    "https://gclabels.net/image/cache/data/new/inv/new/Blank-White-Square-Labels-s1w-600x600.png"
                  }
                />
              </a>
            </li>
            <div>
              <li>
                <Void type="div" />
              </li>
              <li>
                <Void type="div" />
              </li>
              <li>
                <Void type="div" />
              </li>
            </div>
          </ul>
        </nav>
      </header>
    );
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
              <NavLink
                to={`/${language}/about`}
                onClick={() => {
                  handleName(content.navItems.about);
                }}
              >
                {content.navItems.about}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${language}/projects`}
                onClick={() => {
                  handleName(content.navItems.projects);
                }}
              >
                {content.navItems.projects}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${language}/services`}
                onClick={() => {
                  handleName(content.navItems.services);
                }}
              >
                {content.navItems.services}
              </NavLink>
            </li>
            <li>
              <LanguageSelector />
            </li>
          </div>
          <li id="liLogo">
            <NavLink
              to={`/`}
              className="logo"
              onClick={() => {
                handleName("/");
              }}
            >
              <img src={content.logoSrc} alt={content.logoAlt} />
            </NavLink>
          </li>
          <div>
            <li>
              <NavLink
                to={`/${language}/research`}
                onClick={() => {
                  handleName(content.navItems.research);
                }}
              >
                {content.navItems.research}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${language}/resources`}
                onClick={() => {
                  handleName(content.navItems.resources);
                }}
              >
                {content.navItems.resources}
              </NavLink>
            </li>
            <li>
              <NavLink
                to={`/${language}/contact`}
                onClick={() => {
                  handleName(content.navItems.contact);
                }}
              >
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
