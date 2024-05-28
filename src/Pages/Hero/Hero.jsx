/* eslint-disable react/prop-types */
import "./Hero.scss";
import "./Hero-mobile.scss";
import { GoArrowDownLeft } from "react-icons/go";
import data from "./Hero.json";

import { useNavigate } from "react-router-dom";

import { Button } from "./../../Components/Button/Button";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";

function Hero() {
  return (
    <div className="Hero">
      <div className="hero-top">
        <p className="hero-subtitle">{data.hero.subtitle}</p>
        <div className="hero-title">{data.hero.title} </div>
      </div>

      <div className="hero-content">
        <VideoHero videoSrc={data.hero.videoSrc} />

        <HeroPost post={data.hero.post} />
      </div>
    </div>
  );
}
export default Hero;

function VideoHero({ videoSrc }) {
  const navigate = useNavigate();
  const handleContextMenu = (event) => {
    event.preventDefault();
  };

  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();
  console.log(lang);
  if (lang !== language) {
    setLanguage(lang);
  }

  console.log(language);

  const handleClick = () => {
    navigate(`/${language}/Projects`);
  };
  return (
    <div className="hero-video">
      <div className="corner" onClick={handleClick}>
        <div className="arrow">
          <GoArrowDownLeft />
        </div>
      </div>

      <video
        onClick={handleClick}
        loop
        muted
        autoPlay
        disablePictureInPicture
        onContextMenu={handleContextMenu}
      >
        <source src={videoSrc} type="video/mp4" />
        Tu navegador no soporta la reproducción de videos.
      </video>
    </div>
  );
}
function HeroPost({ post }) {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();
  console.log(lang);
  if (lang !== language) {
    setLanguage(lang);
  }

  console.log(language);

  const handleClick = () => {
    navigate(`/${language}/contact`);
  };

  return (
    <div className="hero-post">
      <div>
        <span>{post.title.split("/")[0]}/</span> {post.title.split("/")[1]}
      </div>
      <div>
        <p>{post.content}</p>

        <Button handleClick={handleClick} text={post.buttonText} />
      </div>

      <div className="corner"></div>
    </div>
  );
}
