/* eslint-disable react/prop-types */
import "./App.scss";
import LocalObject from "./Components/LocalObject";

import { MousePositionProvider } from "./Context/MouseContext";
import Gallery from "./Components/Gallery";
import { useRef, useState, useEffect } from "react";

function App() {
  return (
    <>
      <MousePositionProvider>
        {/* <div className="App">
          {images.map((image, index) => {
            return (
              <div className="smain" key={index}>
                <LocalObject>
                  <div>
                    <img
                      style={{ width: "300px", height: "300px" }}
                      src={image}
                      alt=""
                    />
                  </div>
                </LocalObject>
                <LocalObject>
                  <div>
                    <img
                      style={{ width: "300px", height: "300px" }}
                      src={image}
                      alt=""
                    />
                  </div>
                </LocalObject>
                <LocalObject>
                  <div>
                    <img
                      style={{ width: "300px", height: "300px" }}
                      src={image}
                      alt=""
                    />
                  </div>
                </LocalObject>
                <LocalObject>
                  <div>
                    <img
                      style={{ width: "300px", height: "300px" }}
                      src={image}
                      alt=""
                    />
                  </div>
                </LocalObject>
                <LocalObject>
                  <div>
                    <img
                      style={{ width: "300px", height: "300px" }}
                      src={image}
                      alt=""
                    />
                  </div>
                </LocalObject>
              </div>
            );
          })}
        </div> */}
        <Gallery></Gallery>
      </MousePositionProvider>
    </>
  );
}

export default App;
