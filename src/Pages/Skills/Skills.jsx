import "./Skills.scss";

import content from "./skillsContent.json";

function Skills() {
  return (
    <div className="Skills">
      {Object.keys(content.Skills).map((key) => (
        <div key={key} className={key}>
          {content.Skills[key].map((item, index) => (
            <div key={index} className="skill">
              <div className="ss-tittle">
                <span>{item.skill["ss-tittle"].text}</span>
                <button>{item.skill["ss-tittle"].button}</button>
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
      ))}
    </div>
  );
}

export default Skills;
