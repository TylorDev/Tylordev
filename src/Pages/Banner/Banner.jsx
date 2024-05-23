import { useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import content from "./bannerContent.json"; // Asegúrate de tener el archivo JSON en la misma carpeta o actualizar la ruta según corresponda
import "./Banner.scss";
import "./Banner-mobile.scss";
import { useNavigate } from "react-router-dom";

function Banner() {
  const data = content.Banner;
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClick = () => {
    navigate("contact");
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 2) % data.services.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 2 + data.services.length) % data.services.length
    );
  };

  const displayedServices = data.services
    .slice(currentIndex, currentIndex + 2)
    .concat(
      data.services.slice(
        0,
        Math.max(0, currentIndex + 2 - data.services.length)
      )
    );

  return (
    <div className="Banner">
      <div
        className="b-image"
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7287289915966386) 0%), url(${data.banner})`,
          backgroundSize: "cover",
        }}
      >
        <div className="i-content">
          <div className="c-logo">
            <img src={data.logoSrc} alt="Logo" />
          </div>
          <p>{data.description}</p>
          <button onClick={handleClick}>{data.buttonText}</button>
        </div>
      </div>

      <div className="b-buttons">
        <span>{data.eventsTitle}</span>
        <div>
          <button className="bb-prev" onClick={handlePrev}>
            <GoArrowLeft />
          </button>
          <button className="bb-next" onClick={handleNext}>
            <GoArrowRight />
          </button>
        </div>
      </div>

      <div className="b-events">
        {displayedServices.map((service, index) => (
          <div key={index} className="e-event">
            <div className="ee-1">
              <div>{service.date}/</div>
              <button onClick={handleClick}>{service.buttonText}</button>
            </div>
            <div className="ee-2">
              <p>{service.title}</p>
              <div className="eee-h">
                <span>{service.time}</span> /{service.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Banner;
