import { useEffect, useState } from "react";
import About from "./About.json";
import { CButton } from "../../Components/Button/CButton";
import { useParams } from "react-router-dom";
import { useLanguage } from "./../../Context/LanguageContext";

import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";

export function ProfileCont() {
  const [index, setIndex] = useState(0);
  const [data, setData] = useState(null);
  const { language, setLanguage } = useLanguage();
  const { lang } = useParams();

  const PageName = "About";
  const datos = FetchDataComponent({ PageName });

  useEffect(() => {
    // Simulating fetching data from JSON file
    setData(datos);
  }, [datos]);

  const handlePrev = () => {
    setIndex((prevIndex) =>
      prevIndex === 0 ? data.paragraphs.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setIndex((prevIndex) =>
      prevIndex === data.paragraphs.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-cont">
      <div className="header-cont">
        <span>{data.header.section}</span> {data.header.title}
      </div>
      <div className="profile">
        <div className="sec-1">
          <div className="profile-pic">
            <img src={data.profile.imageSrc} alt="profilepic" />
          </div>
          <div>
            <div>{data.profile.name}</div>
            <div>{data.profile.role}</div>
            <div>{data.profile.username}</div>

            <CButton onClick={handlePrev} left={true} />

            <CButton onClick={handleNext} />
          </div>
        </div>
        <div className="profile-content">
          <p>{data.paragraphs[index]}</p>
        </div>
      </div>
    </div>
  );
}
