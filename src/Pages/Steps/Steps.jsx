import "./Steps.scss";

import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
function Steps() {
  const content = FetchDataComponent("stepsContent");
  const steps = content?.Steps ?? [];

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
