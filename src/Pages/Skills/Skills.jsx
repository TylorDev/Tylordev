import "./Skills.scss";

import { TextModal } from "./../../Components/TextModal/TextModal";
import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { Void } from "./../../Components/Void/Void";

function Skills() {
  const content = FetchDataComponent("skillsContent");

  if (!content) {
    return (
      <div className="Skills">
        {Array(20)
          .fill("")
          .map((_, index) => (
            <Void key={index} />
          ))}
      </div>
    );
  }
  return (
    <div className="Skills">
      {content.Skills["sk-1"] && (
        <div key="sk-1" className="sk-1">
          {content.Skills["sk-1"].map((item, index) => (
            <div key={index} className="skill">
              <div className="ss-tittle">
                <span>{item.skill["ss-tittle"].text}</span>
                <TextModal tmContent={item.skill["ss-tittle"].tmContent} />
              </div>
              {item.skill["ss-logo"] && (
                <div className="ss-logo">
                  <img
                    src={item.skill["ss-logo"].src}
                    alt={item.skill["ss-logo"].alt}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Skills;
