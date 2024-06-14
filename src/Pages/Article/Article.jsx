/* eslint-disable react/prop-types */
import "./Article.scss";
import Research from "./../Research/Research";
import { useState } from "react";
import { Void } from "./../../Components/Void/Void";
import GetObjectData from "./../../Components/GetObjectData/GetObjectData";
import data from "./1.json";
function Article() {
  // const data = GetObjectData({ type: "Articles" });
  if (!data) {
    return (
      <div className="Article">
        <Void type="mirror" cla={"ar-banner"} />

        <div className="ar-content">
          <Void type="m" cla={"ar-tittle"} char={6} />
          <div className="ar-section">
            <Void type="parraf" margin={0.1} lines={15} range="70-75" />

            <Void type="mirror" cla={"image-modal"} />
          </div>
          <div className="ar-section">
            <Void type="parraf" margin={0.1} lines={15} range="70-75" />

            <Void type="mirror" cla={"image-modal"} />
          </div>
        </div>
        <Research title={false} limit={4} />
      </div>
    );
  }

  return (
    <div className="Article">
      <div className="ar-banner">
        <img src={data.bannerImage} alt="" />
      </div>
      <div className="ar-content">
        <div className="ar-tittle">{data.contentTitle}</div>
        {data.sections.map((section, index) => (
          <div className="ar-section" key={index}>
            {section.tittle && (
              <div className="sec-tittle">{section.tittle}</div>
            )}
            <p className="ar-paragraf">{section.paragraph}</p>

            {section.image && (
              <ImageModal src={section.image} alt="Descripción de la imagen" />
            )}
          </div>
        ))}
      </div>
      <Research
        tittle={data.researchProps.tittle}
        limit={data.researchProps.limit}
        style={data.researchProps.style}
      />
    </div>
  );
}

const ImageModal = ({ src, alt }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="image-modal">
      <img src={src} alt={alt} className="image" onClick={handleImageClick} />
      {isOpen && <Modal src={src} alt={alt} onClose={handleCloseModal} />}
    </div>
  );
};

const Modal = ({ src, alt, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {src && <img src={src} alt={alt} className="modal-image" />}
      </div>
    </div>
  );
};

export default Article;
