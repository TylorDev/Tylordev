import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import "./NotFound.scss";

export default function NotFound() {
  const { language } = useLanguage();
  return (
    <div className="container notfound">
      <span className="eyebrow">404</span>
      <h1 className="gradient-text">Lost in space.</h1>
      <p>The page you're looking for drifted off the map.</p>
      <Link to={`/${language}`} className="btn btn-primary">Take me home</Link>
    </div>
  );
}
