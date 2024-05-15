import "./Projects.scss";
import "./Projects-mobile.scss";
function Projects() {
  return (
    <div className="Projects">
      <div className="p-header">
        <span>Grants & Funds/</span>PROJECTS
      </div>
      <div className="p-projects">
        <div className="p-project">
          <div className="pp-cover">
            <img
              src="
              https://cdn.dribbble.com/users/6493128/screenshots/16183040/media/fb87371c21ba4afb762d910906cfcd01.jpg"
              alt=""
            />
          </div>
          <div className="pp-tittle">
            {" "}
            <span>Funded/</span>
            <span> BitBasel NFT Art Community</span>
          </div>
          <div className="pp-metadata">
            {" "}
            25, 000, 000 + <span>Users</span>{" "}
          </div>
        </div>
        <div className="p-project">
          <div className="pp-cover">
            <img
              src="
              https://cdn.dribbble.com/users/6493128/screenshots/16183040/media/fb87371c21ba4afb762d910906cfcd01.jpg"
              alt=""
            />
          </div>
          <div className="pp-tittle">
            {" "}
            <span>Funded/</span>
            <span> BitBasel NFT Art Community</span>
          </div>
          <div className="pp-metadata">
            {" "}
            25, 000, 000 + <span>Users</span>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Projects;
