/* eslint-disable react/prop-types */
import "./Hero.scss";
import "./Hero-mobile.scss";
import { GoArrowDownLeft } from "react-icons/go";
import data from "./Hero.json";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  // useEffect(() => {
  //   fetch(
  //     "https://raw.githubusercontent.com/TylorDev/Tylordev/objectfix/package.json"
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Network response was not ok");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => console.log(data))
  //     .catch((error) =>
  //       console.error(
  //         "There has been a problem with your fetch operation:",
  //         error
  //       )
  //     );
  // }, []);
  return (
    <div className="Hero">
      <div className="hero-top">
        <p className="hero-subtitle">{data.hero.subtitle}</p>
        <div className="hero-title">{data.hero.title} </div>
      </div>

      <div className="hero-content">
        <VideoHero videoSrc={data.hero.videoSrc} />
        {console.log("xd")}
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

  const handleClick = () => {
    navigate("/Projects");
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

  const handleClick = () => {
    navigate("/contact");
  };
  return (
    <div className="hero-post">
      <div>
        <span>{post.title.split("/")[0]}/</span> {post.title.split("/")[1]}
      </div>
      <div>
        <p>{post.content}</p>
        <button onClick={handleClick}>{post.buttonText}</button>
      </div>

      <div className="corner"></div>
    </div>
  );
}
