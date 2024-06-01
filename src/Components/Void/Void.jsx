import { useEffect, useState } from "react";
import "./Void.scss";

export const Void = ({
  type = "void",
  src = "https://gclabels.net/image/cache/data/new/inv/new/Blank-White-Square-Labels-s1w-600x600.png",
  char = 10,
  radius,
  margin,
  marginX,
  id = "void",
  lines = 4,
  range = "30-30",
  cla,
}) => {
  const [delay, setDelay] = useState(0);
  const lettersArray = Array.from({ length: char }, (_, index) => "n");

  const generatedString = lettersArray.join("");

  const paraf = (range, index) => {
    const [start, end] = range.split("-").map(Number);
    if (isNaN(start) || isNaN(end) || start > end) {
      return "Invalid range";
    }
    // Cálculo "extraño" para determinar un número dentro del rango
    const randomFactor = (index * 3 + 7) % (end - start + 1);
    const length = start + randomFactor;

    // Generar el string aleatorio
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      result += letters[randomIndex];
    }
    return result;
  };

  const commonStyle = {
    backgroundColor: "#c9c9c9", // Fondo rojo o color de fondo común
    animation: "fadeInOut 1s ease-in-out infinite",
    animationDelay: `${delay}ms`,
    borderRadius: `${radius}rem`,
    marginBottom: `${margin}rem`,
    marginLeft: `${marginX}rem`,
    marginRigth: `${marginX}rem`,
  };

  let element;
  if (type === "span") {
    element = (
      <span
        style={{ ...commonStyle, color: "transparent", height: "fit-content" }}
      >
        {generatedString}
      </span>
    );
  } else if (type === "div") {
    element = (
      <div
        style={{
          ...commonStyle,
          color: "transparent",
          height: "fit-content",
          width: "fit-content",
        }}
      >
        {generatedString}
      </div>
    );
  } else if (type === "button") {
    element = (
      <button
        id={id}
        style={{
          ...commonStyle,
          color: "transparent",

          borderRadius: `${radius}rem`,
          marginRight: `${marginX}rem`,
          marginLeft: `${marginX}rem`,
        }}
      >
        {generatedString}
      </button>
    );
  } else if (type === "void") {
    element = (
      <div
        id={id}
        style={{
          ...commonStyle,
          color: "transparent",
          height: "100%",
          width: "100%",
        }}
      >
        {generatedString}
      </div>
    );
  } else if (type === "img") {
    element = (
      <div
        style={{
          ...commonStyle,

          width: "100%",
          height: "100%",
        }}
      >
        <img src={src} style={{ opacity: "0" }} alt="Animated Image" />
      </div>
    );
  } else if (type === "mirror") {
    element = (
      <div
        className={cla}
        style={{
          backgroundColor: "#c9c9c9", // Fondo rojo o color de fondo común
          animation: "fadeInOut 1s ease-in-out infinite",
        }}
      >
        <img src={src} style={{ opacity: "0" }} alt="Animated Image" />
      </div>
    );
  } else if (type === "m") {
    element = (
      <div
        className={cla}
        style={{
          backgroundColor: "#c9c9c9", // Fondo rojo o color de fondo común
          animation: "fadeInOut 1s ease-in-out infinite",
          color: "transparent",
        }}
      >
        <p> {generatedString} </p>
      </div>
    );
  } else if (type === "parraf") {
    element = (
      <div className="voidparraf" style={{ width: "100%" }}>
        {Array(lines)
          .fill("")
          .map((_, index) => (
            <div
              key={index}
              style={{
                ...commonStyle,

                color: "transparent",
                height: "fit-content",
                width: "fit-content",
                alignSelf: "start",
              }}
            >
              {paraf(range, index)}
            </div>
          ))}
      </div>
    );
  }

  return element;
};
