import "./Request.scss";
import "./Request-mobile.scss";
function Request() {
  return (
    <div className="Request">
      <div className="req-video">
        <video loop muted autoPlay>
          <source
            src="https://cdn.pixabay.com/video/2021/04/15/71122-537102350_large.mp4"
            type="video/mp4"
          />
          Tu navegador no soporta la reproducción de videos.
        </video>
        <div className="req-metadata">
          <div className="req-m-tittle">Lorem ipsum dolor sit amet.</div>
          <div className="req-m-meta">
            <div className="req-m-m-tittle">/ipsum dolor</div>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatum, unde vitae! Sunt enim saepe molestias deleniti,
              quaerat dignissimos ea perspiciatis
            </p>
            <button>Leave a Request</button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Request;
