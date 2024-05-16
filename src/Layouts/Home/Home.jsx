import "./Home.scss";
import Hero from "../../Pages/Hero/Hero";
import About from "../../Pages/About/About";
import Banner from "../../Pages/Banner/Banner";
import Projects from "../../Pages/Projects/Projects";
import Research from "../../Pages/Research/Research";

function Home() {
  return (
    <div className="Home">
      <Hero />
      <About />
      <Banner />
      <Projects />
      <Research />
    </div>
  );
}
export default Home;
