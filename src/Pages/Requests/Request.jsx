import "./Request.scss";
import "./Request-mobile.scss";
import content from "./requestContent.json";
function Request() {
  const data = content.Request;

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
            <button>{data.buttonText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Request;
