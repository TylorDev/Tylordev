import "./Hero.scss";
import { GoArrowDownLeft } from "react-icons/go";

function Hero() {
  return (
    <div className="Hero">
      <div className="hero-top">
        <p className="hero-subtitle">
          Hello /here is all of my personal and profesional works projects.
        </p>
        <div className="hero-title">WELCOME TO MY PERSONAL PORTAFOLIO </div>
      </div>

      <div className="hero-content">
        <VideoHero />
        <HeroPost />
      </div>
    </div>
  );
}
export default Hero;

function VideoHero() {
  return (
    <div className="hero-video">
      <div className="corner">
        <GoArrowDownLeft />
      </div>

      <video loop muted autoPlay>
        <source src="/sample3.mp4" type="video/mp4" />
        Tu navegador no soporta la reproducción de videos.
      </video>
    </div>
  );
}
function HeroPost() {
  return (
    <div className="hero-post">
      <div>
        <span>00/</span> About me
      </div>
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commo
        </p>
        <button>Learn more</button>
      </div>

      <div className="corner"></div>
    </div>
  );
}
