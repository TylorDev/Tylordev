import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Header.scss";
import { useState } from "react";
function Header() {
  const [close, setClose] = useState(false);
  const navigate = useNavigate();
  const handleClick = () => {
    setClose(!close);

    if (!close) {
      console.log("Checkbox marcado");
      navigate("/header");
    }
  };
  return (
    <header>
      <nav className="navbar">
        <div className="mobile-nav">
          <NavLink to={"/"} className={"logo"}>
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
              <NavLink to={"/about"}>About</NavLink>
            </li>
            <li>
              <NavLink to={"/projects"}>Projects</NavLink>
            </li>
            <li>
              <NavLink to={"/extra"}>Extra</NavLink>
            </li>
          </div>

          <li>
            <NavLink to={"/"} className={"logo"}>
              <img src="./logo.svg" alt="XD" />
            </NavLink>
          </li>
          <div>
            <li>
              <NavLink to={"/research"}>Research</NavLink>
            </li>
            <li>
              <NavLink to={"/blog"}>Blog</NavLink>
            </li>
            <li>
              <NavLink to={"/contact"}>Contact</NavLink>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
}
export default Header;
