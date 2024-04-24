/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from "react";
import "./Gallery.scss";
import { DragContext } from "../Context/DragContext";

import { DragComponent } from "./DragComponent";
import { MousePositionContext } from "../Context/MouseContext";

function Gallery() {
  const {
    dragBoxAreaRef,
    position,
    handleMouseDown,
    dragging,
    direction,
    distance,
    trasladar,
  } = useContext(DragContext);
  const { viewportSize } = useContext(MousePositionContext);

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
  const { direction, distance } = useContext(DragContext);

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
