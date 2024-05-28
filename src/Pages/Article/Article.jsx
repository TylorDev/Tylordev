/* eslint-disable react/prop-types */
import "./Article.scss";
import Research from "./../Research/Research";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "../../Context/LanguageContext";

function Article() {
  const [data, setData] = useState(null);
  const { id } = useParams();

  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/src/API/${language}/Articles/${id}.json`
        );
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching the JSON data:", error);
      }
    };

    fetchData();
  }, [id, language]);

  if (!data) {
    return <div>Loading...</div>;
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
            <p className="ar-paragraf">{section.paragraph}</p>

            <ImageModal src={section.image} alt="Descripción de la imagen" />
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
        <img src={src} alt={alt} className="modal-image" />
      </div>
    </div>
  );
};

export default Article;
