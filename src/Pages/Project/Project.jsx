/* eslint-disable react/prop-types */
import "./Project.scss";
import { GoArrowRight } from "react-icons/go";
import data from "./Project.json";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TextModal } from "../../Components/TextModal/TextModal";
import { useLanguage } from "../../Context/LanguageContext";

function Project() {
  const [data, setData] = useState(null);
  const { projectName } = useParams();
  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();
  console.log(lang);
  if (lang !== language) {
    setLanguage(lang);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://raw.githubusercontent.com/TylorDev/Tylordev/main/src/API/${language}/Projects/${projectName}.json`
        );
        if (!response.ok) {
          throw new Error(`Error fetching ${projectName}.json`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching the JSON data:", error);
      }
    };

    fetchData();
  }, [projectName, language]);

  if (!data) {
    return <div>Loading...</div>;
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
