/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, useCallback, useContext } from "react";
import "./Gallery.scss";
import LocalObject from "./LocalObject";
import { MousePositionContext } from "../Context/MouseContext";

const Gallery = () => {
  //Tamaño del viewport y Posicion en vivo de Mouse, Dependencias: [???]
  const { viewportSize, MousePosition } = useContext(MousePositionContext);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  //Porcentaje visible del Box en el viewport, Todavia no lo comprendo al 100%, es necesario rehacerlo. Dependencias: [???]
  const [visibilidad, setVisibilidad] = useState({
    x: "100",
    y: "100",
  });

  //Direccion a la cual ocultar, Dependencias: [???]
  const [puntero, setPuntero] = useState({ x: "centro", y: "centro" });

  //Controla el evento dragging, Dependencias: [???]
  const [dragging, setDragging] = useState(false);

  //Posision del ultimo click del mouse, Dependencias: [???]
  const [lastClick, setLastclick] = useState({ x: 0, y: 0 });

  //Referencia al box que contiene todo lo que sea arrastrable, Dependencias: [???]
  const dragBoxAreaRef = useRef(null);

  //Todos los datos sobre el Box, tamaño y posision, Dependencias: [???]
  const [metadata, setMetadata] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
  });

  //Posision inicial del Box, Se ocupa para posisionar el box en el viewport, Dependencias: [???]
  const [position, setPosition] = useState({
    x: -metadata.width / 2,
    y: -metadata.height / 2,
  });

  //Obtiene la posision del ultimo click. en la pantalla.
  const handleClick = useCallback(() => {
    if (!dragging) {
      const x = MousePosition.x - metadata.left;
      const y = MousePosition.y - metadata.top;
      setLastclick({ x, y });
    }
  }, [metadata, dragging, MousePosition]);

  const handleCenter = () => {
    setCenter({ x: 0, y: 0 });
  };
  const handleMouseDown = () => {
    handleClick();
    setDragging(true);
  };

  const handlePuntero = (conteinersize, viewportSize) => {
    const { left, top } = conteinersize;
    const { width, height } = viewportSize;
    const center = { x: width / 2, y: height / 2 };
    if (left < center.x) {
      console.log("arriba");
    }

    let ladoX = left + width > 0 ? "right" : "left";
    let ladoY = top + height > 0 ? "bottom" : "top";

    return { x: ladoX, y: ladoY };
  };

  const convertPlaceholder = (number) => {
    switch (number) {
      case 1:
        return "top";
      case 2:
        return "top";
      case 3:
        return "top";
      case 4:
        return "left";
      case 5:
        return "center";
      case 6:
        return "right";
      case 7:
        return "bottom";
      case 8:
        return "bottom";
      case 9:
        return "bottom";
      default:
        return "Invalid";
    }
  };

  // Función para calcular la posición top
  const teleport = (Porcentaje, position, viewportSize) => {
    if (Porcentaje > 1510) {
      return position - viewportSize;
    } else if (Porcentaje < 1) {
      return position + viewportSize;
    } else {
      return position;
    }
  };

  //Obtiene todos los datos del Box, dimensiones y Posision
  useEffect(() => {
    const updateContainerPosition = () => {
      const container = dragBoxAreaRef.current;
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
    window.addEventListener("resize", updateContainerPosition);
    window.addEventListener("scroll", updateContainerPosition);
    return () => {
      window.removeEventListener("resize", updateContainerPosition);
      window.removeEventListener("scroll", updateContainerPosition);
    };
  }, [lastClick, MousePosition]);

  //Mouse al box si draggin es true.
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (dragging) {
        setPosition({
          x: event.clientX - lastClick.x,
          y: event.clientY - lastClick.y,
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
  }, [dragging, lastClick]);

  useEffect(() => {
    const containerLeft = position.x;
    const containerTop = position.y;
    const containerRight = position.x + metadata.width;
    const containerBottom = position.y + metadata.height;

    const visibleWidth =
      Math.min(containerRight, viewportSize.width) +
      Math.max(containerLeft, metadata.width);
    const visibleHeight =
      Math.min(containerBottom, viewportSize.height) +
      Math.max(containerTop, metadata.height);

    const visiblePercentageX = (visibleWidth / metadata.width) * 100;
    const visiblePercentageY = (visibleHeight / metadata.height) * 100;

    setVisibilidad({ x: visiblePercentageX, y: visiblePercentageY });

    setPuntero(handlePuntero(metadata, viewportSize));
  }, [metadata, viewportSize, position]);

  return (
    <div
      ref={dragBoxAreaRef}
      className="BOX"
      style={{
        left: `${teleport(visibilidad.x, position.x, viewportSize.width)}px`,

        top: `${teleport(visibilidad.y, position.y, viewportSize.height)}px`,

        position: "absolute",
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      <Meta
        handleCenter={handleCenter}
        puntero={puntero}
        Porcentaje={visibilidad}
        lastClick={lastClick}
        metadata={metadata}
        viewportSize={viewportSize}
      />
      <Grid dragging={dragging} nombre={convertPlaceholder} />
      );
    </div>
  );
};

export default Gallery;

function Meta({
  puntero,
  Porcentaje,
  lastClick,
  metadata,
  viewportSize,
  handleCenter,
}) {
  return (
    <div className="container">
      <button onClick={handleCenter}>Centrar</button>
      <p>Puntero</p>
      <p>
        {puntero.x} {puntero.y}
      </p>
      <p>Visible :</p>
      <div>viewport Centro</div>
      <p>
        X: {viewportSize.width + metadata.width / 15} Y:
        {viewportSize.height + metadata.height / 5}
      </p>
      <p>Posicion del conteiner:</p>
      (X: {metadata.left} Y: {metadata.top} )<p>Dimenciones del conteiner:</p>
      (x: {Porcentaje.x} %, y: {Porcentaje.y} %)<p></p>
      <p>Cordenanas globales del click:</p>
      (X: {lastClick.x}, Y: {lastClick.y})<p></p>
      <p> Alto: {metadata.height}px</p>
      <p> Ancho: {metadata.width}px</p>
      <p>Dimenciones del viewport:</p>
      <p> Alto: {viewportSize.height}px</p>
      <p> Ancho: {viewportSize.width}px</p>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function Grid({ index, dragging, nombre }) {
  return (
    <div key={index} id={nombre(index + 1)} className={`Example `}>
      {Array.from({ length: 50 }, (_, index) => (
        <LocalObject key={index} isDragging={dragging}>
          <div
            className={`image-ex ${
              index + 1 == 25 || index + 1 == 26 ? "center" : ""
            }`}
          >
            <img
              src={`https://via.placeholder.com/150?text=Image${index + 1}`}
              alt=""
            />
          </div>
        </LocalObject>
      ))}
    </div>
  );
}
