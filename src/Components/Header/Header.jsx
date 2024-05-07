import { NavLink } from "react-router-dom";
import "./Header.scss";
import { useState, useEffect } from "react";

function Header() {
  const [invisible, setInvisible] = useState(true);
  const [isActive, setIsActive] = useState(false);

  const [close, setClose] = useState(false);
  const handleClick = () => {
    setIsActive(!isActive);
    setClose(!close);
    setInvisible(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setInvisible(window.innerWidth < 400);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header>
      <nav className="navbar">
        <div className="mobile-nav">
          <NavLink to={"/"} className={"logo"}>
            <img src="./logo.svg" alt="XD" />
          </NavLink>

          <input
            className="menu-btn"
            type="checkbox"
            checked={close}
            onChange={handleClick}
          />
          <div className="bars" id="lineas">
            <div>Menu</div>
            <div className="barras">
              <span className="barra barra-1" id="barra1"></span>
              <span className="barra barra-2" id="barra2"></span>
            </div>
          </div>
        </div>

        <ul className={`Header   ${isActive ? "animate" : "reverse"}`}>
          <li>
            <NavLink to={"/about"} onClick={handleClick}>
              About
            </NavLink>
          </li>
          <li>
            <NavLink to={"/projects"} onClick={handleClick}>
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to={"/extra"} onClick={handleClick}>
              Extra
            </NavLink>
          </li>
          <li>
            <NavLink to={"/"} className={"logo"} onClick={handleClick}>
              <img src="./logo.svg" alt="XD" />
            </NavLink>
          </li>
          <li>
            <NavLink to={"/research"} onClick={handleClick}>
              Research
            </NavLink>
          </li>
          <li>
            <NavLink to={"/blog"} onClick={handleClick}>
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink to={"/contact"} onClick={handleClick}>
              Contact
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default Header;
