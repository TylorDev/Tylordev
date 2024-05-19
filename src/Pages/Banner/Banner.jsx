import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import content from "./bannerContent.json"; // Asegúrate de tener el archivo JSON en la misma carpeta o actualizar la ruta según corresponda
import "./Banner.scss";
import { useNavigate } from "react-router-dom";

function Banner() {
  const data = content.Banner;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("contact");
  };
  return (
    <div className="Banner">
      <div className="b-image">
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
          <button>
            <GoArrowLeft />
          </button>
          <button>
            <GoArrowRight />
          </button>
        </div>
      </div>

      <div className="b-events">
        {data.services.map((service, index) => (
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
