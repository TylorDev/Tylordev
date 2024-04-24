/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import "./Gallery.scss";
import { DragContext } from "./DragContext";

import { DragComponent } from "./DragComponent";

function Gallery() {
  const { dragBoxAreaRef, position, handleMouseDown, dragging, direction } =
    useContext(DragContext);

  return (
    <div className="Gallery">
      <DragComponent
        AreaRef={dragBoxAreaRef}
        position={position}
        handleMouseDown={handleMouseDown}
        dragging={dragging}
      />

      <ViewportDistance
        targetRef={dragBoxAreaRef}
        direction={direction}
      ></ViewportDistance>
      <KeyEventsComponent targetRef={dragBoxAreaRef}></KeyEventsComponent>
    </div>
  );
}
export default Gallery;

const ViewportDistance = ({ targetRef }) => {
  const { direction } = useContext(DragContext);

  const [distance, setDistance] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  const calculateDistance = () => {
    // Obtenemos las coordenadas del elemento objetivo
    const { top, left, bottom, right } =
      targetRef.current.getBoundingClientRect();

    // Obtenemos el ancho y alto del viewport
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Calculamos la distancia desde el borde del viewport al elemento
    setDistance({
      top: Math.max(0, top), // La distancia no puede ser menor que 0
      left: Math.max(0, left), // La distancia no puede ser menor que 0
      bottom: Math.max(0, viewportHeight - bottom), // La distancia no puede ser menor que 0
      right: Math.max(0, viewportWidth - right), // La distancia no puede ser menor que 0
    });
  };

  useEffect(() => {
    const handleMouseMove = () => {
      calculateDistance();
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []); // Ejecutar solo una vez al montar el componente

  return (
    <div className="viewport-distance">
      <div>Distance from top: {distance.top}px</div>
      <div>Distance from left: {distance.left}px</div>
      <div>Distance from bottom: {distance.bottom}px</div>
      <div>Distance from right: {distance.right}px</div>
      <div>{direction}</div>
    </div>
  );
};

const KeyEventsComponent = ({ targetRef }) => {
  const { centrar } = useContext(DragContext);
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { width, height } = targetRef.current.getBoundingClientRect();

      switch (event.key) {
        case "q":
          console.log("La tecla Q ha sido presionada");
          break;
        case "w":
          centrar(0, -height / 4);

          console.log(width, height);
          break;

        case "e":
          console.log("La tecla E ha sido presionada");
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return <div style={{ display: "none" }}></div>;
};
