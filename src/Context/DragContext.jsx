// CounterContext.js
import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { MousePositionContext } from "./MouseContext";

const DragContext = createContext();

const DragProvider = ({ children }) => {
  //Tamaño del viewport y Posicion en vivo de Mouse, Dependencias: [???]
  const { MousePosition, viewportSize } = useContext(MousePositionContext);
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
  const [distance, setDistance] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });
  //Posision inicial del Box, Se ocupa para posisionar el box en el viewport, Dependencias: [???]
  const [positionX, setPositionX] = useState(0);

  const [positionY, setPositionY] = useState(0);

  const [direction, setDirection] = useState("center");
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
    const updateMetadata = () => {
      const container = dragBoxAreaRef.current;
      if (container) {
        const viewportWidth =
          window.innerWidth || document.documentElement.clientWidth;
        const viewportHeight =
          window.innerHeight || document.documentElement.clientHeight;
        const { top, left, bottom, right } = container.getBoundingClientRect();
        const rect = container.getBoundingClientRect();
        setMetadata({
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          width: rect.width,
          height: rect.height,
        });

        setDistance({
          top: Math.max(-200, Math.min(top, 200)), // La distancia no puede ser menor que 0
          left: left, // La distancia no puede ser menor que 0
          bottom: Math.max(-200, Math.min(viewportHeight - bottom, 200)), // La distancia no puede ser menor que 0
          right: Math.max(-200, Math.min(viewportWidth - right, 200)), // La distancia no puede ser menor que 0
        });
      }
    };
    updateMetadata();

    window.addEventListener("resize", updateMetadata);
    window.addEventListener("scroll", updateMetadata);
    return () => {
      window.removeEventListener("resize", updateMetadata);
      window.removeEventListener("scroll", updateMetadata);
    };
  }, [MousePosition]);

  const getMetadata = (ref) => {
    const container = ref.current;
    let rect = 0;
    if (container) {
      rect = container.getBoundingClientRect();
    }

    return rect;
  };
  //Mouse al box si draggin es true.
  useEffect(() => {
    const handleMouseMove = (event) => {
      if (dragging) {
        let nextPositionX = event.clientX - lastClick.x;
        let nextPositionY = event.clientY - lastClick.y;
        const { width, height } =
          dragBoxAreaRef.current.getBoundingClientRect();
        // Limitar la posición en el eje X entre -1450 y 0
        nextPositionX = Math.max(
          viewportSize.width - width,
          Math.min(0, nextPositionX)
        );
        nextPositionY = Math.max(
          viewportSize.height - height,
          Math.min(0, nextPositionY)
        );
        setPositionX(nextPositionX);
        setPositionY(nextPositionY);
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
  }, [dragging, lastClick, distance, direction]);

  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

  const handleDown = (event) => {
    const { clientX, clientY } = event;
    setStartPosition({ x: clientX, y: clientY });
    setCurrentPosition({ x: clientX, y: clientY });
  };

  const handleMouseMove = (event) => {
    setCurrentPosition({ x: event.clientX, y: event.clientY });
  };

  const calculateDirection = () => {
    const deltaX = currentPosition.x - startPosition.x;
    const deltaY = currentPosition.y - startPosition.y;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        if (deltaY > 0) {
          return "abajo derecha ";
        } else if (deltaY < 0) {
          return "arriba derecha";
        } else {
          return "derecha";
        }
      } else {
        if (deltaY > 0) {
          return "abajo izquierda";
        } else if (deltaY < 0) {
          return "arriba izquierda";
        } else {
          return "izquierda";
        }
      }
    } else {
      if (deltaY > 0) {
        return "abajo";
      } else if (deltaY < 0) {
        return "arriba";
      } else {
        if (deltaX > 0) {
          return "derecha";
        } else if (deltaX < 0) {
          return "izquierda";
        } else {
          return "estático"; // Puedes cambiar esto según tus necesidades
        }
      }
    }
  };

  useEffect(() => {
    const direction = calculateDirection();
    setDirection(direction);
  }, [currentPosition, startPosition]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleDown);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleDown);
    };
  }, []);

  const centrar = (posX, posY) => {
    setPositionX(posX);
    setPositionY(posY);
  };

  return (
    <DragContext.Provider
      value={{
        dragBoxAreaRef,
        positionX,
        positionY,
        handleMouseDown,
        dragging,
        direction,
        getMetadata,
        centrar,
        distance,
      }}
    >
      {children}
    </DragContext.Provider>
  );
};

export { DragProvider, DragContext };

//RESOLVER PARA QUE SE CALCULE LA DISTANCIA SOLO CUANDO SE HAGA CLICK Y DE DEJE DE HACER CLICK.
