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
