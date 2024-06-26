import "./Main.scss";
import { Outlet } from "react-router-dom";
import Header from "./../../Components/Header/Header";
import Footer from "./../../Components/Footer/Footer";

function Main() {
  return (
    <div className="Main">
      <Header />

      <Outlet />
      <Footer />
    </div>
  );
}
export default Main;
