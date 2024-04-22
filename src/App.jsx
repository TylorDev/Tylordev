/* eslint-disable react/prop-types */
import "./App.scss";

import { MousePositionProvider } from "./Context/MouseContext";
import Gallery from "./Components/Gallery";

import MouseController from "./Components/MouseController";
import { DragProvider } from "./Components/DragContext";

function App() {
  return (
    <>
      <MousePositionProvider>
        <DragProvider>
          <MouseController>
            <Gallery></Gallery>
          </MouseController>
        </DragProvider>
      </MousePositionProvider>
    </>
  );
}

export default App;
