/* eslint-disable react/prop-types */
import "./Project.scss";
import { GoArrowRight } from "react-icons/go";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextModal } from "../../Components/TextModal/TextModal";

import { Void } from "./../../Components/Void/Void";
import GetObjectData from "./../../Components/GetObjectData/GetObjectData";
import { useLanguage } from "../../Context/LanguageContext";
import GetData from "./../../Components/GetData/GetData";

function Project() {
  const fileType = "Projects";
  const list = GetData({ fileType });
  const { projectName } = useParams();
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();
  const { language } = useLanguage();

  const handleClick = () => {
    const newIndex = index + 1 < list.length ? index + 1 : 0;
    navigate(
      `/${language}/projects/${list[newIndex].header.title.toLowerCase()}`
    );
  };

  useEffect(() => {
    function capitalizeFirstLetter(string) {
      if (!string) return string; // Maneja casos donde la cadena sea vacía o null
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const findIndexByName = (name) => {
      return list.findIndex((item) => item.header.title === name);
    };

    const id = findIndexByName(capitalizeFirstLetter(projectName));
    setIndex(id);

    document.title = capitalizeFirstLetter(projectName);
  }, [projectName, list]);

  const data = GetObjectData({ type: "Projects" });

  if (!data) {
    return (
      <div className="Project">
        <div className="pp-header">
          <Void type="m" cla={"ph-message"} char={10} />

          <Void type="m" cla={"ph-tittle"} char={10} />

          <Void type="parraf" />

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
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 0%), url(${data.header.backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="ph-message" onClick={handleClick}>
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
