import { useState, useEffect } from "react";

import "./Banner.scss";
import "./Banner-mobile.scss";
import { useNavigate } from "react-router-dom";
import { Button } from "./../../Components/Button/Button";

import { useLanguage } from "./../../Context/LanguageContext";
import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { Void } from "./../../Components/Void/Void";
import { TittleBar } from "../../Components/TittleBar/TittleBar";

function Banner() {
  const data = FetchDataComponent("Banner");

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
          <div className="b-video">
            <video autoPlay muted loop className="video-bg">
              <source src={data.banner} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="i-content">
              <div className="c-logo">
                <img src={data.logoSrc} alt="Logo" />
              </div>
              <p>{data.description}</p>
              <Button handleClick={handleClick} text={data.buttonText} />
            </div>
          </div>

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

          <TittleBar
            tittle={data.eventsTitle}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />

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
        <div className="Banner">
          <div
            className="b-image"
            style={{
              marginBottom: "1rem",
            }}
          >
            <Void radius={2} />
          </div>

          <div className="b-buttons">
            <Void type={"span"} />
            <div>
              <Void
                id="CButton"
                type={"button"}
                char={2}
                marginX={1}
                radius={5}
              />

              <Void
                id="CButton"
                type={"button"}
                char={2}
                marginX={1}
                radius={5}
              />
            </div>
          </div>

          <div className="b-events">
            <div className="e-event">
              <div className="ee-1">
                <div>
                  <Void type={"span"} char={3} margin={0.1} />{" "}
                  <Void type={"span"} char={3} margin={0.1} />{" "}
                  <Void type={"span"} char={4} margin={0.1} />/
                </div>
                <Void
                  id="Button"
                  type={"button"}
                  char={2}
                  marginX={1}
                  radius={5}
                />
              </div>
              <div className="ee-2">
                <Void type={"parraf"} lines={2} range="10-15" margin={0.2} />

                <div className="eee-h">
                  <Void type={"div"} char={20} />
                </div>
              </div>
            </div>
            <div className="e-event">
              <div className="ee-1">
                <div>
                  <Void type={"span"} char={3} margin={0.1} />{" "}
                  <Void type={"span"} char={3} margin={0.1} />{" "}
                  <Void type={"span"} char={4} margin={0.1} />/
                </div>
                <Void
                  id="Button"
                  type={"button"}
                  char={2}
                  marginX={1}
                  radius={5}
                />
              </div>
              <div className="ee-2">
                <Void type={"parraf"} lines={2} range="10-15" margin={0.2} />

                <div className="eee-h">
                  <Void type={"div"} char={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Banner;
