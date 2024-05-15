import "./About.scss";
import { GoArrowDownLeft, GoArrowLeft, GoArrowRight } from "react-icons/go";
function About() {
  return (
    <div className="About">
      <div className="blog-cont">
        <div className="header-cont">
          <span>01/ </span>Latest Post
        </div>
        <div className="blog">
          <div className="tittle-blog">BLOG</div>
          <div className="entries">
            <div className="entry">
              <div>10.09.24</div>
              <div>
                led do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris led do eiusmod tempor incididunt{" "}
              </div>
            </div>
            <div className="entry">
              <div>10.05.24</div>
              <div>
                led do eiusmod tempor incididunt ut labore et dolore magna
                aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                ullamco laboris led do eiusmod tempor incididunt
              </div>
            </div>
          </div>

          <div className="corner-blog">
            <div className="arrow">
              <GoArrowDownLeft />
            </div>
          </div>
        </div>
      </div>
      <div className="profile-cont">
        <div className="header-cont">
          <span>02/</span> CV
        </div>
        <div className="profile">
          <div className="sec-1">
            <div className="profile-pic">
              <img
                src="https://i.pinimg.com/564x/a8/95/56/a895566ee13c417bc519b967acf42535.jpg"
                alt="profilepic"
              />
            </div>

            <div>
              <div>Anon Unknow Name.</div>
              <div>[Front/Back]</div>
              <div>@TylorDev</div>

              <button>
                <GoArrowLeft />
              </button>
              <button>
                <GoArrowRight />
              </button>
            </div>
          </div>

          <div>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
              aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
              eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam
              est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci
              velit, sed quia non numquam eius modi tempora.
            </p>
          </div>
        </div>
      </div>
      <div className="history">
        <div className="imagen">
          <img
            src="https://i.pinimg.com/736x/2a/8a/0c/2a8a0c07fb67c557f9206c11904e71eb.jpg"
            alt="XD"
          />
        </div>

        <div className="latest">
          <div className="item">
            <div className="header-cont">
              <span>03/</span> Latest Projects
            </div>
            <div className="header-tit">Vault</div>
          </div>
          <div className="item">
            <div>Protocol/</div>
            <div className="item-tittle">Metta</div>
          </div>
          <div className="item">
            <div>Network/</div>
            <div className="item-tittle">Hexagon</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default About;
