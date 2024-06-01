/* eslint-disable react/prop-types */
import "./Projects.scss";
import "./Projects-mobile.scss";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";
import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { Void } from "../../Components/Void/Void";
import GetData from "./../../Components/GetData/GetData";

function Projects({ limit }) {
  const content = FetchDataComponent("projectsContent");

  const datos = content?.Projects ?? [];

  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleClick = (projectName) => {
    const formattedProjectName = projectName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/${language}/projects/${formattedProjectName}`);
  };

  const fileType = "Projects";

  const data = GetData({ fileType });

  const limitProjects = data ? data.slice(0, limit) : data;

  if (!content) {
    return (
      <div className="Projects">
        <div className="p-header">
          <Void type={"span"} text={"Loading. . ."} />
          <Void type={"div"} text={"Loading. . ."} />
        </div>
        <div className="p-projects"></div>
      </div>
    );
  }

  return (
    <div className="Projects">
      <div className="p-header">
        <span>{datos.header.mainText}</span>
        {datos.header.tittle}
      </div>
      <div className="p-projects">
        {limitProjects.map((project, index) => (
          <div key={index} className="p-project">
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
        ))}
      </div>
    </div>
  );
}
export default Projects;
