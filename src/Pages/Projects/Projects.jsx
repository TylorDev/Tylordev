import "./Projects.scss";
import "./Projects-mobile.scss";
import content from "./projectsContent.json";
import { useNavigate } from "react-router-dom";

function Projects({ limit }) {
  const data = content.Projects;
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/project");
  };

  const limitProjects = data.projects
    ? data.projects.slice(0, limit)
    : data.projects;

  return (
    <div className="Projects">
      <div className="p-header">
        <span>{data.header.mainText}</span>
        {data.header.title}
      </div>
      <div className="p-projects">
        {limitProjects.map((project, index) => (
          <div key={index} className="p-project">
            <div className="pp-cover">
              <img
                src={project.coverImageSrc}
                alt={`Cover for ${project.title}`}
                onClick={handleClick}
              />
            </div>
            <div className="pp-tittle">
              <span>{project.status}</span>
              <span>{project.title}</span>
            </div>
            <div className="pp-metadata">
              {project.metadata} <span>{project.metadataUnit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Projects;
