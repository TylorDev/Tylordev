import { useState, useEffect } from "react";
import { useLanguage } from "../../Context/LanguageContext";

const GetFilenames = ({ fileType }) => {
  const { language } = useLanguage();
  const [filenames, setFilenames] = useState([]);

  const paths = {
    Articles: {
      enUs: import.meta.glob("/src/API/en-us/Articles/*.json"),
      esMx: import.meta.glob("/src/API/es-mx/Articles/*.json"),
      ptBr: import.meta.glob("/src/API/pt-br/Articles/*.json"),
      default: import.meta.glob("/src/API/Articles/*.json"),
    },
    Projects: {
      enUs: import.meta.glob("/src/API/en-us/Projects/*.json"),
      esMx: import.meta.glob("/src/API/es-mx/Projects/*.json"),
      ptBr: import.meta.glob("/src/API/pt-br/Projects/*.json"),
      default: import.meta.glob("/src/API/Projects/*.json"),
    },
  };

  useEffect(() => {
    async function fetchData() {
      let jsonFiles;

      if (fileType === "Articles" || fileType === "Projects") {
        if (language === "en-us") {
          jsonFiles = paths[fileType].enUs;
        } else if (language === "es-mx") {
          jsonFiles = paths[fileType].esMx;
        } else if (language === "pt-br") {
          jsonFiles = paths[fileType].ptBr;
        } else {
          jsonFiles = paths[fileType].default;
        }
      } else {
        jsonFiles = paths.Articles.default; // Valor por defecto si fileType no es válido
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
  }, [language, fileType]);

  return filenames;
};

export default GetFilenames;
