/* eslint-disable react/prop-types */
import Request from "../../Pages/Requests/Request";
import Skills from "../../Pages/Skills/Skills";
import Steps from "../../Pages/Steps/Steps";
import "./Resources.scss";

function Resources() {
  return (
    <div className="Resources">
      <div id="request">
        <Request />
      </div>
      <div id="skills">
        <Skills />
      </div>
      <div id="steps">
        <Steps />
      </div>
    </div>
  );
}
export default Resources;
