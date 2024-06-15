/* eslint-disable react/prop-types */

import { Navigate, Route, Routes, useParams } from "react-router-dom";
import "./App.scss";
import Main from "./Layouts/Main/Main";
import Home from "./Layouts/Home/Home";
import HeaderMobile from "./Components/Header/Header-mobile";
import axios from "axios";
import Projects from "./Pages/Projects/Projects";
import Research from "./Pages/Research/Research";
import Article from "./Pages/Article/Article";
import Banner from "./Pages/Banner/Banner";
import Project from "./Pages/Project/Project";
import ContactForm from "./Pages/Contact/ContactForm";
import Resources from "./Layouts/Resources/Resources.jsx";
import { LanguageProvider } from "./Context/LanguageContext.jsx";
import About from "./Layouts/About/About";
import { useState } from "react";

const validLanguages = ["en-us", "es-mx", "pt-br"];

function LanguageWrapper({ children }) {
  const { lang } = useParams();
  if (!validLanguages.includes(lang)) {
    return <Navigate to="/404" />;
  }
  return children;
}
function App() {
  return (
    <LanguageProvider>
      <div className="App">
        <SendButton />
        <ImageUploadForm />
      </div>
    </LanguageProvider>
  );
}

export default App;

function NotFound() {
  return <div className="Not">ERROR 404</div>;
}

const SendButton = () => {
  const handleClick = () => {
    axios
      .get("http://localhost:3000/send")
      .then((response) => {
        console.log("Solicitud enviada al servidor:", response.data);
        // Aquí puedes manejar la respuesta del servidor si es necesario
      })
      .catch((error) => {
        if (error.response && error.response.status === 500) {
          console.error("No hay nada que actualizar.");
        } else {
          console.error("Error al enviar solicitud al servidor:", error);
          // Aquí puedes manejar otros errores de la solicitud si es necesario
        }
      });
  };

  return <button onClick={handleClick}>Enviar Solicitud al Servidor</button>;
};
const ImageUploadForm = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("image", file);

      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        },
      };

      const response = await axios.post(
        "http://localhost:3000/upload",
        formData,
        config
      );

      console.log("File uploaded successfully:", response.data);
      console.log(
        `https://raw.githubusercontent.com/TylorDev/Tylordev/public/Assets/Images/${file.name}`
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      // Aquí puedes manejar errores de carga de la imagen
    }
  };

  return (
    <div>
      <h2>Subir Imagen</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Subir</button>
      </form>
      {uploadProgress > 0 && <p>Progreso de carga: {uploadProgress}%</p>}
    </div>
  );
};
