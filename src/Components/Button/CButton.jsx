import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import "./CButton.scss";

export function CButton({ onClick, left = false }) {
  return (
    <button id="CButton" onClick={onClick}>
      {left ? <GoArrowLeft /> : <GoArrowRight />}
    </button>
  );
}
