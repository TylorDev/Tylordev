import "./Home.scss";
import Hero from "./../Hero/Hero";
import About from "../About/About";
import Banner from "../Banner/Banner";
import Projects from "../Projects/Projects";

function Home() {
  return (
    <div className="Home">
      <Hero />
      <About />
      <Banner />
      <Projects />
    </div>
  );
}
export default Home;
