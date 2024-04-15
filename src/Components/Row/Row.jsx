/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import LocalObject from "../LocalObject";
import "./Row.scss";
// import Grid from "./Grid";

function Row() {
  const [contador, setContador] = useState({ top: 1, bottom: 1 });

  // Función para incrementar el contador
  const incrementarContador = (propiedad) => {
    setContador((prevContador) => {
      // Verificar si el valor actual es menor que 3
      if (prevContador[propiedad] < 5) {
        // Incrementar el contador
        return {
          ...prevContador,
          [propiedad]: prevContador[propiedad] + 0,
        };
      } else {
        // Si ya alcanzó el máximo, retornar el contador sin cambios
        return prevContador;
      }
    });
  };

  return (
    <div className="Row">
      <div className="corner">xd</div>
      <LadoArray
        longitudArray={0}
        ladoSensor="top"
        lado="superior"
        handleContador={incrementarContador}
      />
      <div className="corner">xd</div>
      <LadoArray
        longitudArray={0}
        ladoSensor="left"
        lado="izquierdo"
        handleContador={incrementarContador}
      />
      <div className="lado centro"></div>
      <LadoArray
        longitudArray={0}
        ladoSensor="right"
        lado="derecho"
        handleContador={incrementarContador}
      />
      <div className="corner"></div>
      <LadoArray
        longitudArray={0}
        ladoSensor="bottom"
        lado="inferior"
        handleContador={incrementarContador}
      />
      <div className="corner">xd</div>
    </div>
  );
}
export default Row;

const LadoArray = ({ longitudArray, ladoSensor, lado, handleContador }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ladoClass = `lado ${lado} ${isVisible ? "visible" : "invisible"}`;

  const handleVisible = (value) => {
    setIsVisible(value);

    if (value === true) {
      console.log(`lado ${lado} INVISIBLE`);
    } else {
      handleContador(ladoSensor);
    }
  };

  return (
    <div className={ladoClass}>
      <Sensor side={ladoSensor} handleVisible={handleVisible} />
      {Array.from({ length: longitudArray }).map((_, index) => (
        <LocalObject key={index}>
          <div>
            <img
              style={{ width: "20vw", height: "50vh" }}
              src={
                "https://i.pinimg.com/736x/de/26/4c/de264cc538aa261e25572f6249ebdaad.jpg"
              }
              alt=""
            />
          </div>
        </LocalObject>
      ))}
    </div>
  );
};

const Sensor = ({ side, handleVisible }) => {
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const sensorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prevVisible, setPrevVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = () => {
      if (sensorRef.current && !isInViewport(sensorRef.current)) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [side]);

  useEffect(() => {
    if (isVisible !== prevVisible) {
      handleVisible(isVisible);
      setPrevVisible(isVisible);
    }
  }, [isVisible, prevVisible, handleVisible]);

  return (
    <div ref={sensorRef} className={`sensor sensor-${side}`}>
      {isVisible ? `${side} no está visible` : `${side} está visible`}
    </div>
  );
};
