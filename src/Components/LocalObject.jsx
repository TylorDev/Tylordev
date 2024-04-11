/* eslint-disable react/prop-types */
import { useContext, useState, useEffect, useRef } from "react";
import { MousePositionContext } from "../Context/MouseContext";

function LocalObject({ children }) {
  const { rotate, center, changeCenter, Mposition } =
    useContext(MousePositionContext);

  const [localRotation, setLocalRotation] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [containerPosition, setContainerPosition] = useState({
    y: 0,
    x: 0,
  });

  useEffect(() => {
    const handleHover = () => {
      changeCenter(containerPosition);
    };

    const handleMouseOut = () => {
      changeCenter({ Mposition });
    };

    const container = containerRef.current;

    container.addEventListener("mouseover", handleHover);
    container.addEventListener("mouseout", handleMouseOut);

    return () => {
      container.removeEventListener("mouseover", handleHover);
      container.removeEventListener("mouseout", handleMouseOut);
    };
  }, [center]);

  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.clientWidth);
      setHeight(containerRef.current.clientHeight);
    }
  }, []);
  useEffect(() => {
    const updateContainerPosition = () => {
      if (containerRef.current) {
        const { top, left } = containerRef.current.getBoundingClientRect();
        setContainerPosition({ y: top + height / 2, x: left + width / 2 });
      }
    };

    updateContainerPosition();

    window.addEventListener("resize", updateContainerPosition);

    return () => {
      window.removeEventListener("resize", updateContainerPosition);
    };
  }, [height, width]);

  const getPosition = (
    objectPosition,
    viewportCenter,
    objectWidth,
    objectHeight
  ) => {
    const { x: objX, y: objY } = objectPosition;
    const { x: centerX, y: centerY } = viewportCenter;

    const halfWidth = objectWidth / 2;
    const halfHeight = objectHeight / 2;

    const isAbove = objY < centerY - halfHeight;
    const isBelow = objY > centerY + halfHeight;
    const isLeft = objX < centerX - halfWidth;
    const isRight = objX > centerX + halfWidth;

    if (isAbove) {
      if (isLeft) return "arriba izquierda";
      if (isRight) return "arriba derecha";
      return "arriba centro";
    } else if (isBelow) {
      if (isLeft) return "abajo izquierda";
      if (isRight) return "abajo derecha";
      return "abajo centro";
    } else {
      if (isLeft) return "izquierda";
      if (isRight) return "derecha";
      return "centro";
    }
  };

  const position = getPosition(containerPosition, center, width, height);

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
    }
  };
  return (
    <div
      ref={containerRef}
      className="object"
      style={{
        transform: `perspective(1000px) rotate3d(1, 0, 0, ${
          adjustPosition(position, rotate.x).x
        }deg)  rotate3d(0, 1, 0, ${adjustPosition(position, rotate.y).y}deg)`,
      }}
    >
      <div className="meta">
        {/* <p>
          X: {containerPosition.x + width / 2} Y:
          {containerPosition.y + height / 2}
        </p>
        <p>
          CentroObjecto: Ancho: {width} Alto: {height}
        </p>
        <p>
          Center X: {center.x} Y: {center.y}
          viewport.
        </p> */}

        <p>El objeto está en {position} </p>
      </div>

      {children}
    </div>
  );
}
export default LocalObject;
