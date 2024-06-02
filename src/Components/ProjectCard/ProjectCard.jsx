import "./ProjectCard.scss";

export function ProjectCard({ project, handleClick }) {
  return (
    <div className="p-project">
      <div className="pp-cover">
        <img
          src={project.data.coverImageSrc}
          alt={`Cover for ${project.data.type}`}
          onClick={() => handleClick(project.data.tittle)}
        />
      </div>
      <div className="pp-tittle">
        <span>{project.data.status}</span>
        <span>{project.data.type}</span>
      </div>
      <div className="pp-metadata">
        {project.data.tittle} <span>{project.data.tags}</span>
      </div>
    </div>
  );
}
