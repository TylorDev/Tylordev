import { useState } from "react";
import { CButton } from "../../Components/Button/CButton";
import FetchDataComponent from "./../../Components/FetchDataComponent/FetchDataComponent";
import { Void } from "./../../Components/Void/Void";
export function ProfileCont() {
  const [index, setIndex] = useState(0);

  const PageName = "About";
  const data = FetchDataComponent(PageName);

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
    return (
      <div className="profile-cont">
        <div className="header-cont">
          <Void type={"span"} char={5} /> <Void type={"div"} char={5} />
        </div>
        <div className="profile">
          <div className="sec-1">
            <div className="profile-pic">
              <Void type={"img"} />
            </div>
            <div>
              <Void type={"parraf"} lines={3} margin={0.5} range="15-15" />

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
          </div>
          <div className="profile-content">
            <Void type={"parraf"} lines={5} margin={0.5} />
          </div>
        </div>
      </div>
    );
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
