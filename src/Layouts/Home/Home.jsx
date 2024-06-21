import "./Home.scss";
import Hero from "../../Pages/Hero/Hero";

import Banner from "../../Pages/Banner/Banner";
import Projects from "../../Pages/Projects/Projects";
import Research from "../../Pages/Research/Research";
import About from "./../About/About";

function Home() {
  return (
    <div className="Home">
      <Hero />
      <About />
      <Banner />
      <Projects limit={4} />
      <Research />
    </div>
  );
}
export default Home;
