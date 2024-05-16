import "./Research.scss";
import "./Research-mobile.scss";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";

function Research({ tittle = true }) {
  return (
    <div className="Research">
      <div className="b-buttons">
        <span>{tittle ? "RESEARCH" : ""}</span>
        <div>
          <button>
            <GoArrowLeft />
          </button>
          <button>
            <GoArrowRight />
          </button>
        </div>
      </div>

      <div className="r-articles">
        <div className="r-article">
          <div className="rr-cover">
            <img
              src="
              https://cdn.dribbble.com/users/6493128/screenshots/16183040/media/fb87371c21ba4afb762d910906cfcd01.jpg"
              alt=""
            />
          </div>
          <div className="rr-tittle">
            {" "}
            <span className="rr-sub">
              News/ <span>Sep 17, 2024</span>
            </span>
            <span>
              {" "}
              BitBasel NFT Art Community. Lorem ipsum dolor sit amet consectetur
              adipisicing elit.
            </span>
          </div>
        </div>
        <div className="r-article">
          <div className="rr-cover">
            <img
              src="
              https://i.pinimg.com/736x/8a/45/54/8a45546744da6b3e559512f5cb24c57f.jpg"
              alt=""
            />
          </div>
          <div className="rr-tittle">
            {" "}
            <span className="rr-sub">
              News/ <span>Sep 17, 2024</span>
            </span>
            <span>
              {" "}
              BitBasel NFT Art Community. Lorem ipsum dolor sit amet consectetur
              adipisicing elit.
            </span>
          </div>
        </div>
        <div className="r-article">
          <div className="rr-cover">
            <img
              src="
              https://i.pinimg.com/564x/c8/ab/5b/c8ab5b2b7ee3b1d69a5192fb9163a111.jpg"
              alt=""
            />
          </div>
          <div className="rr-tittle">
            {" "}
            <span className="rr-sub">
              News/ <span>Sep 17, 2024</span>
            </span>
            <span>
              {" "}
              BitBasel NFT Art Community. Lorem ipsum dolor sit amet consectetur
              adipisicing elit.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Research;
