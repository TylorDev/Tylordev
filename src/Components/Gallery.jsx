import { useEffect, useState, useRef, useCallback } from "react";

import "./Gallery.scss";

// import Row from "./Row";
// import { MousePositionContext } from "../Context/MouseContext";
import LocalObject from "./LocalObject";
const Gallery = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [containerPosition, setContainerPosition] = useState({});

  const [localCoordinates, setLocalCoordinates] = useState({
    x: 0,
    y: 0,
  });

  const handleClick = useCallback(
    (event) => {
      // Obtener las coordenadas x e y del clic
      const x = event.clientX - localCoordinates.x;
      const y = event.clientY - localCoordinates.y;

      // Actualizar el estado con las nuevas coordenadas
      setCoordinates({ x, y });
      setLocalCoordinates({
        x: x - containerPosition.left,
        y: y - containerPosition.top,
      });
    },
    [containerPosition, localCoordinates]
  );

  const handleMouseDown = (event) => {
    handleClick(event);
    setDragging(true);
  };

  useEffect(() => {
    const updateContainerPosition = () => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setContainerPosition({
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateContainerPosition();

    // Re-calculate position on resize or scroll
    window.addEventListener("resize", updateContainerPosition);
    window.addEventListener("scroll", updateContainerPosition);

    return () => {
      window.removeEventListener("resize", updateContainerPosition);
      window.removeEventListener("scroll", updateContainerPosition);
    };
  }, [coordinates]);

  useEffect(() => {
    // Agregar un event listener para clics en el documento
    document.addEventListener("click", handleClick);

    // Remover el event listener cuando el componente se desmonte para evitar memory leaks
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [handleClick]); // El segundo argumento de useEffect indica las dependencias, en este caso, vacío para que solo se ejecute una vez al montar el componente

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (dragging) {
        setPosition({
          x: event.clientX - coordinates.x,
          y: event.clientY - coordinates.y,
        });
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, coordinates]);

  return (
    <div className="wrapper-container">
      <div className="carousel-container">
        <div
          ref={containerRef}
          className="BOX"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,

            position: "absolute",
            userSelect: "none",

            background: "transparent",
          }}
          onMouseDown={handleMouseDown}
        >
          <div className="container">
            <p>
              ({coordinates.x}, {coordinates.y}) ({containerPosition.top},
              {containerPosition.left}) ({localCoordinates.x},
              {localCoordinates.y})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
