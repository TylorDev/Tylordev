/* eslint-disable react/prop-types */

import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Main from "./Layouts/Main/Main";
import Home from "./Pages/Home/Home";
import HeaderMobile from "./Components/Header/Header-mobile";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/header" element={<HeaderMobile />} />
        <Route path="/" element={<Main />}>
          <Route path="/" element={<Home />} />

          <Route
            path="/research"
            element={<div className="placeholder">research</div>}
          />
          <Route
            path="/blog"
            element={<div className="placeholder">blog</div>}
          />
          <Route
            path="/about"
            element={<div className="placeholder">about</div>}
          />
          <Route
            path="/projects"
            element={<div className="placeholder">projects</div>}
          />
          <Route
            path="/extra"
            element={<div className="placeholder">extra</div>}
          />
          <Route
            path="/profile"
            element={<div className="placeholder">profile</div>}
          />
          <Route
            path="/contact"
            element={<div className="placeholder">profile</div>}
          />

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
