/* eslint-disable react/prop-types */
import "./Project.scss";
import { GoArrowRight } from "react-icons/go";

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { TextModal } from "../../Components/TextModal/TextModal";

import { Void } from "./../../Components/Void/Void";
import GetObjectData from "./../../Components/GetObjectData/GetObjectData";

function Project() {
  const { projectName } = useParams();

  useEffect(() => {
    function capitalizeFirstLetter(string) {
      if (!string) return string; // Maneja casos donde la cadena sea vacía o null
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    document.title = capitalizeFirstLetter(projectName);
  }, [projectName]);

  const data = GetObjectData({ type: "Projects" });

  if (!data) {
    return (
      <div className="Project">
        <div className="pp-header">
          <Void type="m" cla={"ph-message"} char={10} />

          <Void type="m" cla={"ph-tittle"} char={10} />

          <p className="ph-subtittle">
            <Void type="div" />
          </p>
          <div className="ph-action-buttons">
            <Void type="button" char={20} />
            <Void type="button" char={20} />
          </div>
        </div>

        <div className="pp-section" style={{ flexDirection: "row-reverse" }}>
          <Void type="mirror" cla={"ppc-cover"} />
          <Void type="m" cla={"tm-content"} char={76} />
        </div>

        <div className="pp-section" style={{ flexDirection: "row" }}>
          <Void type="mirror" cla={"ppc-cover"} />
          <Void type="m" cla={"tm-content"} char={76} />
        </div>
      </div>
    );
  }
  return (
    <div className="Project">
      <div
        className="pp-header"
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 0%), url(${data.header.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="ph-message">
          <span>{data.header.message}</span>
          <GoArrowRight />
        </div>
        <div className="ph-tittle">{data.header.title}</div>
        <p className="ph-subtittle">{data.header.subtitle}</p>
        <div className="ph-action-buttons">
          {data.header.buttons.map((button, index) => (
            <button key={index}>
              {button.text} {button.icon && <GoArrowRight />}
            </button>
          ))}
        </div>
      </div>

      {data.sections.map((section, index) => (
        <div
          className="pp-section"
          key={index}
          style={{ flexDirection: section.flexDirection }}
        >
          <div className="ppc-cover">
            <img src={section.coverImage} alt="" />
          </div>

          <TextModal tmContent={section.tmContent} />
        </div>
      ))}
    </div>
  );
}
export default Project;
