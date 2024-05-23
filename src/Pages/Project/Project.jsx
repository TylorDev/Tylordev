/* eslint-disable react/prop-types */
import "./Project.scss";
import { GoArrowRight } from "react-icons/go";
import data from "./Project.json";
import { useState } from "react";

function Project() {
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

const TextModal = ({ tmContent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadMore = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="tm-content">
      {console.log(tmContent)}
      <p className="summary">{tmContent.summary}</p>
      <button className="button" onClick={handleReadMore}>
        {tmContent.readMore}
      </button>
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <p>{tmContent.modalContent}</p>
              <button className="button close" onClick={handleClose}>
                {tmContent.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
