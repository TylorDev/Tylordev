import "./Banner.scss";
import "./Banner-mobile.scss";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
function Banner() {
  return (
    <div className="Banner">
      <div className="b-image">
        <div className="i-content">
          <div className="c-logo">
            <img src="/logo.svg" alt="" />
          </div>
          <p>
            WE SPONSOR PROFILE CONFERENCES AND HOLD OUR OWN EVENTS. COME TO OUR
            MEETUPS -- WE PROMISE IT WILL BE COOL
          </p>

          <button>Learn More</button>
        </div>
      </div>

      <div className="b-buttons">
        <span>EVENTS</span>
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
        <div className="e-event">
          <div className="ee-1">
            <div>31.09.22/ </div>
            <button>Learn More</button>
          </div>
          <div className="ee-2">
            <p>PRODUCT MANAGEMENT MEETUP</p>
            <div className="eee-h">
              <span>19:00</span> /Online
            </div>
          </div>
        </div>
        <div className="e-event">
          <div className="ee-1">
            <div>31.09.22/ </div>
            <button>Learn More</button>
          </div>
          <div className="ee-2">
            <p>PRODUCT MANAGEMENT MEETUP</p>
            <div className="eee-h">
              <span>19:00</span> /Online
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Banner;
