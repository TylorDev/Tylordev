/* eslint-disable react/prop-types */
import "./Hero.scss";
import "./Hero-mobile.scss";
import { GoArrowDownLeft } from "react-icons/go";

import { useNavigate } from "react-router-dom";

import { Button } from "./../../Components/Button/Button";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";

import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { Void } from "./../../Components/Void/Void";

function Hero() {
  const PageName = "Hero";
  const data = FetchDataComponent(PageName);

  if (!data) {
    return (
      <div className="Hero">
        <div className="hero-top">
          <p className="hero-subtitle">
            <Void type="parraf" margin={0.2} lines={3} range="20-30" />
          </p>
          <div className="hero-title">
            <Void type="div" char={21} />
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-video">
            <div className="corner">
              <div className="arrow">
                <GoArrowDownLeft />
              </div>
            </div>

            <div className="video">
              <Void />
            </div>
          </div>

          <div className="hero-post">
            <div>
              <span>
                {" "}
                <Void type="span" />
              </span>{" "}
              <Void type="div" />
            </div>
            <div>
              <p>
                <Void type="parraf" margin={0.2} lines={10} range="20-20" />
              </p>

              <Void type="div" char={10} radius={1} />
            </div>

            <div className="corner"></div>
          </div>
        </div>
      </div>
    );
  }

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
        className="video"
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
