/* eslint-disable react/prop-types */
import "./App.scss";
import LocalObject from "./Components/LocalObject";

import { MousePositionProvider } from "./Context/MouseContext";
import Gallery from "./Components/Gallery";
import { useRef, useState, useEffect } from "react";
import MouseController from "./Components/MouseController";

function App() {
  return (
    <>
      <MousePositionProvider>
        <MouseController>
          <Gallery></Gallery>
        </MouseController>
      </MousePositionProvider>
    </>
  );
}

export default App;
