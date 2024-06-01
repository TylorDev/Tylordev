import "./Steps.scss";

import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { Void } from "./../../Components/Void/Void";
function Steps() {
  const content = FetchDataComponent("stepsContents");
  const steps = content?.Steps ?? [];
  if (!content) {
    return (
      <div className="Steps">
        {Array(3)
          .fill("")
          .map((_, index) => (
            <div key={index} className="Step">
              <div className="s-tittle">
                <Void type="div" char={15} />
              </div>
              <p>
                <Void type="parraf" margin={0.2} range="50-50" />
              </p>
            </div>
          ))}
      </div>
    );
  }
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
