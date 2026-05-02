import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiEye } from "react-icons/fi";
import { LOCALES, type Locale } from "../../lib/types";
import "./PreviewToolbar.scss";

interface Props {
  locale: Locale;
  onLocale: (l: Locale) => void;
  editPath: string;
  isDraft: boolean;
}

export default function PreviewToolbar({ locale, onLocale, editPath, isDraft }: Props) {
  const nav = useNavigate();
  return (
    <div className="pvtbar">
      <div className="pvtbar-inner container">
        <button className="pvtbar-btn" onClick={() => nav(editPath)}>
          <FiArrowLeft /> Exit preview
        </button>

        <div className="pvtbar-center">
          <FiEye />
          <span>Preview mode</span>
          {isDraft && <span className="pvtbar-draft">Draft</span>}
        </div>

        <div className="pvtbar-right">
          <div className="pvtbar-locales">
            {LOCALES.map((l) => (
              <button
                key={l}
                className={`pvtbar-loc ${l === locale ? "active" : ""}`}
                onClick={() => onLocale(l)}
              >
                {l}
              </button>
            ))}
          </div>
          <button className="pvtbar-btn primary" onClick={() => nav(editPath)}>
            <FiEdit2 /> Edit
          </button>
        </div>
      </div>
    </div>
  );
}
