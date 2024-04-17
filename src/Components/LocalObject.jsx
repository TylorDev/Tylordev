/* eslint-disable react/prop-types */
import { useContext, useState, useEffect, useRef } from "react";
import { MousePositionContext } from "../Context/MouseContext";

function LocalObject({ children, isDragging }) {
  const { rotate, center, MousePosition } = useContext(MousePositionContext);

  const objectRef = useRef(null);
  const [metadata, setMetadata] = useState({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
  });
  const [puntero, setPuntero] = useState("centro");
  const [objectCenter, setObjectCenter] = useState({
    y: 0,
    x: 0,
  });

  const [isOutside, setIsOutside] = useState(false);

  //Cambia el foco al contenedor que esta siendo enfocado por el mouse
  useEffect(() => {
    const handleMouseOut = (event) => {
      // Verifica si el mouse está fuera del viewport
      if (
        event.clientY < 0 ||
        event.clientY >= window.innerHeight ||
        event.clientX < 0 ||
        event.clientX >= window.innerWidth
      ) {
        // El mouse ha salido del viewport
        console.log("El mouse ha salido del viewport");
        setIsOutside(true);
      } else {
        setIsOutside(false);
      }
    };

    // Agregar un event listener para el evento "mouseout" en el documento
    document.addEventListener("mouseout", handleMouseOut);

    // Limpiar la suscripción cuando el componente se desmonte
    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []); // El array vacío como segundo argumento asegura que este efecto se ejecute solo una vez, similar a componentDidMount

  useEffect(() => {
    const updateContainerPosition = () => {
      const container = objectRef.current;
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
  }, [MousePosition]);

  //Calcula la posision actual del contenedor y en relacion a su centro
  useEffect(() => {
    const updateCointainerCenterPosition = () => {
      if (objectRef.current) {
        setObjectCenter({
          y: metadata.top + metadata.height / 2,
          x: metadata.left + metadata.width / 2,
        });
      }
    };

    updateCointainerCenterPosition();

    window.addEventListener("resize", updateCointainerCenterPosition);

    return () => {
      window.removeEventListener("resize", updateCointainerCenterPosition);
    };
  }, [metadata, MousePosition]);

  // const getPosition = (objectPosition, Focus, metadata) => {
  //   const { x: objX, y: objY } = objectPosition;
  //   const { x: focusX, y: focusY } = Focus;
  //   const { height, width } = metadata;

  //   const distance = {
  //     x: objectPosition.x - Focus.x,
  //     y: objectPosition.y - Focus.y,
  //   };

  //   const halfWidth = width / 2;
  //   const halfHeight = height / 2;

  //   const isAbove = objY < focusY - halfHeight;
  //   const isBelow = objY > focusY + halfHeight;
  //   const isLeft = objX < focusX - halfWidth;
  //   const isRight = objX > focusX + halfWidth;

  //   if (isAbove) {
  //     if (isLeft) return "arriba izquierda";
  //     if (isRight) return "arriba derecha";
  //     return "arriba centro";
  //   } else if (isBelow) {
  //     if (isLeft) return "abajo izquierda";
  //     if (isRight) return "abajo derecha";
  //     return "abajo centro";
  //   } else {
  //     if (isLeft) return "izquierda";
  //     if (isRight) return "derecha";
  //     return "centro";
  //   }
  // };

  const getPosition = (objectPosition, Focus, metadata) => {
    const { x: objX, y: objY } = objectPosition;
    const { x: focusX, y: focusY } = Focus;
    const { height, width } = metadata;
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const distance = {
      x: objectPosition.x - Focus.x,
      y: objectPosition.y - Focus.y,
    };

    const isAbove = objY < focusY - halfHeight;
    const isBelow = objY > focusY + halfHeight;
    const isLeft = objX < focusX - halfWidth;
    const isRight = objX > focusX + halfWidth;

    if (isAbove) {
      if (isLeft) {
        if (distance.y < 0 && distance.x >= -380 && distance.x <= -160) {
          return "arriba izquierda";
        }

        return "top-corner-left";
      }
      if (isRight) {
        if (distance.y < 0 && distance.x >= 160 && distance.x <= 380) {
          return "arriba derecha";
        }
        return "top-corner-right";
      }
      return "arriba centro";
    }

    if (isBelow) {
      if (isLeft) {
        if (distance.y > 0 && distance.x < 0) return "bottom-corner-left";
        return "abajo izquierda";
      }
      if (isRight) {
        if (distance.y > 0 && distance.x > 0) return "bottom-corner-right";
        return "abajo derecha";
      }
      return "abajo centro";
    } else {
      if (isLeft) return "izquierda";
      if (isRight) return "derecha";
      return "centro";
    }
  };
  useEffect(() => {
    if (isOutside) {
      const newPuntero = "centro";
      setPuntero(newPuntero);
    } else {
      const newPuntero = getPosition(objectCenter, MousePosition, metadata);
      setPuntero(newPuntero);
    }
  }, [objectCenter, MousePosition, metadata, center, isOutside]);

  const adjustPosition = (position, number) => {
    switch (position) {
      case "arriba izquierda":
        return { x: -number, y: number + 30 };
      case "arriba derecha":
        return { x: -number, y: number - 30 };
      case "arriba centro":
        return { x: -number, y: number };
      case "abajo izquierda":
        return { x: number, y: number + 30 };
      case "abajo derecha":
        return { x: number, y: number - 30 };
      case "abajo centro":
        return { x: number, y: 0 };
      case "izquierda":
        return { x: 0, y: number + 30 };
      case "derecha":
        return { x: 0, y: number - 30 };
      case "centro":
        return { x: number / 5, y: number / 5 };
      default:
        return { x: 0, y: 0 };
    }
  };
  return (
    <div
      ref={objectRef}
      className="object"
      style={{
        transform: isDragging
          ? `perspective(1500px) rotate3d(1, 0, 0,${rotate.x}deg)rotate3d(0, 1, 0,${rotate.y}deg)`
          : `perspective(1500px) rotate3d(1, 0, 0, ${
              adjustPosition(puntero, rotate.x).x
            }deg) rotate3d(0, 1, 0, ${adjustPosition(puntero, rotate.y).y}deg)`,
      }}
    >
      {Metadata(objectCenter, metadata, center, puntero, MousePosition)}

      {children}
    </div>
  );
}
export default LocalObject;
function Metadata(objectCenter, metadata, Foco, puntero, mouse) {
  const { width, height } = metadata;
  return (
    <div className="meta">
      <div> Posision objeto :[centro]</div>
      <p>
        X:
        {objectCenter.x.toFixed(1)}
        Y: {objectCenter.y.toFixed(1)}
      </p>
      <div>Dimensiones:[objeto]</div>
      <p>Ancho: {width.toFixed(1)}</p>
      <p>Alto: {height.toFixed(1)}</p>
      <div>Posision Mouse</div>
      <p>
        X:
        {mouse.x.toFixed(1)}
        Y: {mouse.y.toFixed(1)}
      </p>
      {/* <div>Centro viewport</div>
      <p>
        X: {Foco.x.toFixed(1)} Y:
        {Foco.y.toFixed(1)}
      </p> */}
      <div>Puntero:</div>
      <p>{puntero !== undefined ? puntero : "N/A"} </p>
      <div>Distancia del focus:</div>
      <p>
        X:
        {(objectCenter.x - mouse.x).toFixed(2) + "px"}
        Y: {(objectCenter.y - mouse.y).toFixed(2) + "px"}
      </p>
    </div>
  );
}
