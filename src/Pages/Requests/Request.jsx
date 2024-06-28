import "./Request.scss";
import "./Request-mobile.scss";

import { Button } from "./../../Components/Button/Button";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";
import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { Void } from "./../../Components/Void/Void";
function Request() {
  const content = FetchDataComponent("requestContent");
  const data = content?.Request ?? [];

  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();

  const handleClick = () => {
    navigate(`/${language}/contact`);
  };

  if (!content) {
    return (
      <div className="Request">
        <div className="req-video">
          <div className="req-metadata">
            <div className="req-m-tittle">
              <Void type={"parraf"} range="8-10" lines={3} margin={0.2} />
            </div>
            <div className="req-m-meta">
              <div className="req-m-m-tittle">
                <Void type={"div"} />
              </div>

              <Void type={"parraf"} margin={0.1} />

              <Void
                id="Button"
                type={"button"}
                char={2}
                marginX={1}
                radius={5}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
