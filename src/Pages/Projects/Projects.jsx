/* eslint-disable react/prop-types */
import "./Projects.scss";
import "./Projects-mobile.scss";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";
import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { Void } from "../../Components/Void/Void";
import GetData from "./../../Components/GetData/GetData";
import { TittleBar } from "./../../Components/TittleBar/TittleBar";
import { ProjectCard } from "../../Components/ProjectCard/ProjectCard";

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
      <TittleBar tittle={datos.header.tittle} />
      <div className="p-projects">
        {limitProjects.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            handleClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}
export default Projects;
