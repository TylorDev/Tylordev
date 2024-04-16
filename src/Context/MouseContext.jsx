/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";

const MousePositionContext = createContext();

const MousePositionProvider = ({ children }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [MousePosition, setPosition] = useState({
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
  });
  const { x, y } = MousePosition;

  const [center, setCenter] = useState({
    x: window.innerWidth / 2 + window.scrollX,
    y: window.innerHeight / 2 + window.scrollY,
  });

  const changeCenter = (focus) => {
    setCenter({ x: focus.x, y: focus.y });
  };

  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // Función para manejar el evento de scroll
    const handleScroll = () => {
      // Verificar si se está haciendo scroll
      if (!isScrolling) {
        setIsScrolling(true);
      }
      // Reiniciar el temporizador para que después de un breve período sin hacer scroll, se marque como inactivo
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Cambia este valor según tus necesidades
    };

    let timeout;

    // Agregar el event listener al montar el componente
    window.addEventListener("scroll", handleScroll);

    // Eliminar el event listener al desmontar el componente
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolling]); // Dependencia vacía para que solo se ejecute una vez al montar y desmontar el componente

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Limpia el evento de resize cuando el componente se desmonta
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Dependencia vacía para que solo se ejecute una vez al montar el componente

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

      // console.log("X:", e.clientX, "Y:", e.clientY); //
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <MousePositionContext.Provider
      value={{
        MousePosition,
        rotate,
        center,
        changeCenter,
        viewportSize,
        isScrolling,
      }}
    >
      {children}
    </MousePositionContext.Provider>
  );
};

export { MousePositionProvider, MousePositionContext };
