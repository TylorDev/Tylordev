/* eslint-disable react/prop-types */

import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Main from "./Layouts/Main/Main";
import Home from "./Layouts/Home/Home";
import HeaderMobile from "./Components/Header/Header-mobile";
import About from "./Pages/About/About";
import Projects from "./Pages/Projects/Projects";
import Research from "./Pages/Research/Research";
import Article from "./Pages/Article/Article";
import Banner from "./Pages/Banner/Banner";
import Project from "./Pages/Project/Project";
import ContactForm from "./Pages/Contact/ContactForm";
import Resources from "./Layouts/Resources/Resources.jsx";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/header" element={<HeaderMobile />} />
        <Route path="/" element={<Main />}>
          <Route path="/" element={<Home />} />

          <Route path="/research" element={<Research />} />
          <Route path="/research/:id" element={<Article />} />

          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectName" element={<Project />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/services" element={<Banner />} />
          <Route
            path="/profile"
            element={<div className="placeholder">profile</div>}
          />
          <Route path="/resources" element={<Resources />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

function NotFound() {
  return <div className="Not">ERROR 404</div>;
}
