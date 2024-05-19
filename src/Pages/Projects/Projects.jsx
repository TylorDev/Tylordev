import "./Projects.scss";
import "./Projects-mobile.scss";
import content from "./projectsContent.json";
function Projects() {
  const data = content.Projects;

  return (
    <div className="Projects">
      <div className="p-header">
        <span>{data.header.mainText}</span>
        {data.header.title}
      </div>
      <div className="p-projects">
        {data.projects.map((project, index) => (
          <div key={index} className="p-project">
            <div className="pp-cover">
              <img
                src={project.coverImageSrc}
                alt={`Cover for ${project.title}`}
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
