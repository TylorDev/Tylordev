import { NavLink } from "react-router-dom";
import "./headerMobile.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function HeaderMobile() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const [close, setClose] = useState(true);
  const handleClick = () => {
    setIsActive(!isActive);
    setClose(!close);

    if (!close) {
      console.log("Checkbox marcado");
    } else {
      console.log("Checkbox desmarcado");
      navigate(-1);
    }
  };
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
        <ul className={`Header mob`}>
          <li>
            <NavLink to={"/about"}>About</NavLink>
          </li>
          <li>
            <NavLink to={"/projects"}>Projects</NavLink>
          </li>
          <li>
            <NavLink to={"/extra"}>Extra</NavLink>
          </li>
          <li>
            <NavLink to={"/"} className={"logo"}>
              <img src="./logo.svg" alt="XD" />
            </NavLink>
          </li>
          <li>
            <NavLink to={"/research"}>Research</NavLink>
          </li>
          <li>
            <NavLink to={"/blog"}>Blog</NavLink>
          </li>
          <li>
            <NavLink to={"/contact"}>Contact</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default HeaderMobile;
