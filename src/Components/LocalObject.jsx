/* eslint-disable react/prop-types */
import { useContext, useState, useEffect, useRef } from "react";
import { MousePositionContext } from "../Context/MouseContext";

function LocalObject({ children, isDragging }) {
  const { rotate, center, MousePosition, viewportSize } =
    useContext(MousePositionContext);

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

  const getPosition = (objectPosition, Focus, metadata, viewportSize) => {
    const { x: objX, y: objY } = objectPosition;
    const { x: focusX, y: focusY } = Focus;
    const { height, width } = metadata;

    const distanceX = objX - focusX;
    const isAbove = objY < focusY - height / 2;
    const isBelow = objY > focusY + height / 2;
    const isLeft = objX < focusX - width / 2;
    const isRight = objX > focusX + width / 2;

    const isLeftCorner =
      distanceX >= -(viewportSize.width / 2 + width * 1.5) &&
      distanceX <= -(viewportSize.width / 2 - width * 1.5);

    const isRightCorner =
      distanceX <= viewportSize.width / 2 + width * 1.5 &&
      distanceX >= viewportSize.width / 2 - width * 1.5;

    if (isAbove) {
      if (isLeft) {
        //Se divide entre 5 por el numero de columnas, en este caso 5 visibles.
        if (objX < viewportSize.width / 5 && isLeftCorner) {
          return "arriba esquina izquierda";
        }
        return "arriba izquierda";
      }
      if (isRight) {
        if (objX > viewportSize.width / 1.25 && isRightCorner) {
          return "arriba esquina derecha";
        }
        return "arriba derecha";
      }
      return "arriba centro";
    } else if (isBelow) {
      if (isLeft) {
        if (objX < viewportSize.width / 5 && isLeftCorner) {
          return "abajo esquina izquierda";
        }
        return "abajo izquierda";
      }
      if (isRight) {
        if (objX > viewportSize.width / 1.25 && isRightCorner) {
          return "abajo esquina derecha";
        }
        return "abajo derecha";
      }

      return "abajo centro";
    } else {
      if (isLeft) {
        if (objX < viewportSize.width / 5 && isLeftCorner) {
          return "borde izquierda";
        }
        return "izquierda";
      }
      if (isRight) {
        if (objX > viewportSize.width / 1.25 && isRightCorner) {
          return "borde derecha";
        }
        return "derecha";
      }
      return "centro ";
    }
  };
  useEffect(() => {
    if (isOutside) {
      const newPuntero = getPosition(
        objectCenter,
        center,
        metadata,
        viewportSize
      );
      setPuntero(newPuntero);
    } else {
      const newPuntero = getPosition(
        objectCenter,
        MousePosition,
        metadata,
        viewportSize
      );
      setPuntero(newPuntero);
    }
  }, [objectCenter, MousePosition, metadata, center, isOutside, viewportSize]);

  const adjustPosition = (position, grados, idle = false) => {
    if (idle) {
      // Definición de las variables
      const side = 35;
      const CornerBorder = 45;
      const numeroC = grados / 5;

      switch (position) {
        case "arriba izquierda":
          return { x: -side, y: side };
        case "arriba esquina izquierda":
          return { x: -side, y: CornerBorder };
        case "arriba derecha":
          return { x: -side, y: -side };
        case "arriba esquina derecha":
          return { x: -side, y: -CornerBorder };
        case "arriba centro":
          return { x: -side, y: 0 };
        case "abajo izquierda":
          return { x: side, y: side };
        case "abajo esquina izquierda":
          return { x: side, y: CornerBorder };
        case "abajo derecha":
          return { x: side, y: -side };
        case "abajo esquina derecha":
          return { x: side, y: -CornerBorder };
        case "abajo centro":
          return { x: side, y: 0 };
        case "izquierda":
          return { x: 0, y: side };
        case "borde izquierda":
          return { x: 0, y: CornerBorder };
        case "derecha":
          return { x: 0, y: -side };
        case "borde derecha":
          return { x: 0, y: -CornerBorder };
        case "centro":
          return { x: numeroC, y: numeroC };
        default:
          return { x: 0, y: 0 };
      }
    } else {
      const absGrados = Math.abs(grados);
      const minvalue = 5;
      const maxSide = 30;
      const MaxCornerBorder = 45;
      const lados = Math.min(absGrados + minvalue, maxSide) + maxSide;
      const bordes = Math.min(absGrados + maxSide, MaxCornerBorder);
      const esquinas = Math.min(absGrados, MaxCornerBorder) + MaxCornerBorder;

      switch (position) {
        case "arriba izquierda":
          return {
            x: -grados,
            y: lados,
          };
        case "arriba esquina izquierda":
          return {
            x: -grados,
            y: esquinas,
          };
        case "arriba derecha":
          return {
            x: -absGrados,
            y: -lados,
          };
        case "arriba esquina derecha":
          return {
            x: -grados,
            y: -esquinas,
          };
        case "arriba centro":
          return { x: -grados, y: 0 };
        case "abajo izquierda":
          return {
            x: grados,
            y: lados,
          };
        case "abajo esquina izquierda":
          return { x: grados, y: grados + maxSide };
        case "abajo derecha":
          return {
            x: grados,
            y: -lados,
          };
        case "abajo esquina derecha":
          return {
            x: grados,
            y: -esquinas,
          };
        case "abajo centro":
          return { x: grados, y: 0 };
        case "izquierda":
          return { x: 0, y: lados };
        case "borde izquierda":
          return {
            x: 0,
            y: bordes,
          };
        case "derecha":
          return { x: 0, y: -lados };
        case "borde derecha":
          return {
            x: 0,
            y: -bordes,
          };
        case "centro":
          return { x: grados / minvalue, y: grados / minvalue };
        default:
          return { x: 0, y: 0 };
      }
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
              adjustPosition(puntero, rotate.x, isOutside).x
            }deg) rotate3d(0, 1, 0, ${
              adjustPosition(puntero, rotate.y, isOutside).y
            }deg)`,
      }}
    >
      {Metadata(
        objectCenter,
        metadata,
        center,
        puntero,
        MousePosition,
        isOutside,
        adjustPosition(puntero, rotate.x, isOutside).x,
        adjustPosition(puntero, rotate.y, isOutside).y
      )}
      {children}
    </div>
  );
}
export default LocalObject;

function Metadata(
  objectCenter,
  metadata,

  Foco,
  puntero,
  mouse,
  isOutside,
  rotationX,
  rotationY
) {
  const { width, height } = metadata;
  return (
    <div className="meta">
      {/* <div> Posision objeto :[centro]</div>
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
      </p> */}
      {/* <div>Centro viewport</div>
      <p>
        X: {Foco.x.toFixed(1)} Y:
        {Foco.y.toFixed(1)}
      </p> */}
      {/* s */}
      {/* <div>Distancia del focus:</div>
      <p>
        X:
        {(objectCenter.x - mouse.x).toFixed(1) + "px"}
      </p> */}

      <div>Puntero</div>
      <p>{puntero}</p>
    </div>
  );
}
