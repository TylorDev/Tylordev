import { useEffect, useState, useRef, useCallback, useContext } from "react";

import "./Gallery.scss";

// import Row from "./Row";
// import { MousePositionContext } from "../Context/MouseContext";
import LocalObject from "./LocalObject";
import Grid from "./Grid";
import { MousePositionContext } from "../Context/MouseContext";
const Gallery = () => {
  const { viewportSize, isScrolling, MousePosition } =
    useContext(MousePositionContext);

  const [Porcentaje, setPorcentaje] = useState({
    x: 0,
    y: 0,
  });

  const [puntero, setPuntero] = useState({ x: 0, y: 0 });

  const [dragging, setDragging] = useState(false);

  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [metadata, setMetadata] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
  });
  const [position, setPosition] = useState({
    x: -viewportSize.width,
    y: -viewportSize.height,
  });
  const handleClick = useCallback(
    (event) => {
      // Actualizar las coordenadas absolutas solo si no se está arrastrando
      if (!dragging) {
        const x = event.clientX - metadata.left;
        const y = event.clientY - metadata.top;
        setCoordinates({ x, y });
      }
    },
    [metadata, dragging]
  );

  const handleMouseDown = (event) => {
    handleClick(event);
    setDragging(true);
  };

  const obtenerLado = (metadata, viewportSize) => {
    const { left, top } = metadata;
    const { width, height } = viewportSize;

    let ladoX = left + width > 0 ? "left" : "right";
    let ladoY = top + height > 0 ? "top" : "bottom";

    return { x: ladoX, y: ladoY };
  };

  useEffect(() => {
    const updateContainerPosition = () => {
      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        setMetadata({
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
  }, [coordinates, MousePosition]);

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

  useEffect(() => {
    // Coordenadas del lado izquierdo y superior del contenedor
    const containerLeft = position.x;
    const containerTop = position.y;

    // Coordenadas del lado derecho e inferior del contenedor
    const containerRight = position.x + metadata.width / 3;
    const containerBottom = position.y + metadata.height / 3;

    // Calcula el ancho y alto del contenedor visible
    const visibleWidth =
      Math.min(containerRight, viewportSize.width) +
      Math.max(containerLeft, metadata.width);
    const visibleHeight =
      Math.min(containerBottom, viewportSize.height) +
      Math.max(containerTop, metadata.height);

    // Calcula el porcentaje de ancho y alto del contenedor visible
    const visiblePercentageX = (visibleWidth / metadata.width) * 100;
    const visiblePercentageY = (visibleHeight / metadata.height) * 100;

    // console.log(
    //   "Porcentaje X visible:",
    //   visiblePercentageX,
    //   "Porcentaje Y visible:",
    //   visiblePercentageY
    // );

    setPorcentaje({ x: visiblePercentageX, y: visiblePercentageY });

    setPuntero(obtenerLado(metadata, viewportSize));
    // Aquí puedes hacer lo que necesites con el porcentaje visible
  }, [metadata, viewportSize, position]);

  return (
    <div
      ref={containerRef}
      className="BOX"
      style={{
        // left: `${Math.max(
        //   0,
        //   Math.min(position.x, viewportSize.width - metadata.width)
        // )}px`,
        left: `${
          Porcentaje.x > 115
            ? position.x - viewportSize.width
            : Porcentaje.x < 85
            ? position.x + viewportSize.width
            : position.x
        }px`,

        top: `${
          Porcentaje.y > 110
            ? position.y - viewportSize.height
            : Porcentaje.y < 85
            ? position.y + viewportSize.height
            : position.y
        }px`,

        position: "absolute",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="container">
        <p>Cordenanas globales del click:</p>
        (X: {coordinates.x}, Y: {coordinates.y})<p></p>
        <p>Posicion del conteiner:</p>
        (X: {metadata.left} Y: {metadata.top} )<p>Dimenciones del conteiner:</p>
        <p> Alto: {metadata.height}px</p>
        <p> Ancho: {metadata.width}px</p>
        <p>Dimenciones del viewport:</p>
        <p> Alto: {viewportSize.height}px</p>
        <p> Ancho: {viewportSize.width}px</p>
        <p>Puntero</p>
        {/* <span>
          (X:{" "}
          {metadata.left + viewportSize.width > 0
            ? " cargar lado left"
            : " cargar lado  right"}{" "}
          Y:{" "}
          {metadata.top + viewportSize.height > 0
            ? " cargar lado  top"
            : "  cargar  lado bottom"}{" "}
          )
        </span> */}
        <p>
          {puntero.x} {puntero.y}
        </p>
        <p>Visible :</p>
        (x: {Porcentaje.x} %, y: {Porcentaje.y} %)<p></p>
      </div>
      {Array.from({ length: 9 }, (_, index) => (
        // <div
        //   key={index}
        //   style={{
        //     height: "100vh",
        //     width: "100vw",
        //     outline: "2px solid red",
        //     backgroundImage:
        //       "url(https://i.pinimg.com/736x/1a/df/11/1adf119713b3a10e1389c185fd983139.jpg)",
        //     backgroundSize: "contain",
        //   }}
        //   src={""}
        //   alt=""
        // ></div>

        <div key={index} className="Example">
          {Array.from({ length: 15 }, (_, index) => (
            <LocalObject key={index} isDragging={dragging}>
              <div className="image-ex">
                <img
                  src={`https://via.placeholder.com/150?text=Image${index + 1}`}
                  alt=""
                />
              </div>
            </LocalObject>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Gallery;
