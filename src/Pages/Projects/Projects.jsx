import "./Projects.scss";
import "./Projects-mobile.scss";
import content from "./projectsContent.json";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";
function Projects({ limit }) {
  const datos = content.Projects;
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();
  console.log(lang);
  if (lang !== language) {
    setLanguage(lang);
  }

  console.log(language);

  const handleClick = (projectName) => {
    const formattedProjectName = projectName.toLowerCase().replace(/\s+/g, "-");
    navigate(`/${language}/projects/${formattedProjectName}`);
  };

  const [filenames, setFilenames] = useState([]);

  const enUsFiles = import.meta.glob("/src/API/en-us/Projects/*.json");
  const esMxFiles = import.meta.glob("/src/API/es-mx/Projects/*.json");
  const ptBrFiles = import.meta.glob("/src/API/pt-br/Projects/*.json");
  const defaultFiles = import.meta.glob("/src/API/Projects/*.json");

  useEffect(() => {
    async function fetchData() {
      let jsonFiles;
      if (language === "en-us") {
        jsonFiles = enUsFiles;
      } else if (language === "es-mx") {
        jsonFiles = esMxFiles;
      } else if (language === "pt-br") {
        jsonFiles = ptBrFiles;
      } else {
        jsonFiles = defaultFiles;
      }

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
  }, [language]);

  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          filenames.map((filename) =>
            fetch(
              `https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/${language}/Projects/${filename}`
            )
          )
        );

        const data = await Promise.all(
          responses.map((response) => response.json())
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filenames, language]);

  const limitProjects = data ? data.slice(0, limit) : data;

  return (
    <div className="Projects">
      <div className="p-header">
        <span>{datos.header.mainText}</span>
        {datos.header.title}
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
