/* eslint-disable react/prop-types */
import { useState } from "react";
import "./TextModal.scss";
import { Button } from "./../Button/Button";

export const TextModal = ({ tmContent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReadMore = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="tm-content">
      <p className="summary">{tmContent.summary}</p>

      <Button handleClick={handleReadMore} text={tmContent.readMore} />

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
