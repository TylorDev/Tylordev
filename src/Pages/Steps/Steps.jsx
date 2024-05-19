import "./Steps.scss";

import content from "./stepsContent.json"; // Asegúrate de tener el archivo JSON en la misma carpeta o actualizar la ruta según corresponda

function Steps() {
  const steps = content.Steps;

  return (
    <div className="Steps">
      {steps.map((step, index) => (
        <div key={index} className="Step">
          <div className="s-tittle">{step.title}</div>
          <p>{step.content}</p>
        </div>
      ))}
    </div>
  );
}
export default Steps;
