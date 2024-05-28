import "./Home.scss";
import Hero from "../../Pages/Hero/Hero";
import About from "../../Pages/About/About";
import Banner from "../../Pages/Banner/Banner";
import Projects from "../../Pages/Projects/Projects";
import Research from "../../Pages/Research/Research";
import LanguageSelector from "./../../Components/LanguageSelector/LanguageSelector";

function Home() {
  return (
    <div className="Home">
      <LanguageSelector />
      <Hero />
      <About />
      <Banner />
      <Projects limit={4} />
      <Research limit={true} />
    </div>
  );
}
export default Home;
