import "./About.scss";

import { History } from "../../Pages/About/History";
import { ProfileCont } from "../../Pages/About/ProfileCont";
import { BlogCont } from "../../Pages/About/BlogCont";

function About() {
  return (
    <div className="About">
      <BlogCont />
      <ProfileCont />
      <History />
    </div>
  );
}
export default About;
