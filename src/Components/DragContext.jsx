// CounterContext.js
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { MousePositionContext } from "../Context/MouseContext";

const DragContext = createContext();

const DragProvider = ({ children }) => {
  //Tamaño del viewport y Posicion en vivo de Mouse, Dependencias: [???]
  const { MousePosition } = useContext(MousePositionContext);
  //Porcentaje visible del Box en el viewport, Todavia no lo comprendo al 100%, es necesario rehacerlo. Dependencias: [???]
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
    x: 0,
    y: 0,
  });

  //Obtiene la posision del ultimo click. en la pantalla.
  const handleClick = useCallback(() => {
    if (!dragging) {
      const x = MousePosition.x - metadata.left;
      const y = MousePosition.y - metadata.top;
      setLastclick({ x, y });
    }
  }, [metadata, dragging, MousePosition]);

  const handleMouseDown = () => {
    handleClick();
    setDragging(true);
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

  return (
    <DragContext.Provider
      value={{ dragBoxAreaRef, position, handleMouseDown, dragging }}
    >
      {children}
    </DragContext.Provider>
  );
};

export { DragProvider, DragContext };
