/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

const MousePositionContext = createContext();

const MousePositionProvider = ({ children }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [Mposition, setPosition] = useState({
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
  });
  const { x, y } = Mposition;

  const [center, setCenter] = useState({
    x: window.innerWidth / 2 + window.scrollX,
    y: window.innerHeight / 2 + window.scrollY,
  });

  const changeCenter = (focus) => {
    setCenter({ x: focus.x, y: focus.y });
  };

  useEffect(() => {
    const handleResize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const centerX = viewportWidth / 2;
      const centerY = viewportHeight / 2;

      setCenter({ x: centerX, y: centerY });
    };

    // Agregar el evento de resize al montar el componente
    window.addEventListener("resize", handleResize);

    // Limpieza: remover el evento de resize al desmontar el componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const changeRotate = () => {
      const newRotateY = (window.innerWidth / 2 - x) / 10; // Ajusta el divisor para cambiar la sensibilidad de la rotación
      const newRotateX = (window.innerWidth / 2 - y) / 10; // Ajusta el divisor para cambiar la sensibilidad de la rotación

      setRotate({ x: newRotateX, y: newRotateY });
    };

    changeRotate();
  }, [x, y]);

  useEffect(() => {
    const updateMousePosition = (e) => {
      const xPercent = (e.clientX / window.innerWidth) * 100;
      const yPercent = (e.clientY / window.innerHeight) * 100;
      setPosition({ x: e.clientX, y: e.clientY, xPercent, yPercent });

      console.log("X:", e.clientX, "Y:", e.clientY); //
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <MousePositionContext.Provider
      value={{ Mposition, rotate, center, changeCenter }}
    >
      {children}
    </MousePositionContext.Provider>
  );
};

export { MousePositionProvider, MousePositionContext };
