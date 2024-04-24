import { useState, useEffect, useRef } from "react";
import "./MouseController.scss";

function MouseController({ children }) {
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (event) => {
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
        return "derecha";
      } else {
        return "izquierda";
      }
    } else {
      if (deltaY > 0) {
        return "abajo";
      } else {
        return "arriba";
      }
    }
  };

  const direction = calculateDirection();

  return (
    <div
      className="mouse-controller"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <Canvas positionA={startPosition} positionB={currentPosition}></Canvas>
      {children}
      <div
        className="start-position"
        style={{ left: startPosition.x, top: startPosition.y }}
      ></div>

      <div
        className="current-position"
        style={{ left: currentPosition.x, top: currentPosition.y }}
      ></div>
    </div>
  );
}
export default MouseController;

const Canvas = ({ positionA, positionB }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Limpiar el canvas antes de dibujar
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la línea
    context.beginPath();
    context.moveTo(positionA.x, positionA.y);
    context.lineTo(positionB.x, positionB.y);
    context.strokeStyle = "#000"; // color de la línea
    context.lineWidth = 5; // grosor de la línea
    context.stroke();
  }, [positionA, positionB]);

  return (
    <canvas
      ref={canvasRef}
      className="canvas"
      width={window.innerWidth} // Ancho del canvas igual al ancho del viewport
      height={window.innerHeight} // Alto del canvas igual al alto del viewport
    />
  );
};
