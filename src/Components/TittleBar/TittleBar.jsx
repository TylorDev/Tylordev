import { CButton } from "../Button/CButton";
import "./TittleBar.scss";

export function TittleBar({
  tittle,
  handlePrev,
  handleNext,
  hideTittle = false,
  hideButtons = false,
  reverseOrder = false,
  hiddeLine = false,
}) {
  return (
    <div
      className={`tittle-bar ${reverseOrder ? "reverse" : ""}${
        hiddeLine ? "line" : ""
      }`}
    >
      {!hideTittle && <span className="tittle-bar__title">{tittle}</span>}
      {!hideButtons && (
        <div className="tittle-bar__buttons">
          <CButton onClick={handlePrev} left={true} />
          <CButton onClick={handleNext} />
        </div>
      )}
    </div>
  );
}
