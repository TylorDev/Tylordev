import "./Projects.scss";
import "./Projects-mobile.scss";
import content from "./projectsContent.json";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Projects({ limit }) {
  const data = content.Projects;
  const navigate = useNavigate();
  const handleClick = (projectName) => {
    const formattedProjectName = projectName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/projects/${formattedProjectName}`);
  };

  const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Importar todos los archivos JSON en la carpeta `src/API/Projects`
      const jsonFiles = import.meta.glob("/src/API/Projects/*.json");

      // Array para almacenar los datos de los proyectos
      const projectData = [];

      // Iterar sobre los archivos y obtener sus nombres y contenido
      for (const path in jsonFiles) {
        const module = await jsonFiles[path]();
        projectData.push({
          path,
          data: module.default,
        });
      }

      // Actualizar el estado con los datos de los proyectos
      setJsonData(projectData);
    }

    fetchData();
  }, []);

  const [filenames, setFilenames] = useState([]);

  useEffect(() => {
    async function fetchData() {
      // Importar todos los archivos JSON en la carpeta `src/API/Projects`
      const jsonFiles = import.meta.glob("/src/API/Projects/*.json");

      // Array para almacenar los nombres de los archivos
      const fileNamesArray = [];

      // Iterar sobre los archivos y obtener sus nombres
      for (const path in jsonFiles) {
        // Extraer el nombre del archivo del path
        const fileName = path.split("/").pop();
        fileNamesArray.push(fileName);
      }

      // Actualizar el estado con los nombres de los archivos
      setFilenames(fileNamesArray);
    }

    fetchData();
  }, []);

  const projects = jsonData.map((project) => project.data);

  const limitProjects = projects ? projects.slice(0, limit) : projects;

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
