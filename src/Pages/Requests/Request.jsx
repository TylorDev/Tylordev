import "./Request.scss";
import "./Request-mobile.scss";
import content from "./requestContent.json";
import { Button } from "./../../Components/Button/Button";
import { useNavigate } from "react-router-dom";
function Request() {
  const data = content.Request;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/contact");
  };
  return (
    <div className="Request">
      <div className="req-video">
        <video loop muted autoPlay>
          <source src={data.videoSrc} type="video/mp4" />
          Tu navegador no soporta la reproducción de videos.
        </video>
        <div className="req-metadata">
          <div className="req-m-tittle">{data.title}</div>
          <div className="req-m-meta">
            <div className="req-m-m-tittle">{data.metadata.subtitle}</div>
            <p>{data.metadata.content}</p>

            <Button text={data.buttonText} handleClick={handleClick}></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Request;
