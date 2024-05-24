import "./Projects.scss";
import "./Projects-mobile.scss";
import content from "./projectsContent.json";
import { useNavigate } from "react-router-dom";

function Projects({ limit }) {
  const data = content.Projects;
  const navigate = useNavigate();
  const handleClick = (projectName) => {
    const formattedProjectName = projectName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/projects/${formattedProjectName}`);
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
                alt={`Cover for ${project.type}`}
                onClick={() => handleClick(project.tittle)}
              />
            </div>
            <div className="pp-tittle">
              <span>{project.status}</span>
              <span>{project.type}</span>
            </div>
            <div className="pp-metadata">
              {project.tittle} <span>{project.tags}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Projects;
