import Request from "../../Pages/Requests/Request";
import Skills from "../../Pages/Skills/Skills";
import Steps from "../../Pages/Steps/Steps";
import "./Contact.scss";

function Contact() {
  return (
    <div className="Contact">
      <Request />
      <Steps />
      <Skills />
    </div>
  );
}
export default Contact;
