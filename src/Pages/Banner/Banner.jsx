import { useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import content from "./Banner.json"; // Asegúrate de tener el archivo JSON en la misma carpeta o actualizar la ruta según corresponda
import "./Banner.scss";
import "./Banner-mobile.scss";
import { useNavigate } from "react-router-dom";
import { Button } from "./../../Components/Button/Button";
import { CButton } from "./../../Components/Button/CButton";
import { useParams } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";
function Banner() {
  const data = content.Banner;
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();

  const handleClick = () => {
    navigate(`/${language}/contact`);
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

          <Button handleClick={handleClick} text={data.buttonText} />
        </div>
      </div>

      <div className="b-buttons">
        <span>{data.eventsTitle}</span>
        <div>
          <CButton onClick={handlePrev} left={true} />

          <CButton onClick={handleNext} />
        </div>
      </div>

      <div className="b-events">
        {displayedServices.map((service, index) => (
          <div key={index} className="e-event">
            <div className="ee-1">
              <div>{service.date}/</div>
              <Button handleClick={handleClick} text={service.buttonText} />
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
