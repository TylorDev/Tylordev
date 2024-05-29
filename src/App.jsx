/* eslint-disable react/prop-types */

import { Navigate, Route, Routes, useParams } from "react-router-dom";
import "./App.scss";
import Main from "./Layouts/Main/Main";
import Home from "./Layouts/Home/Home";
import HeaderMobile from "./Components/Header/Header-mobile";

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
        <Routes>
          <Route path="/" element={<Navigate to="/en-us" />} />
          <Route path="/:lang/header" element={<HeaderMobile />} />
          <Route
            path="/:lang"
            element={
              <LanguageWrapper>
                <Main />
              </LanguageWrapper>
            }
          >
            <Route path="/:lang" element={<Home />} />

            <Route path="/:lang/research" element={<Research />} />
            <Route path="/:lang/research/:id" element={<Article />} />
            <Route path="/:lang/about" element={<About />} />
            <Route path="/:lang/projects" element={<Projects />} />
            <Route path="/:lang/projects/:projectName" element={<Project />} />
            <Route path="/:lang/contact" element={<ContactForm />} />
            <Route path="/:lang/services" element={<Banner />} />
            <Route
              path="/:lang/profile"
              element={<div className="placeholder">profile</div>}
            />
            <Route path="/:lang/resources" element={<Resources />} />
          </Route>
          <Route path="*" element={<NotFound />} /> LanguageSelector.js
          <Route path="/404" element={<NotFound />} />
        </Routes>
      </div>
    </LanguageProvider>
  );
}

export default App;

function NotFound() {
  return <div className="Not">ERROR 404</div>;
}
