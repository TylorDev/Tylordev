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
        console.log(response.data);
        alert("Solicitud enviada correctamente");
      })
      .catch((error) => {
        console.error("Error al enviar la solicitud:", error);
        alert("Error al enviar la solicitud");
      });
  };

  return <button onClick={handleClick}>Enviar solicitud</button>;
};
