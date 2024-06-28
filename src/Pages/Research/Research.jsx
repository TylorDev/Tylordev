import { useState } from "react";

import "./Research.scss";
import "./Research-mobile.scss";
import { useNavigate } from "react-router-dom";
import { CButton } from "./../../Components/Button/CButton";

import { useLanguage } from "./../../Context/LanguageContext";
import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { Void } from "../../Components/Void/Void";
import GetData from "./../../Components/GetData/GetData";
import { TittleBar } from "./../../Components/TittleBar/TittleBar";
import { ArticleCard } from "../../Components/ArticleCard/ArticleCard";

function Research({ title = true, limit = false, style }) {
  const content = FetchDataComponent("researchContent");
  const datos = content?.Research ?? [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const { language } = useLanguage();

  const handleClick = (blogId) => {
    navigate(`/${language}/research/${blogId}`);
    console.log(blogId);
  };

  const fileType = "Articles";

  const data = GetData({ fileType });

  const displayedArticles = data
    .slice(currentIndex, currentIndex + 4)
    .concat(data.slice(0, Math.max(0, currentIndex + 4 - data.length)));

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 4 + data.length) % data.length);
  };

  if (!content) {
    return (
      <div className="Research">
        <div className="b-buttons" style={style}>
          <Void type="span" />
          <div>
            <Void
              id="CButton"
              type={"button"}
              char={2}
              marginX={1}
              radius={5}
            />
            <Void
              id="CButton"
              type={"button"}
              char={2}
              marginX={1}
              radius={5}
            />
          </div>
        </div>

        <div className="r-articles">
          {Array(8)
            .fill("")
            .map((_, index) => (
              <div className="r-article" key={index}>
                <div className="rr-cover">
                  <Void type={"img"} />
                </div>
                <div className="rr-tittle"></div>
              </div>
            ))}
        </div>
      </div>
    );
  }
  return (
    <div className="Research">
      <TittleBar
        tittle={title ? datos.title : ""}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />

      <div className="r-articles">
        {(limit ? displayedArticles : data).map((article, index) => (
          <ArticleCard
            key={index}
            article={article}
            handleClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}

export default Research;
