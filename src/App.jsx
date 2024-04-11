import "./App.scss";
import LocalObject from "./Components/LocalObject";

import { MousePositionProvider } from "./Context/MouseContext";
import Gallery from "./Components/Gallery";
import { useRef, useState, useEffect } from "react";

function App() {
  const images = [
    "https://i.pinimg.com/originals/41/83/54/4183547526a27e7afa355138a496ab6d.jpg",
    "https://i.pinimg.com/564x/ae/c2/81/aec2810c31ad926ed58e98409ce5b457.jpg",
    "https://i.pinimg.com/564x/53/6f/a1/536fa18ecac47dcc0aa94b3f5c8927c8.jpg",
    "https://i.pinimg.com/564x/6a/9d/55/6a9d55d309e076079f2e928b7499c3b1.jpg",
  ];

  return (
    <>
      <MousePositionProvider>
        <div className="App">
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
        </div>
      </MousePositionProvider>
    </>
  );
}

export default App;
function CustomCarousel(props) {
  const slider = useRef(null);
  let isDown = useRef(false);
  let startX = useRef(null);
  let scrollLeft = useRef(null);

  useEffect(() => {
    if (slider && slider.current) {
      let sliderRef = slider.current;
      sliderRef.addEventListener("mousedown", one);
      sliderRef.addEventListener("mousedown", two);
      sliderRef.addEventListener("mouseleave", three);
      sliderRef.addEventListener("mouseup", four);
      sliderRef.addEventListener("mousemove", five);

      return () => {
        sliderRef.removeEventListener("mousedown", one);
        sliderRef.removeEventListener("mousedown", two);
        sliderRef.removeEventListener("mouseleave", three);
        sliderRef.removeEventListener("mouseup", four);
        sliderRef.removeEventListener("mousemove", five);
      };
    }
  }, []);

  function one(e) {
    isDown.current = true;
    startX.current = e.pageX - slider.current.offsetLeft;
    scrollLeft.current = slider.current.scrollLeft;
  }

  function two(e) {
    isDown.current = true;
    startX.current = e.pageX - slider.current.offsetLeft;
    scrollLeft.current = slider.current.scrollLeft;
  }

  function three() {
    isDown.current = false;
  }

  function four() {
    isDown.current = false;
  }

  function five(e) {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - slider.current.offsetLeft;
    const walk = x - startX.current;
    slider.current.scrollLeft = scrollLeft.current - walk;
  }

  return (
    <div className="items" ref={slider}>
      {props.children}
    </div>
  );
}

function Box({ index }) {
  return <div className="box">Box {index}</div>;
}
