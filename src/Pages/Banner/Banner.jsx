import { useState, useEffect } from "react";

import "./Banner.scss";
import "./Banner-mobile.scss";
import { useNavigate } from "react-router-dom";
import { Button } from "./../../Components/Button/Button";
import { CButton } from "./../../Components/Button/CButton";

import { useLanguage } from "./../../Context/LanguageContext";

function Banner() {
  // const data = content;
  // const content = FetchDataComponent("Banner");
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/pt-br/Pages/Banner.json"
        );
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { language } = useLanguage();

  const handleClick = () => {
    navigate(`/${language}/contact`);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      if (data && data.services) {
        return (prevIndex + 2) % data.services.length;
      } else {
        return prevIndex;
      }
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      if (data && data.services) {
        return (prevIndex - 2 + data.services.length) % data.services.length;
      } else {
        return prevIndex;
      }
    });
  };

  const displayedServices = data
    ? data.services
        .slice(currentIndex, currentIndex + 2)
        .concat(
          data.services.slice(
            0,
            Math.max(0, currentIndex + 2 - (data.services.length || 0))
          )
        )
    : [];

  return (
    <div className="div">
      {/* Verifica si data es null o undefined */}
      {data != null ? (
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
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default Banner;
