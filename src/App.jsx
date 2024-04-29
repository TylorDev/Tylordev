/* eslint-disable react/prop-types */
import "./App.scss";

import { MousePositionProvider } from "./Context/MouseContext";
import Gallery from "./Components/Gallery";
import { DragProvider } from "./Context/DragContext";

function App() {
  return (
    <>
      <MousePositionProvider>
        <DragProvider>
          <Gallery></Gallery>
        </DragProvider>
      </MousePositionProvider>
    </>
  );
}

export default App;
