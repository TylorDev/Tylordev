import "./Main.scss";
import { Outlet } from "react-router-dom";
import Header from "./../../Components/Header/Header";
import Footer from "./../../Components/Footer/Footer";
import LanguageSelector from "./../../Components/LanguageSelector/LanguageSelector";

function Main() {
  return (
    <div className="Main">
      <Header />
      <LanguageSelector />
      <Outlet />
      <Footer />
    </div>
  );
}
export default Main;
